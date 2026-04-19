#!/usr/bin/env python3
"""
weekly_scheduler.py — Weekly Schedule Generator (individual events).

Reads the Plan JSON stored on the current week's Rotation entry and emits
individual timed events (not day blocks) into the oslife Dashboard
"לוז יומי" DB. Each event is one Notion page with:
    Name     (title)       — "🏀 כדורסל"
    Date     (datetime)    — ISO with time, Asia/Jerusalem
    Category (select)      — one of: אישי / עבודה / למידה / חברתי / ספורט /
                             משפחה / חופשי
    Done     (checkbox)    — false

Usage:
    python weekly_scheduler.py           # run and write to Notion
    python weekly_scheduler.py --dry-run # print payloads, no writes

Required env vars:
    NOTION_TOKEN
    ROTATION_DB_ID
    WEEKLY_DB_ID       (→ "לוז יומי" DB in oslife Dashboard)
"""

from __future__ import annotations

import json
import logging
import math
import os
import re as _re
import sys
from datetime import date, timedelta

from dotenv import load_dotenv
from notion_client import Client

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def _clean(val: str) -> str:
    return _re.sub(r"\s", "", val)


NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = _clean(os.environ["ROTATION_DB_ID"])
WEEKLY_DB_ID = _clean(os.environ["WEEKLY_DB_ID"])

# Week: Mon Tue Wed Thu Fri Sat Sun Mon(next) — 8 days
DAYS_HE = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון", "שני"]
DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"]

DEFAULT_LIHI_DAYS = {"Tue", "Fri", "Sat"}
TENNIS_DAYS = {"Wed", "Thu"}

TIME_ZONE = "Asia/Jerusalem"

notion = Client(auth=NOTION_TOKEN)

# ---------------------------------------------------------------------------
# Category inference — ordered most-specific first
# ---------------------------------------------------------------------------

CATEGORY_MAP: list[tuple[str, str]] = [
    ("🏀", "ספורט"), ("🎾", "ספורט"),
    ("💛", "חברתי"), ("👬", "חברתי"),
    ("👨", "משפחה"), ("👵", "משפחה"),
    ("💼", "עבודה"), ("💻", "עבודה"), ("🥽", "עבודה"), ("🪖", "עבודה"),
    ("🎬", "למידה"), ("📖", "למידה"),
    ("⛔", "חופשי"), ("🌙", "חופשי"), ("🌿", "חופשי"),
    ("☀️", "אישי"), ("🍽", "אישי"), ("😴", "אישי"),
    ("☕", "אישי"), ("🏠", "אישי"), ("✈️", "אישי"),
]


def infer_category(label: str) -> str:
    for emoji, cat in CATEGORY_MAP:
        if emoji in label:
            return cat
    return "אישי"


# ---------------------------------------------------------------------------
# Event page builder (new schema)
# ---------------------------------------------------------------------------

def _event_page(day_date: date, time_str: str, label: str) -> dict:
    h, m = map(int, time_str.split(":"))
    iso_dt = f"{day_date.isoformat()}T{h:02d}:{m:02d}:00"
    return {
        "parent": {"database_id": WEEKLY_DB_ID},
        "properties": {
            "Name": {"title": [{"text": {"content": label}}]},
            "Date": {"date": {"start": iso_dt, "time_zone": TIME_ZONE}},
            "Category": {"select": {"name": infer_category(label)}},
            "Done": {"checkbox": False},
        },
    }


# ---------------------------------------------------------------------------
# Time helpers
# ---------------------------------------------------------------------------

def _time_add(base: str, mins: int) -> str:
    h, m = map(int, base.split(":"))
    total = min(h * 60 + m + mins, 1439)
    return f"{total // 60:02d}:{total % 60:02d}"


def _time_mins(t: str) -> int:
    try:
        h, m = map(int, t.split(":"))
        return h * 60 + m
    except Exception:
        return 9999


# ---------------------------------------------------------------------------
# DB Resolution
# ---------------------------------------------------------------------------

