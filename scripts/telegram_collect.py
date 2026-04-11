#!/usr/bin/env python3
"""
telegram_collect.py — Polls Telegram for weekly plan response, writes to Rotation DB.

Parses a comprehensive weekly plan template and stores it as JSON in the
Rotation DB so weekly_scheduler.py can build a smart daily schedule.

Required env vars:
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NOTION_TOKEN, ROTATION_DB_ID
"""

import os
import re
import sys
import json
import urllib.request
import urllib.parse
from datetime import date, timedelta, datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

TELEGRAM_BOT_TOKEN = _clean(os.environ["TELEGRAM_BOT_TOKEN"])
TELEGRAM_CHAT_ID   = _clean(os.environ["TELEGRAM_CHAT_ID"])
TELEGRAM_API       = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

NOTION_TOKEN   = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", "29d51fc8-512b-4415-97c8-67121564b4f2"))

from notion_client import Client
notion = Client(auth=NOTION_TOKEN)

# ── Day mapping ───────────────────────────────────────────────────────────────
HE_TO_EN = {
    "ראשון": "Sun", "שני": "Mon", "שלישי": "Tue",
    "רביעי": "Wed", "חמישי": "Thu", "שישי": "Fri", "שבת": "Sat",
}

# ── Telegram helpers ──────────────────────────────────────────────────────────

def tg_get(method: str, params: dict = None) -> dict:
    url = f"{TELEGRAM_API}/{method}"
    if params:
        url += "?" + "&".join(f"{k}={urllib.parse.quote(str(v))}" for k, v in params.items())
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read())


def send_message(text: str, parse_mode: str = "HTML") -> None:
    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": parse_mode,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{TELEGRAM_API}/sendMessage", data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def get_recent_response(max_age_seconds: int = 7200) -> str | None:
    """Return the most recent message that looks like a plan response."""
    updates = tg_get("getUpdates", {"limit": 30, "allowed_updates": "message"})
    if not updates.get("ok"):
        return None
    now = datetime.now(timezone.utc).timestamp()
    for update in reversed(updates.get("result", [])):
        msg = update.get("message", {})
        if str(msg.get("chat", {}).get("id")) != TELEGRAM_CHAT_ID:
            continue
        if now - msg.get("date", 0) > max_age_seconds:
            continue
        text = msg.get("text", "")
        if "סוג:" in text:
            return text
    return None

# ── Parser ────────────────────────────────────────────────────────────────────

def parse_days(val: str) -> list[str]:
    """Convert Hebrew (or English) day names to English 3-letter codes."""
    if val.strip() in ("—", "לא", "", "-", "אין"):
        return []
    days = []
    for part in re.split(r"[,،\s]+", val.strip()):
        part = part.strip()
        if part in HE_TO_EN:
            days.append(HE_TO_EN[part])
        elif part in ("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"):
            days.append(part)
    return days


def parse_int(val: str, default: int = 0) -> int:
    try:
        return int(re.sub(r'\D', '', val) or str(default))
    except ValueError:
        return default


def parse_response(text: str) -> dict:
    """Parse filled-in questionnaire template into a structured plan dict."""
    plan: dict = {
        "week_type":           "Home",
        "lihi_days":           ["Tue", "Fri", "Sat"],
        "basketball_days":     [],
        "work_days":           [],
        "course_view_min":     0,
        "course_practice_min": 0,
        "system_min":          0,
        "dad_days":            [],
        "grandparents_days":   [],
        "friends_count":       0,
        "blocked_days":        [],
        "notes":               "",
    }

    for line in text.splitlines():
        line = line.strip()
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()

        if key == "סוג":
            plan["week_type"] = "Home" if "בית" in val else "Base"
        elif key == "ליהי":
            plan["lihi_days"] = parse_days(val)
        elif key == "כדורסל":
            plan["basketball_days"] = parse_days(val)
        elif key == "עבודה":
            plan["work_days"] = parse_days(val)
        elif key == "קורס-צפייה":
            plan["course_view_min"] = parse_int(val)
        elif key == "קורס-תרגול":
            plan["course_practice_min"] = parse_int(val)
        elif key == "מערכת":
            plan["system_min"] = parse_int(val)
        elif key == "אבא":
            plan["dad_days"] = parse_days(val)
        elif key == "סבא":
            plan["grandparents_days"] = parse_days(val)
        elif key == "חברים":
            plan["friends_count"] = parse_int(val)
        elif key == "חסומים":
            plan["blocked_days"] = parse_days(val)
        elif key == "הערות":
            plan["notes"] = val

    return plan

