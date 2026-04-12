#!/usr/bin/env python3
"""
weekly_planner_bot.py — Interactive weekly planner with Telegram inline keyboards.

Conducts a full conversation via button taps — no typing needed.
Runs as a single GitHub Actions job every Sunday at 20:00 Israel time.
Times out after 25 minutes if no interaction.

Required env vars:
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NOTION_TOKEN, ROTATION_DB_ID
"""

import os
import re
import sys
import json
import time
import urllib.request
import urllib.error
from datetime import date, timedelta, datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

BOT_TOKEN      = _clean(os.environ["TELEGRAM_BOT_TOKEN"])
CHAT_ID        = _clean(os.environ["TELEGRAM_CHAT_ID"])
API            = f"https://api.telegram.org/bot{BOT_TOKEN}"
NOTION_TOKEN   = os.environ.get("NOTION_TOKEN", "").strip()
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", "29d51fc8-512b-4415-97c8-67121564b4f2"))

TIMEOUT_SECS = 25 * 60

DAYS_EN   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
DAY_LABEL = {"Mon": "ב׳", "Tue": "ג׳", "Wed": "ד׳", "Thu": "ה׳",
             "Fri": "ו׳", "Sat": "ש׳", "Sun": "א׳"}

# ── Telegram API ──────────────────────────────────────────────────────────────

def tg(method: str, data: dict = None) -> dict:
    payload = json.dumps(data).encode() if data else None
    req = urllib.request.Request(
        f"{API}/{method}",
        data=payload,
        headers={"Content-Type": "application/json"} if payload else {},
    )
    try:
        with urllib.request.urlopen(req, timeout=35) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"TG {e.code}: {e.read().decode()}")
        return {"ok": False}


def send(text: str, keyboard=None) -> int:
    d = {"chat_id": CHAT_ID, "text": text, "parse_mode": "HTML"}
    if keyboard:
        d["reply_markup"] = {"inline_keyboard": keyboard}
    r = tg("sendMessage", d)
    return r.get("result", {}).get("message_id", 0)


def edit(msg_id: int, text: str, keyboard=None) -> None:
    d = {"chat_id": CHAT_ID, "message_id": msg_id,
         "text": text, "parse_mode": "HTML",
         "reply_markup": {"inline_keyboard": keyboard or []}}
    tg("editMessageText", d)


def answer_cb(cb_id: str, text: str = "") -> None:
    tg("answerCallbackQuery", {"callback_query_id": cb_id, "text": text})


def poll_updates(offset: int, timeout: int = 20) -> list:
    r = tg("getUpdates", {
        "offset": offset, "timeout": timeout,
        "allowed_updates": ["callback_query"],
    })
    return r.get("result", [])

# ── Keyboard builders ─────────────────────────────────────────────────────────

def kb_count(max_n: int = 4) -> list:
    return [[{"text": str(i), "callback_data": f"n:{i}"} for i in range(max_n + 1)]]


def kb_choice(options: list) -> list:
    """options = list of (label, value)"""
    rows, row = [], []
    for label, value in options:
        row.append({"text": label, "callback_data": f"c:{value}"})
        if len(row) == 2:
            rows.append(row)
            row = []
    if row:
        rows.append(row)
    return rows


def kb_days(selected: list) -> list:
    row1 = [{"text": ("✅ " if d in selected else "") + DAY_LABEL[d],
             "callback_data": f"day:{d}"} for d in DAYS_EN[:4]]
    row2 = [{"text": ("✅ " if d in selected else "") + DAY_LABEL[d],
             "callback_data": f"day:{d}"} for d in DAYS_EN[4:]]
    row3 = [{"text": "✅ סיום", "callback_data": "days:done"}]
    return [row1, row2, row3]


def kb_multi(options: list, selected: list) -> list:
    rows, row = [], []
    for label, value in options:
        mark = "✅ " if value in selected else ""
        row.append({"text": f"{mark}{label}", "callback_data": f"mc:{value}"})
        if len(row) == 2:
            rows.append(row)
            row = []
    if row:
        rows.append(row)
    rows.append([{"text": "✅ סיום", "callback_data": "mc:done"}])
    return rows


def kb_minutes(values: list) -> list:
    return [[{"text": (str(m) + " דק׳") if m else "דלג", "callback_data": f"m:{m}"}
             for m in values]]