def resolve_db_id(id_or_page: str, hint: str = "") -> str:
    try:
        notion.databases.retrieve(database_id=id_or_page)
        return id_or_page
    except Exception:
        pass
    log.info("ID %s is not a database — searching (hint=%r)…", id_or_page, hint)
    results = notion.search(filter={"property": "object", "value": "database"})
    for db in results.get("results", []):
        title_parts = db.get("title", [])
        name = title_parts[0]["plain_text"] if title_parts else ""
        if hint and hint.lower() in name.lower():
            log.info("Resolved %r → %s (%s)", hint, db["id"], name)
            return db["id"]
    raise ValueError(f"Could not resolve {id_or_page!r} to a database (hint={hint!r}).")


# ---------------------------------------------------------------------------
# Rotation / Plan loading
# ---------------------------------------------------------------------------

def get_week_start() -> date:
    today = date.today()
    wd = today.weekday()  # Mon=0 … Sun=6
    if wd == 6:
        return today + timedelta(days=1)
    return today - timedelta(days=wd)


def find_rotation_entry(week_start: date) -> dict | None:
    week_end = week_start + timedelta(days=6)
    response = notion.databases.query(
        database_id=ROTATION_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
        ]},
    )
    results = response.get("results", [])
    if not results:
        log.warning("No rotation entry for %s – %s", week_start, week_end)
        return None
    if len(results) > 1:
        log.warning("Multiple rotation entries — using first.")
    return results[0]


def read_plan_json(rotation: dict) -> dict:
    try:
        parts = rotation["properties"].get("Plan JSON", {}).get("rich_text", [])
        if parts:
            text = "".join(p["plain_text"] for p in parts)
            return json.loads(text)
    except Exception as e:
        log.warning("Could not parse Plan JSON: %s", e)
    return {}


def delete_week_entries(week_start: date) -> int:
    """Archive all events for this week range (8 days: Mon–Mon inclusive)."""
    week_end = week_start + timedelta(days=7)
    response = notion.databases.query(
        database_id=WEEKLY_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
        ]},
        page_size=100,
    )
    pages = response.get("results", [])
    for page in pages:
        notion.pages.update(page_id=page["id"], archived=True)
    if pages:
        log.info("Archived %d existing events for week %s.", len(pages), week_start)
    return len(pages)


def mark_schedule_created(rotation_page_id: str) -> None:
    notion.pages.update(
        page_id=rotation_page_id,
        properties={"Schedule Created": {"checkbox": True}},
    )
    log.info("Marked Schedule Created on rotation entry %s", rotation_page_id)


# ---------------------------------------------------------------------------
# Activity assignment (course view / practice / system) across light days
# ---------------------------------------------------------------------------

def assign_activities(plan: dict) -> dict[str, dict]:
    basketball_days = set(plan.get("basketball_days", []))
    lihi_days = set(plan.get("lihi_days", DEFAULT_LIHI_DAYS))
    blocked_days = set(plan.get("blocked_days", []))

    heavy = basketball_days | lihi_days | blocked_days
    light = [d for d in DAYS_EN if d not in heavy]

    assignments: dict[str, dict] = {
        d: {"course_view": False, "course_practice": False, "system": False}
        for d in DAYS_EN
    }

    view_sessions = math.ceil(plan.get("course_view_min", 0) / 90) if plan.get("course_view_min") else 0
    practice_sessions = math.ceil(plan.get("course_practice_min", 0) / 60) if plan.get("course_practice_min") else 0
    system_sessions = math.ceil(plan.get("system_min", 0) / 60) if plan.get("system_min") else 0

    available = list(light)
    for day in available[:view_sessions]:
        assignments[day]["course_view"] = True

    remaining = [d for d in light if not assignments[d]["course_view"]]
    if len(remaining) < practice_sessions:
        remaining = list(light)
    for day in remaining[:practice_sessions]:
        assignments[day]["course_practice"] = True

    remaining2 = [d for d in light if not assignments[d]["course_view"] and not assignments[d]["course_practice"]]
    if len(remaining2) < system_sessions:
        remaining2 = list(light)
    for day in remaining2[:system_sessions]:
        assignments[day]["system"] = True

    return assignments


def distribute_vr(basketball_days: list[str], vr_count: int) -> set[str]:
    vr_days: set[str] = set()
    for day_en in DAYS_EN:
        if len(vr_days) >= vr_count:
            break
        if day_en not in basketball_days:
            vr_days.add(day_en)
    return vr_days


# ---------------------------------------------------------------------------
# Anchor building (time, label) pairs per day
# ---------------------------------------------------------------------------