# ── Notion helpers ────────────────────────────────────────────────────────────

def get_next_sunday() -> date:
    today = date.today()
    days_until_sunday = (6 - today.weekday()) % 7
    return today + timedelta(days=days_until_sunday if days_until_sunday > 0 else 7)


def ensure_plan_json_field() -> None:
    """Add 'Plan JSON' rich_text property to Rotation DB if missing."""
    try:
        notion.databases.update(
            database_id=ROTATION_DB_ID,
            properties={"Plan JSON": {"rich_text": {}}}
        )
        print("✅ Plan JSON field ensured in Rotation DB.")
    except Exception as e:
        print(f"⚠️ Could not update DB schema: {e}")


def entry_exists(week_start: date) -> bool:
    res = notion.databases.query(
        database_id=ROTATION_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": (week_start + timedelta(days=6)).isoformat()}},
        ]},
    )
    return len(res.get("results", [])) > 0


def create_rotation_entry(week_start: date, plan: dict) -> None:
    if entry_exists(week_start):
        print(f"Entry already exists for {week_start} — skipping.")
        return

    plan_json_str = json.dumps(plan, ensure_ascii=False)

    notion.pages.create(
        parent={"database_id": ROTATION_DB_ID},
        properties={
            "Name":             {"title": [{"text": {"content": f"שבוע {week_start.strftime('%d/%m')}"}}]},
            "Week Type":        {"select": {"name": plan["week_type"]}},
            "Date":             {"date": {"start": week_start.isoformat()}},
            "Basketball Days":  {"multi_select": [{"name": d} for d in plan["basketball_days"]]},
            "VR Events Count":  {"number": 0},
            "Schedule Created": {"checkbox": False},
            "Plan JSON":        {"rich_text": [{"text": {"content": plan_json_str}}]},
        },
    )
    print(f"✅ Rotation entry created for {week_start}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("🔍 Polling Telegram for weekly plan response…")
    response_text = get_recent_response(max_age_seconds=7200)

    if not response_text:
        send_message(
            "⚠️ לא התקבלה תשובה.\n\n"
            "מלא ושלח:\n\n"
            "<pre>סוג: בית\nליהי: שלישי,שישי,שבת\n"
            "כדורסל: שני,רביעי,חמישי\nעבודה: —\n"
            "קורס-צפייה: 90\nקורס-תרגול: 60\nמערכת: 60\n"
            "אבא: שישי\nסבא: לא\nחברים: 0\nחסומים: —\nהערות: </pre>"
        )
        sys.exit(1)

    print("📨 Response received.")
    plan = parse_response(response_text)
    print(f"📋 Plan: {json.dumps(plan, ensure_ascii=False, indent=2)}")

    next_sunday = get_next_sunday()
    ensure_plan_json_field()
    create_rotation_entry(next_sunday, plan)

    lihi_he  = ", ".join(plan["lihi_days"])       or "—"
    bball_he = ", ".join(plan["basketball_days"]) or "—"

    send_message(
        f"✅ <b>שבוע {next_sunday.strftime('%d/%m')} נשמר!</b>\n\n"
        f"📋 סוג: <b>{'בית' if plan['week_type'] == 'Home' else 'בסיס'}</b>\n"
        f"💛 ליהי: {lihi_he}\n"
        f"🏀 כדורסל: {bball_he}\n"
        f"🎬 קורס צפייה: {plan['course_view_min']} דק׳\n"
        f"🎬 קורס תרגול: {plan['course_practice_min']} דק׳\n"
        f"💻 מערכת: {plan['system_min']} דק׳\n\n"
        f"<i>לו\"ז מפורט ייווצר ביום ראשון בבוקר.</i>"
    )
    print("Done.")


if __name__ == "__main__":
    main()