def kb_wake() -> list:
    """Wake time keyboard — 3 per row, 05:30–11:00."""
    times = ["05:30","06:00","06:30","07:00","07:30","08:00",
             "08:30","09:00","09:30","10:00","10:30","11:00"]
    rows, row = [], []
    for t in times:
        row.append({"text": t, "callback_data": f"c:{t}"})
        if len(row) == 3:
            rows.append(row)
            row = []
    if row:
        rows.append(row)
    return rows

# ── Planner session ───────────────────────────────────────────────────────────

class Planner:
    def __init__(self):
        self.offset = 0
        self.start  = time.time()
        self.plan   = {
            "week_type":            "Home",
            "lihi_days":            [],
            "lihi_type":            {},    # {day_en: type_str}
            "basketball_days":      [],
            "basketball_optional":  [],
            "tennis_days":          [],
            "course_view_min":      0,
            "course_view_days":     [],
            "course_view_time":     "בוקר",
            "course_practice_min":  0,
            "course_practice_days": [],
            "course_practice_time": "צהריים",
            "system_min":           0,
            "system_type":          "",
            "system_days":          [],
            "system_time":          "בוקר",
            "work_days":            [],
            "work_type":            "",
            "work_time_of_day":     "בוקר",
            "wake_times":           {},   # {day_en: "HH:MM"} — per-day wake time
            "vr_count":             0,
            "dad_days":             [],
            "dad_type":             "",
            "grandparents_days":    [],
            "friends_count":        0,
            "friends_type":         "",
            "friends_days":         [],
            "personal_activities":  [],
            "book_min":             0,
            "blocked_days":         [],
        }

    # ── Polling ───────────────────────────────────────────────────────────────

    def _timed_out(self) -> bool:
        return time.time() - self.start > TIMEOUT_SECS

    def _wait(self):
        """Block until a callback_query from our chat arrives. Returns (cb_id, data)."""
        while not self._timed_out():
            updates = poll_updates(self.offset)
            for u in updates:
                self.offset = u["update_id"] + 1
                if "callback_query" in u:
                    cb = u["callback_query"]
                    if str(cb["message"]["chat"]["id"]) == CHAT_ID:
                        return cb["id"], cb["data"]
        return None, None

    # ── Ask primitives ────────────────────────────────────────────────────────

    def ask_choice(self, q: str, options: list) -> str | None:
        """Single-select. Returns chosen value string."""
        msg_id = send(q, kb_choice(options))
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return None
            if data and data.startswith("c:"):
                val = data[2:]
                label = next((l for l, v in options if v == val), val)
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {label}</i>")
                return val
            answer_cb(cb_id)

    def ask_count(self, q: str, max_n: int = 4) -> int:
        """Count picker 0–max_n. Returns int."""
        msg_id = send(q, kb_count(max_n))
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return 0
            if data and data.startswith("n:"):
                n = int(data[2:])
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {n}</i>")
                return n
            answer_cb(cb_id)

    def ask_minutes(self, q: str, values: list) -> int:
        """Minutes picker. Returns int."""
        msg_id = send(q, kb_minutes(values))
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return 0
            if data and data.startswith("m:"):
                m = int(data[2:])
                label = f"{m} דק׳" if m else "דלג"
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {label}</i>")
                return m
            answer_cb(cb_id)

    def ask_wake_time(self, q: str) -> str:
        """Wake time picker (3-per-row). Returns 'HH:MM' string."""
        msg_id = send(q, kb_wake())
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return "09:00"
            if data and data.startswith("c:"):
                val = data[2:]
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {val}</i>")
                return val
            answer_cb(cb_id)

    def ask_days(self, q: str) -> list:
        """Multi-select day picker. Returns list of day_en."""
        selected = []
        msg_id = send(q, kb_days(selected))
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return selected
            if data and data.startswith("day:"):
                day = data[4:]
                if day in selected:
                    selected.remove(day)
                else:
                    selected.append(day)
                answer_cb(cb_id)
                edit(msg_id, q, kb_days(selected))
            elif data == "days:done":
                labels = " ".join(DAY_LABEL[d] for d in selected) if selected else "אין"
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {labels}</i>")
                return selected
            else:
                answer_cb(cb_id)

    def ask_multi(self, q: str, options: list, max_select: int = 3) -> list:
        """Multi-select from option list. Returns list of chosen values."""
        selected = []
        msg_id = send(q, kb_multi(options, selected))
        while True:
            cb_id, data = self._wait()
            if cb_id is None:
                return selected
            if data and data.startswith("mc:") and data != "mc:done":
                val = data[3:]
                if val in selected:
                    selected.remove(val)
                elif len(selected) < max_select:
                    selected.append(val)
                answer_cb(cb_id)
                edit(msg_id, q, kb_multi(options, selected))
            elif data == "mc:done":
                labels = ", ".join(selected) if selected else "—"
                answer_cb(cb_id, "✅")
                edit(msg_id, f"{q}\n\n<i>✅ {labels}</i>")
                return selected
            else:
                answer_cb(cb_id)

    # ── Full questionnaire ────────────────────────────────────────────────────

    def run(self) -> dict | None:
        next_mon = _get_next_monday()
        send(f"📅 <b>תכנון שבוע {next_mon.strftime('%d/%m')}</b>\n\nנתחיל! 🚀")
        time.sleep(1)

        p = self.plan

        # Week type
        wt = self.ask_choice(
            "📋 <b>סוג שבוע?</b>",
            [("🏠 בית", "Home"), ("🪖 בסיס", "Base")]
        )
        if wt is None: return None
        p["week_type"] = wt

        if wt == "Base":
            send("🪖 שבוע בסיס — אין מה לתכנן. נשמור ונסגור.")
            return p

        # ── ליהי ──────────────────────────────────────────────────────────────
        n = self.ask_count("💛 <b>כמה ימים עם ליהי השבוע?</b>")
        if n and n > 0:
            p["lihi_days"] = self.ask_days("💛 <b>באיזה ימים עם ליהי?</b>")
            if p["lihi_days"]:
                typ = self.ask_choice(
                    "💛 <b>סוג המפגש עם ליהי?</b>\n(חל על כל הימים שבחרת)",
                    [("🌙 ערב", "ערב"), ("☀️ יום מלא", "יום-מלא"),
                     ("🌃 לינה", "לינה"), ("🎬 יציאה", "יציאה"),
                     ("🛋 זמן רגוע בבית", "זמן-רגוע")]
                )
                p["lihi_type"] = {d: typ for d in p["lihi_days"]}

        # ── כדורסל ────────────────────────────────────────────────────────────
        n = self.ask_count("🏀 <b>כמה פעמים כדורסל השבוע?</b>")
        if n and n > 0:
            p["basketball_days"] = self.ask_days("🏀 <b>באיזה ימים כדורסל?</b>")
            if len(p["basketball_days"]) > 1:
                opt = self.ask_choice(
                    "🏀 <b>יש מתוכם ימים אופציונליים?</b>",
                    [("כן", "yes"), ("לא — כולם קבועים", "no")]
                )
                if opt == "yes":
                    p["basketball_optional"] = self.ask_days(
                        "🏀 <b>בחר את הימים האופציונליים:</b>"
                    )

        # ── VR ────────────────────────────────────────────────────────────────
        p["vr_count"] = self.ask_count("🥽 <b>אירועי VR — Enjoy VR השבוע?</b>", max_n=3)

        # ── טניס ─────────────────────────────────────────────────────────────
        tennis = self.ask_choice(
            "🎾 <b>טניס השבוע?</b>",
            [("כן — ד׳+ה׳ (קבוע)", "default"),
             ("כן — בחר ימים", "custom"),
             ("לא", "none")]
        )
        if tennis == "default":
            p["tennis_days"] = ["Wed", "Thu"]
        elif tennis == "custom":
            p["tennis_days"] = self.ask_days("🎾 <b>באיזה ימים טניס?</b>")

        # ── קורס עריכה ───────────────────────────────────────────────────────
        p["course_view_min"] = self.ask_minutes(
            "🎬 <b>קורס עריכה — צפייה</b>\nסה״כ כמה דקות השבוע?",
            [0, 60, 90, 120, 150]
        )
        if p["course_view_min"] > 0:
            p["course_view_days"] = self.ask_days("🎬 <b>צפייה — באיזה ימים?</b>")
            p["course_view_time"] = self.ask_choice(
                "🎬 <b>צפייה — באיזה חלק ביום?</b>",
                [("☀️ בוקר", "בוקר"), ("🌤 צהריים", "צהריים")]
            ) or "בוקר"

        p["course_practice_min"] = self.ask_minutes(
            "🎬 <b>קורס עריכה — תרגול</b>\nסה״כ כמה דקות השבוע?",
            [0, 30, 60, 90, 120]
        )
        if p["course_practice_min"] > 0:
            p["course_practice_days"] = self.ask_days("🎬 <b>תרגול — באיזה ימים?</b>")
            p["course_practice_time"] = self.ask_choice(
                "🎬 <b>תרגול — באיזה חלק ביום?</b>",
                [("🌤 צהריים", "צהריים"), ("🌙 ערב", "ערב")]
            ) or "צהריים"

        # ── מערכת ────────────────────────────────────────────────────────────
        p["system_min"] = self.ask_minutes(
            "💻 <b>עבודה על המערכת</b>\nסה״כ כמה דקות השבוע?",
            [0, 30, 60, 90, 120]
        )
        if p["system_min"] > 0:
            p["system_type"] = self.ask_choice(
                "💻 <b>סוג עבודה על המערכת?</b>",
                [("🔧 לוגיקה", "בניית-לוגיקה"),
                 ("📝 פרומפטים", "כתיבת-פרומפטים"),
                 ("🔗 אוטומציות", "חיבור-אוטומציות"),
                 ("🧪 בדיקות", "בדיקות"),
                 ("🎨 UI", "שיפור-UI")]
            )
            p["system_days"] = self.ask_days("💻 <b>מערכת — באיזה ימים?</b>")
            p["system_time"] = self.ask_choice(
                "💻 <b>מערכת — באיזה חלק ביום?</b>",
                [("☀️ בוקר", "בוקר"), ("🌤 צהריים", "צהריים"), ("🌙 ערב", "ערב")]
            ) or "בוקר"

        # ── עבודה ────────────────────────────────────────────────────────────
        n = self.ask_count("💼 <b>ימי עבודה / משמרות?</b>\n(0 = שבוע בית ללא עבודה)")
        if n and n > 0:
            p["work_days"] = self.ask_days("💼 <b>באיזה ימים עבודה?</b>")
            if p["work_days"]:
                p["work_type"] = self.ask_choice(
                    "💼 <b>סוג עבודה?</b>",
                    [("🏢 משמרת", "משמרת"), ("⚡ ספונטנית", "ספונטנית"),
                     ("🚗 עם נסיעות", "עם-נסיעות"), ("📦 קצרה", "קצרה")]
                )
                p["work_time_of_day"] = self.ask_choice(
                    "💼 <b>עבודה — באיזה חלק ביום?</b>",
                    [("☀️ בוקר", "בוקר"), ("🌤 צהריים", "צהריים"), ("🌙 ערב", "ערב")]
                ) or "בוקר"

        # ── אבא ──────────────────────────────────────────────────────────────
        dad = self.ask_choice("👨‍👦 <b>אבא השבוע?</b>", [("כן", "yes"), ("לא", "no")])
        if dad == "yes":
            p["dad_days"] = self.ask_days("👨‍👦 <b>באיזה יום?</b>")
            if p["dad_days"]:
                p["dad_type"] = self.ask_choice(
                    "👨‍👦 <b>סוג מפגש?</b>",
                    [("🌙 ערב", "ערב"), ("☀️ קצר", "מפגש-קצר"), ("🌅 ארוך", "מפגש-ארוך")]
                )

        # ── סבא וסבתא ────────────────────────────────────────────────────────
        gp = self.ask_choice("👵 <b>סבא וסבתא השבוע?</b>", [("כן", "yes"), ("לא", "no")])
        if gp == "yes":
            p["grandparents_days"] = self.ask_days("👵 <b>באיזה יום?</b>")

        # ── חברים ────────────────────────────────────────────────────────────
        p["friends_count"] = self.ask_count("👬 <b>חברים השבוע?</b>\nכמה מפגשים?", max_n=3)
        if p["friends_count"] > 0:
            p["friends_type"] = self.ask_choice(
                "👬 <b>סוג מפגש?</b>",
                [("🌙 ערב", "ערב"), ("☕ קפה", "קפה"), ("🎯 יציאה", "יציאה")]
            )
            p["friends_days"] = self.ask_days("👬 <b>באיזה ימים?</b>")

        # ── זמן לעצמי ────────────────────────────────────────────────────────
        p["personal_activities"] = self.ask_multi(
            "🧠 <b>זמן לעצמי</b>\nמה חשוב השבוע? (בחר עד 2)",
            [("🚶 הליכה", "הליכה"), ("🎵 מוזיקה", "מוזיקה"),
             ("🪑 לבד", "ישיבה-לבד"), ("💭 חשיבה", "חשיבה"),
             ("😴 מנוחה", "מנוחה"), ("📵 ללא טלפון", "בלי-טלפון")],
            max_select=2
        )

        # ── ספר ──────────────────────────────────────────────────────────────
        p["book_min"] = self.ask_minutes(
            "📖 <b>ספר</b>\nכמה דקות ביום?",
            [0, 20, 30, 45, 60]
        )

        # ── שעת קימה לכל יום ─────────────────────────────────────────────────
        send("⏰ <b>שעת קימה</b>\nנגדיר לכל יום בנפרד:")
        time.sleep(0.5)
        for day_en in DAYS_EN:
            t = self.ask_wake_time(f"⏰ <b>קימה — יום {DAY_LABEL[day_en]}</b>")
            p["wake_times"][day_en] = t

        # ── חסומים ───────────────────────────────────────────────────────────
        p["blocked_days"] = self.ask_days(
            "⛔ <b>ימים חסומים?</b>\n(ימים שלא זמין — לחץ ✅ סיום אם אין)"
        )

        return p