def base_week_anchors() -> list[tuple[str, str]]:
    return [
        ("06:00", "🪖 בסיס — משמרת בוקר"),
        ("14:00", "🪖 בסיס — משמרת אחר הצהריים"),
        ("22:00", "😴 מנוחה"),
    ]


def home_day_anchors(
    day_en: str,
    day_index: int,
    plan: dict,
    assignments: dict,
    vr_days: set[str],
) -> list[tuple[str, str]]:
    basketball_days = set(plan.get("basketball_days", []))
    lihi_days = set(plan.get("lihi_days", DEFAULT_LIHI_DAYS))
    blocked_days = set(plan.get("blocked_days", []))
    dad_days = set(plan.get("dad_days", []))
    grandparents_days = set(plan.get("grandparents_days", []))
    work_days = set(plan.get("work_days", []))
    work_type = plan.get("work_type", "")
    friends_days = set(plan.get("friends_days", []))
    friends_type = plan.get("friends_type", "")

    course_view_days = set(plan.get("course_view_days", []))
    course_view_time = plan.get("course_view_time", "בוקר")
    course_practice_days = set(plan.get("course_practice_days", []))
    course_practice_time = plan.get("course_practice_time", "צהריים")
    system_days = set(plan.get("system_days", []))
    system_time = plan.get("system_time", "בוקר")
    _wake_times = plan.get("wake_times", {})
    _default_wake = plan.get("wake_time_free", "09:30")

    tennis_days = set(plan.get("tennis_days", list(TENNIS_DAYS)))

    has_basketball = day_en in basketball_days
    has_tennis = day_en in tennis_days
    has_lihi = day_en in lihi_days
    has_vr = day_en in vr_days
    has_blocked = day_en in blocked_days
    has_dad = day_en in dad_days
    has_grandparents = day_en in grandparents_days
    has_work = day_en in work_days
    has_friends = day_en in friends_days

    if day_index == 7:
        has_lihi = has_basketball = has_work = has_friends = has_vr = False

    bball_start = plan.get("basketball_time_start", "20:00") or "20:00"
    bball_end = plan.get("basketball_time_end", "22:30") or "22:30"
    lihi_start = plan.get("lihi_time_start", "18:00") or "18:00"
    vr_start = plan.get("vr_time_start", "19:00") or "19:00"
    dad_start = plan.get("dad_time_start", "15:00") or "15:00"
    gp_start = plan.get("grandparents_time_start", "15:00") or "15:00"
    friends_start = plan.get("friends_time_start", "19:00") or "19:00"
    work_start = plan.get("work_time_start", "") or ""
    work_end = plan.get("work_time_end", "") or ""

    cv_per_day = plan.get("course_view_per_day", {})
    cp_per_day = plan.get("course_practice_per_day", {})
    sys_per_day = plan.get("system_per_day", {})

    if day_index == 7:
        has_cv = has_cp = has_sys = False
        cv_min = cp_min = sys_min = 0
    else:
        day_asgn = assignments.get(day_en, {})

        if cv_per_day:
            has_cv = day_en in cv_per_day and cv_per_day[day_en] > 0
            cv_min = cv_per_day.get(day_en, 0)
        else:
            has_cv = (day_en in course_view_days) if course_view_days else day_asgn.get("course_view", False)
            cv_min = plan.get("course_view_min", 0) or 90
            if not plan.get("course_view_min"):
                has_cv = False

        if cp_per_day:
            has_cp = day_en in cp_per_day and cp_per_day[day_en] > 0
            cp_min = cp_per_day.get(day_en, 0)
        else:
            has_cp = (day_en in course_practice_days) if course_practice_days else day_asgn.get("course_practice", False)
            cp_min = plan.get("course_practice_min", 0) or 60
            if not plan.get("course_practice_min"):
                has_cp = False

        if sys_per_day:
            has_sys = day_en in sys_per_day and sys_per_day[day_en] > 0
            sys_min = sys_per_day.get(day_en, 0)
        else:
            has_sys = (day_en in system_days) if system_days else day_asgn.get("system", False)
            sys_min = plan.get("system_min", 0) or 60
            if not plan.get("system_min"):
                has_sys = False

    _WORK_LABELS = {"משמרת": "משמרת", "ספונטנית": "ספונטנית",
                    "עם-נסיעות": "עם נסיעות", "קצרה": "קצרה"}
    _FRIENDS_LABELS = {"ערב": "ערב", "קפה": "☕ קפה", "יציאה": "🎯 יציאה"}
    work_label = _WORK_LABELS.get(work_type, work_type)
    friends_label = _FRIENDS_LABELS.get(friends_type, friends_type)

    wake = _wake_times.get(day_en, _default_wake)
    book = plan.get("book_min", 0)

    anchors: list[tuple[str, str]] = []

    # ── Travel days ──────────────────────────────────────────────────────────
    if day_index == 0:  # Monday returning home
        anchors.append((wake, "🏠 הגעה הביתה"))
        anchors.append(("12:30", "🍽 ארוחת צהריים"))
        anchors.append(("14:00", "🎬 עריכה / פרויקטים"))
        if has_lihi:
            anchors.append((lihi_start, "💛 ליהי"))
        else:
            anchors.append(("18:00", "🌙 זמן חופשי"))
        anchors.append(("23:00", "😴 שינה"))

    elif day_index == 7:  # Monday entering base
        anchors.append((wake, "✈️ כניסה לבסיס — התארגנות"))
        anchors.append(("12:00", "🪖 בסיס — אחר הצהריים"))
        anchors.append(("20:00", "🪖 בסיס — ערב"))

    elif day_index == 5:  # Saturday
        anchors.append((wake, "😴 שינה / מנוחה מלאה"))
        anchors.append(("12:30", "🍽 ארוחת צהריים"))
        if has_tennis:
            t_start = plan.get("tennis_time_start", "") or "15:00"
            anchors.append((t_start, "🎾 טניס"))
        elif has_grandparents:
            anchors.append((gp_start, "👵 ביקור סבא וסבתא"))
        else:
            anchors.append(("14:00", "🌿 זמן חופשי"))
        if has_basketball:
            anchors.append((bball_start, "🏀 כדורסל"))
            if has_dad:
                anchors.append((dad_start, "👨‍👦 מפגש אבא"))
            else:
                anchors.append((bball_end, "🏠 בית"))
        elif has_lihi:
            anchors.append((lihi_start, "💛 ליהי"))
        elif has_vr:
            anchors.append((vr_start, "🥽 אירוע VR — Enjoy VR"))
        elif has_friends:
            anchors.append((friends_start,
                            f"👬 חברים{' — ' + friends_label if friends_label else ''}"))
        else:
            anchors.append(("18:00", "🌙 זמן חופשי"))
        anchors.append(("23:00", "😴 שינה"))

    elif has_blocked:
        anchors.append((wake, "⛔ יום חסום"))
        anchors.append(("23:00", "😴 שינה"))

    else:  # Regular home day
        act = _time_add(wake, 60)

        anchors.append((wake, "☀️ קימה + ארוחת בוקר"))

        if has_work:
            ws = work_start if work_start else act
            we_str = f"–{work_end}" if work_end else ""
            anchors.append(
                (ws,
                 f"💼 עבודה{' — ' + work_label if work_label else ''}{we_str}")
            )

        if has_cv:
            cv_t = act if course_view_time == "בוקר" else ("14:00" if course_view_time == "צהריים" else "18:00")
            anchors.append((cv_t, f"🎬 קורס צפייה ({cv_min} דק׳)"))
            anchors.append((_time_add(cv_t, cv_min), "☕ הפסקה"))

        if has_cp:
            cp_t = act if course_practice_time == "בוקר" else ("14:00" if course_practice_time == "צהריים" else "18:00")
            anchors.append((cp_t, f"🎬 תרגול קורס ({cp_min} דק׳)"))

        if has_sys:
            sys_t = act if system_time == "בוקר" else ("13:30" if system_time == "צהריים" else "18:00")
            anchors.append((sys_t, f"💻 מערכת ({sys_min} דק׳)"))

        if has_tennis:
            t_start = plan.get("tennis_time_start", "") or "15:00"
            anchors.append((t_start, "🎾 טניס"))

        if has_lihi:
            anchors.append((lihi_start, "💛 ליהי"))

        if has_vr:
            anchors.append((vr_start, "🥽 אירוע VR — Enjoy VR"))

        if has_dad:
            anchors.append((dad_start, "👨\u200d👦 מפגש אבא"))

        if has_grandparents:
            anchors.append((gp_start, "👵 ביקור סבא וסבתא"))

        if has_friends:
            anchors.append((friends_start,
                            f"👬 חברים{' — ' + friends_label if friends_label else ''}"))

        if has_basketball:
            anchors.append((bball_start, "🏀 כדורסל"))
            if not has_dad:
                anchors.append((bball_end, "🏠 בית"))

        # Auto-add lunch at 12:30 if nothing between 11:30–14:00
        noon_lo, noon_hi = _time_mins("11:30"), _time_mins("14:00")
        if not any(noon_lo <= _time_mins(t) <= noon_hi for t, _ in anchors):
            anchors.append(("12:30", "🍽 ארוחת צהריים"))

        if book:
            anchors.append((_time_add("23:00", -book), f"📖 ספר ({book} דק׳)"))
        anchors.append(("23:00", "😴 שינה"))

    anchors.sort(key=lambda x: _time_mins(x[0]))
    return anchors


def day_events(
    day_date: date,
    day_en: str,
    day_index: int,
    plan: dict,
    assignments: dict,
    vr_days: set[str],
    week_type: str,
) -> list[dict]:
    if week_type == "Base":
        anchors = base_week_anchors()
    else:
        anchors = home_day_anchors(day_en, day_index, plan, assignments, vr_days)
    return [_event_page(day_date, t, lab) for t, lab in anchors]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_schedule(dry_run: bool = False) -> None:
    global WEEKLY_DB_ID, ROTATION_DB_ID
    WEEKLY_DB_ID = resolve_db_id(WEEKLY_DB_ID, hint="לוז יומי")
    ROTATION_DB_ID = resolve_db_id(ROTATION_DB_ID, hint="Rotation")

    week_start = get_week_start()
    log.info("Generating schedule for week starting %s", week_start)

    delete_week_entries(week_start)

    rotation = find_rotation_entry(week_start)
    if rotation is None:
        log.error("No rotation entry found — cannot generate schedule.")
        sys.exit(1)

    props = rotation["properties"]
    week_type: str = props["Week Type"]["select"]["name"]
    basketball_days_raw = [opt["name"] for opt in props["Basketball Days"]["multi_select"]]
    vr_count: int = props["VR Events Count"]["number"] or 0

    plan = read_plan_json(rotation)
    if not plan:
        plan = {
            "week_type": week_type,
            "lihi_days": list(DEFAULT_LIHI_DAYS),
            "basketball_days": basketball_days_raw,
            "course_view_min": 0,
            "course_practice_min": 0,
            "system_min": 0,
            "work_days": [],
            "work_type": "",
            "dad_days": [],
            "grandparents_days": [],
            "friends_count": 0,
            "friends_days": [],
            "friends_type": "",
            "blocked_days": [],
        }
    else:
        basketball_days_raw = plan.get("basketball_days", basketball_days_raw)
        vr_count = plan.get("vr_count", vr_count)

    log.info(
        "Week type: %s | Basketball: %s | VR: %d | Plan JSON: %s",
        week_type, basketball_days_raw, vr_count, bool(plan.get("course_view_min"))
    )

    vr_days = distribute_vr(basketball_days_raw, vr_count) if week_type == "Home" else set()
    assignments = assign_activities(plan) if week_type == "Home" else {}

    all_events: list[dict] = []
    for i, (_day_he, day_en) in enumerate(zip(DAYS_HE, DAYS_EN)):
        day_date = week_start + timedelta(days=i)
        events = day_events(day_date, day_en, i, plan, assignments, vr_days, week_type)
        all_events.extend(events)

    if dry_run:
        for e in all_events:
            print(json.dumps(e, ensure_ascii=False, indent=2))
        log.info("Dry run complete — %d events (not written).", len(all_events))
        return

    for e in all_events:
        name = e["properties"]["Name"]["title"][0]["text"]["content"]
        start = e["properties"]["Date"]["date"]["start"]
        notion.pages.create(**e)
        log.info("Created: %s @ %s", name, start)

    mark_schedule_created(rotation["id"])
    log.info(
        "Done — %d events created for %s week starting %s.",
        len(all_events), week_type, week_start,
    )


if __name__ == "__main__":
    generate_schedule(dry_run="--dry-run" in sys.argv)