# ── Notion ────────────────────────────────────────────────────────────────────

def _get_next_monday() -> date:
    today = date.today()
    diff  = (7 - today.weekday()) % 7  # days until Monday
    return today + timedelta(days=diff if diff > 0 else 7)


def _resolve_db_id(notion, id_or_page: str) -> str:
    """Return real database ID — handles case where ROTATION_DB_ID points to a page."""
    try:
        notion.databases.retrieve(database_id=id_or_page)
        return id_or_page
    except Exception:
        pass
    print(f"ID {id_or_page} is not a database — searching for Rotation DB…")
    results = notion.search(filter={"property": "object", "value": "database"})
    for db in results.get("results", []):
        title_parts = db.get("title", [])
        name = title_parts[0]["plain_text"] if title_parts else ""
        if "rotation" in name.lower() or "רוטציה" in name.lower():
            print(f"Resolved Rotation DB → {db['id']} ({name})")
            return db["id"]
    all_dbs = results.get("results", [])
    if all_dbs:
        db = all_dbs[0]
        print(f"Warning: using first DB found: {db['id']}")
        return db["id"]
    raise ValueError(f"Could not resolve {id_or_page!r} to a database.")


def _save_to_notion(plan: dict) -> None:
    if not NOTION_TOKEN:
        print("No NOTION_TOKEN — skipping Notion write.")
        return

    from notion_client import Client
    notion = Client(auth=NOTION_TOKEN)

    # Resolve real DB id (handles page-id-as-db-id issue)
    db_id = _resolve_db_id(notion, ROTATION_DB_ID)
    print(f"Using DB ID: {db_id}")

    # Ensure "Plan JSON" rich_text property exists in the DB schema
    try:
        db_meta = notion.databases.retrieve(database_id=db_id)
        if "Plan JSON" not in db_meta.get("properties", {}):
            print("Adding 'Plan JSON' property to DB schema…")
            notion.databases.update(
                database_id=db_id,
                properties={"Plan JSON": {"rich_text": {}}}
            )
            print("DB schema updated.")
        else:
            print("'Plan JSON' property already exists.")
    except Exception as e:
        print(f"WARNING: DB schema check/update failed: {e}")

    next_mon  = _get_next_monday()
    week_end  = next_mon + timedelta(days=7)  # Mon to next Mon (8 days)

    # Check if entry already exists
    try:
        existing = notion.databases.query(
            database_id=db_id,
            filter={"and": [
                {"property": "Date", "date": {"on_or_after":  next_mon.isoformat()}},
                {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
            ]},
        )
        if existing.get("results"):
            page_id = existing["results"][0]["id"]
            print(f"Entry already exists for {next_mon} — updating Plan JSON…")
            notion.pages.update(
                page_id=page_id,
                properties={
                    "Plan JSON": {"rich_text": [{"text": {"content": json.dumps(plan, ensure_ascii=False)[:2000]}}]},
                }
            )
            print(f"✅ Updated Plan JSON for {next_mon}")
            return
    except Exception as e:
        print(f"WARNING: existing-entry query failed: {e}")

    basketball_days = list(dict.fromkeys(
        plan.get("basketball_days", []) + plan.get("basketball_optional", [])
    ))
    plan_json_str = json.dumps(plan, ensure_ascii=False)

    result = notion.pages.create(
        parent={"database_id": db_id},
        properties={
            "Name":             {"title": [{"text": {"content": f"שבוע {next_mon.strftime('%d/%m')}"}}]},
            "Week Type":        {"select": {"name": plan["week_type"]}},
            "Date":             {"date": {"start": next_mon.isoformat()}},
            "Basketball Days":  {"multi_select": [{"name": d} for d in basketball_days]},
            "VR Events Count":  {"number": plan.get("vr_count", 0)},
            "Schedule Created": {"checkbox": False},
        },
    )
    page_id = result["id"]
    print(f"✅ Page created: {page_id}")

    notion.pages.update(
        page_id=page_id,
        properties={
            "Plan JSON": {"rich_text": [{"text": {"content": plan_json_str[:2000]}}]},
        }
    )
    print(f"✅ Plan JSON saved to Notion for week of {next_mon}")


def _send_summary(plan: dict) -> None:
    lihi         = " ".join(DAY_LABEL[d] for d in plan.get("lihi_days", []))       or "—"
    bball        = " ".join(DAY_LABEL[d] for d in plan.get("basketball_days", [])) or "—"
    tennis       = " ".join(DAY_LABEL[d] for d in plan.get("tennis_days", []))     or "—"
    blocked      = " ".join(DAY_LABEL[d] for d in plan.get("blocked_days", []))    or "—"
    work_days_s  = " ".join(DAY_LABEL[d] for d in plan.get("work_days", []))       or "—"
    friends_days = " ".join(DAY_LABEL[d] for d in plan.get("friends_days", []))    or "—"
    next_mon = _get_next_monday()

    work_type     = plan.get("work_type", "") or "—"
    work_time     = plan.get("work_time_of_day", "")
    work_str      = f"{work_days_s} ({work_type}{', ' + work_time if work_time else ''})" if plan.get("work_days") else "—"

    fc = plan.get("friends_count", 0)
    ft = plan.get("friends_type", "") or "—"
    friends_str = f"{fc} מפגשים ({ft}) — {friends_days}" if fc else "—"

    # Course
    cv_min   = plan.get("course_view_min", 0)
    cv_days  = " ".join(DAY_LABEL[d] for d in plan.get("course_view_days", [])) or "—"
    cv_time  = plan.get("course_view_time", "בוקר")
    cp_min   = plan.get("course_practice_min", 0)
    cp_days  = " ".join(DAY_LABEL[d] for d in plan.get("course_practice_days", [])) or "—"
    cp_time  = plan.get("course_practice_time", "צהריים")
    cv_str   = f"{cv_min} דק׳ ({cv_days}—{cv_time})" if cv_min else "—"
    cp_str   = f"{cp_min} דק׳ ({cp_days}—{cp_time})" if cp_min else "—"

    # System
    sys_min  = plan.get("system_min", 0)
    sys_days = " ".join(DAY_LABEL[d] for d in plan.get("system_days", [])) or "—"
    sys_time = plan.get("system_time", "בוקר")
    sys_type = plan.get("system_type", "") or "—"
    sys_str  = f"{sys_min} דק׳ ({sys_days}—{sys_time}) — {sys_type}" if sys_min else "—"

    # Wake times per day
    wake_times = plan.get("wake_times", {})
    wake_str = "  ".join(
        f"{DAY_LABEL[d]}{wake_times[d]}" for d in DAYS_EN if d in wake_times
    ) or "—"

    lines = [
        f"✅ <b>שבוע {next_mon.strftime('%d/%m')} נשמר!</b>\n",
        f"📋 סוג: <b>{'בית' if plan['week_type']=='Home' else 'בסיס'}</b>",
        f"💛 ליהי: {lihi}",
        f"🏀 כדורסל: {bball}",
        f"🎾 טניס: {tennis}",
        f"🎬 צפייה: {cv_str}",
        f"🎬 תרגול: {cp_str}",
        f"💻 מערכת: {sys_str}",
        f"💼 עבודה: {work_str}",
        f"👬 חברים: {friends_str}",
        f"⏰ קימה: {wake_str}",
        f"📖 ספר: {plan.get('book_min',0)} דק׳ ביום",
        f"⛔ חסומים: {blocked}",
        "",
        "<i>הלוז נוצר עכשיו — תוך שניות תקבל קישור לאתר.</i>",
    ]
    send("\n".join(lines))

# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    planner = Planner()
    plan = planner.run()

    if plan is None:
        send("⏰ <b>פג הזמן (25 דקות)</b>\nשלח /start לבוט כדי להתחיל מחדש, ואז הפעל את ה-workflow ידנית.")
        sys.exit(1)

    _save_to_notion(plan)
    _send_summary(plan)
    print("Done.")


if __name__ == "__main__":
    main()
