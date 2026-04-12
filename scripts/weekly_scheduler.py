#!/usr/bin/env python3
"""
weekly_scheduler.py — Agent 1: Weekly Schedule Generator

Reads the Rotation Schedule DB, checks the current week's type (Base/Home),
and creates 7 daily entries in the Weekly Schedule DB.
If a Plan JSON is stored on the rotation entry (written by telegram_collect.py),
it uses it to build a smart, personalised daily schedule.

Usage:
    python weekly_scheduler.py           # run and write to Notion
    python weekly_scheduler.py --dry-run # print payloads, no writes

Required env vars:
    NOTION_TOKEN
    ROTATION_DB_ID
    WEEKLY_DB_ID
"""

import json
import logging
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
    return _re.sub(r'\s', '', val)

NOTION_TOKEN   = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", "29d51fc8-512b-4415-97c8-67121564b4f2"))
WEEKLY_DB_ID   = _clean(os.environ["WEEKLY_DB_ID"])

# Week: Mon Tue Wed Thu Fri Sat Sun Mon(next) — 8 days
DAYS_HE = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון", "שני"]
DAYS_EN = ["Mon", "Tue",   "Wed",   "Thu",   "Fri",  "Sat",  "Sun",  "Mon"]

# Defaults (overridden by Plan JSON when available)
DEFAULT_LIHI_DAYS  = {"Tue", "Fri", "Sat"}
TENNIS_DAYS        = {"Wed", "Thu"}

notion = Client(auth=NOTION_TOKEN)

# ---------------------------------------------------------------------------
# DB Resolution / Creation
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
    if hint == "Weekly Schedule":
        log.info("Creating Weekly Schedule DB inside page %s…", id_or_page)
        return create_weekly_schedule_db(parent_page_id=id_or_page)
    raise ValueError(f"Could not resolve {id_or_page!r} to a database (hint={hint!r}).")


def create_weekly_schedule_db(parent_page_id: str) -> str:
    def sel(options: list[str]) -> dict:
        return {"select": {"options": [{"name": o} for o in options]}}

    db = notion.databases.create(
        parent={"type": "page_id", "page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "Weekly Schedule DB"}}],
        properties={
            "Name":            {"title": {}},
            "Day":             sel(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
            "Date":            {"date": {}},
            "Week Type":       sel(["Base", "Home"]),
            "Morning Block":   {"rich_text": {}},
            "Afternoon Block": {"rich_text": {}},
            "Evening Block":   {"rich_text": {}},
            "Basketball":      {"checkbox": {}},
            "Lihi":            {"checkbox": {}},
            "Family":          {"checkbox": {}},
            "Editing":         {"checkbox": {}},
            "VR Event":        {"checkbox": {}},
            "Priority":        sel(["דחוף", "בינוני", "גמיש"]),
            "Notes":           {"rich_text": {}},
        },
    )
    db_id = db["id"]
    log.info("Created Weekly Schedule DB id=%s", db_id)
    return db_id

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_week_start() -> date:
    today = date.today()
    wd = today.weekday()  # Mon=0 … Sun=6
    if wd == 6:
        # Running on Sunday (e.g. Sunday-night cron): the upcoming week starts tomorrow
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
    """Read Plan JSON field from rotation entry (written by telegram_collect.py)."""
    try:
        parts = rotation["properties"].get("Plan JSON", {}).get("rich_text", [])
        if parts:
            text = "".join(p["plain_text"] for p in parts)
            return json.loads(text)
    except Exception as e:
        log.warning("Could not parse Plan JSON: %s", e)
    return {}


def delete_week_entries(week_start: date) -> int:
    """Delete all existing schedule entries for this week. Returns count deleted."""
    week_end = week_start + timedelta(days=7)
    response = notion.databases.query(
        database_id=WEEKLY_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after":  week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
        ]},
    )
    pages = response.get("results", [])
    for page in pages:
        notion.pages.update(page_id=page["id"], archived=True)
    if pages:
        log.info("Deleted %d old entries for week %s.", len(pages), week_start)
    return len(pages)


def mark_schedule_created(rotation_page_id: str) -> None:
    notion.pages.update(
        page_id=rotation_page_id,
        properties={"Schedule Created": {"checkbox": True}},
    )
    log.info("Marked Schedule Created on rotation entry %s", rotation_page_id)

# ---------------------------------------------------------------------------
# Activity assignment
# ---------------------------------------------------------------------------

def assign_activities(plan: dict) -> dict[str, dict]:
    """
    Pre-assign course / system-work sessions to specific days.
    Returns {day_en: {course_view, course_practice, system}} for all 7 days.
    """
    basketball_days = set(plan.get("basketball_days", []))
    lihi_days       = set(plan.get("lihi_days", DEFAULT_LIHI_DAYS))
    blocked_days    = set(plan.get("blocked_days", []))

    heavy = basketball_days | lihi_days | blocked_days
    light = [d for d in DAYS_EN if d not in heavy]

    assignments: dict[str, dict] = {d: {"course_view": False, "course_practice": False, "system": False} for d in DAYS_EN}

    # Session counts (round up)
    import math
    view_sessions     = math.ceil(plan.get("course_view_min", 0) / 90)  if plan.get("course_view_min")     else 0
    practice_sessions = math.ceil(plan.get("course_practice_min", 0) / 60) if plan.get("course_practice_min") else 0
    system_sessions   = math.ceil(plan.get("system_min", 0) / 60)       if plan.get("system_min")          else 0

    # 1. Assign course viewing to light mornings
    available = list(light)
    for day in available[:view_sessions]:
        assignments[day]["course_view"] = True

    # 2. Assign course practice to light afternoons (prefer different days than viewing)
    remaining = [d for d in light if not assignments[d]["course_view"]]
    if len(remaining) < practice_sessions:
        remaining = list(light)  # allow same day (view morning + practice afternoon)
    for day in remaining[:practice_sessions]:
        assignments[day]["course_practice"] = True

    # 3. Assign system work to remaining light days
    remaining2 = [d for d in light if not assignments[d]["course_view"] and not assignments[d]["course_practice"]]
    if len(remaining2) < system_sessions:
        remaining2 = list(light)
    for day in remaining2[:system_sessions]:
        assignments[day]["system"] = True

    return assignments

# ---------------------------------------------------------------------------
# Page builder
# ---------------------------------------------------------------------------

def _page(
    day_he: str, day_en: str, day_date: date, week_type: str,
    morning: str, afternoon: str, evening: str,
    basketball: bool = False, lihi: bool = False, family: bool = False,
    editing: bool = False, vr_event: bool = False,
    priority: str = "גמיש", notes: str = "",
) -> dict:
    return {
        "parent": {"database_id": WEEKLY_DB_ID},
        "properties": {
            "Name":            {"title": [{"text": {"content": f"{day_he} — {day_date.strftime('%d/%m')}"}}]},
            "Day":             {"select": {"name": day_en}},
            "Date":            {"date": {"start": day_date.isoformat()}},
            "Week Type":       {"select": {"name": week_type}},
            "Morning Block":   {"rich_text": [{"text": {"content": morning}}]},
            "Afternoon Block": {"rich_text": [{"text": {"content": afternoon}}]},
            "Evening Block":   {"rich_text": [{"text": {"content": evening}}]},
            "Basketball":      {"checkbox": basketball},
            "Lihi":            {"checkbox": lihi},
            "Family":          {"checkbox": family},
            "Editing":         {"checkbox": editing},
            "VR Event":        {"checkbox": vr_event},
            "Priority":        {"select": {"name": priority}},
            "Notes":           {"rich_text": [{"text": {"content": notes}}]},
        },
    }

# ---------------------------------------------------------------------------
# Schedule logic
# ---------------------------------------------------------------------------

def build_base_day(day_he: str, day_en: str, day_date: date) -> dict:
    return _page(
        day_he=day_he, day_en=day_en, day_date=day_date, week_type="Base",
        morning="🪖 בסיס — משמרת",
        afternoon="🪖 בסיס — משמרת",
        evening="😴 מנוחה",
        priority="גמיש",
    )


def build_home_day(
    day_he: str,
    day_en: str,
    day_date: date,
    day_index: int,
    plan: dict,
    assignments: dict,
    vr_days: set[str],
) -> dict:
    basketball_days    = set(plan.get("basketball_days", []))
    lihi_days          = set(plan.get("lihi_days", DEFAULT_LIHI_DAYS))
    blocked_days       = set(plan.get("blocked_days", []))
    dad_days           = set(plan.get("dad_days", []))
    grandparents_days  = set(plan.get("grandparents_days", []))
    work_days          = set(plan.get("work_days", []))
    work_type          = plan.get("work_type", "")
    friends_days       = set(plan.get("friends_days", []))
    friends_type       = plan.get("friends_type", "")

    # Time-of-day and day preferences (new fields)
    course_view_days     = set(plan.get("course_view_days", []))
    course_view_time     = plan.get("course_view_time", "בוקר")
    course_practice_days = set(plan.get("course_practice_days", []))
    course_practice_time = plan.get("course_practice_time", "צהריים")
    system_days          = set(plan.get("system_days", []))
    system_time          = plan.get("system_time", "בוקר")
    work_time_of_day     = plan.get("work_time_of_day", "בוקר")
    wake_time_work       = plan.get("wake_time_work", "07:00")
    wake_time_free       = plan.get("wake_time_free", "09:30")

    has_basketball   = day_en in basketball_days
    has_tennis       = day_en in TENNIS_DAYS
    has_lihi         = day_en in lihi_days
    has_vr           = day_en in vr_days
    has_blocked      = day_en in blocked_days
    has_dad          = day_en in dad_days
    has_grandparents = day_en in grandparents_days
    has_work         = day_en in work_days
    has_friends      = day_en in friends_days

    # Last Monday (entering base) — no personal activities; person is leaving home
    if day_index == 7:
        has_lihi = has_basketball = has_work = has_friends = has_vr = False

    cv_min  = plan.get("course_view_min", 0) or 90
    cp_min  = plan.get("course_practice_min", 0) or 60
    sys_min = plan.get("system_min", 0) or 60

    # Activity assignment: prefer user-specified days, fall back to auto-assign
    if day_index == 7:
        has_cv = has_cp = has_sys = False
    else:
        day_asgn = assignments.get(day_en, {})
        has_cv  = (day_en in course_view_days)     if course_view_days     else day_asgn.get("course_view", False)
        has_cp  = (day_en in course_practice_days) if course_practice_days else day_asgn.get("course_practice", False)
        has_sys = (day_en in system_days)           if system_days          else day_asgn.get("system", False)
        # Only show if minutes are planned
        if not plan.get("course_view_min"):     has_cv  = False
        if not plan.get("course_practice_min"): has_cp  = False
        if not plan.get("system_min"):          has_sys = False

    # ── Work type label ───────────────────────────────────────────────────────
    _WORK_LABELS = {
        "משמרת": "משמרת", "ספונטנית": "ספונטנית",
        "עם-נסיעות": "עם נסיעות", "קצרה": "קצרה",
    }
    work_label = _WORK_LABELS.get(work_type, work_type)

    # ── Friends evening label ──────────────────────────────────────────────────
    _FRIENDS_LABELS = {"ערב": "ערב", "קפה": "☕ קפה", "יציאה": "🎯 יציאה"}
    friends_label = _FRIENDS_LABELS.get(friends_type, friends_type)

    # ── Wake time ─────────────────────────────────────────────────────────────
    wake_time   = wake_time_work if has_work else wake_time_free
    wake_prefix = f"☀️ קימה {wake_time}"

    # ── Morning ──────────────────────────────────────────────────────────────
    if day_index == 0:        # Monday — returning home from base
        morning = "🏠 הגעה הביתה — אוכל, בוקר"
    elif day_index == 7:      # Monday (next) — entering base
        morning = "✈️ כניסה לבסיס — התארגנות"
    elif day_index == 5:      # Saturday
        morning = "😴 שינה / מנוחה מלאה"
    elif has_work and work_time_of_day == "בוקר":
        morning = f"{wake_prefix}\n💼 עבודה{' — ' + work_label if work_label else ''}"
    elif has_cv and course_view_time == "בוקר":
        morning = f"{wake_prefix}\n🎬 קורס צפייה ({cv_min} דק׳)"
    elif has_sys and system_time == "בוקר":
        morning = f"{wake_prefix}\n💻 מערכת ({sys_min} דק׳)"
    elif day_index == 4:      # Friday (non-work)
        morning = f"{wake_prefix} — ארוחת בוקר"
    else:
        morning = f"{wake_prefix} — אוכל, התארגנות"

    # ── Afternoon ────────────────────────────────────────────────────────────
    editing = False
    if day_index == 7:        # Monday entering base
        afternoon = "✈️ בסיס"
    elif has_blocked:
        afternoon = "⛔ יום חסום"
    elif has_work and work_time_of_day == "צהריים":
        afternoon = f"💼 עבודה{' — ' + work_label if work_label else ''}"
    elif has_tennis:
        afternoon = "🎾 טניס"
    elif has_grandparents:
        afternoon = "👵 ביקור סבא וסבתא"
    elif has_dad and not has_lihi:
        afternoon = "👨‍👦 מפגש אבא"
    elif has_cp and course_practice_time == "צהריים":
        afternoon = f"🎬 קורס תרגול ({cp_min} דק׳)"
        editing = True
    elif has_sys and system_time == "צהריים":
        afternoon = f"💻 עבודה על המערכת ({sys_min} דק׳)"
    elif has_cv and course_view_time == "צהריים":
        afternoon = f"🎬 קורס צפייה ({cv_min} דק׳)"
    elif day_index == 4:      # Friday
        afternoon = "👨‍👩‍👧 משפחה (אבא, סבא וסבתא)"
    elif day_index == 5:      # Saturday
        afternoon = "🌿 זמן חופשי"
    else:
        afternoon = "🎬 עריכה / פרויקטים אישיים"
        editing = True

    # ── Evening ──────────────────────────────────────────────────────────────
    if day_index == 7:
        evening = "🪖 בסיס — ערב"
    elif has_blocked:
        evening = "⛔ —"
    elif has_work and work_time_of_day == "ערב":
        evening = f"💼 עבודה{' — ' + work_label if work_label else ''}"
    elif has_basketball:
        evening = "🏀 כדורסל 20:00–22:30"
    elif has_vr:
        evening = "🥽 אירוע VR — Enjoy VR"
    elif has_cp and course_practice_time == "ערב":
        evening = f"🎬 קורס תרגול ({cp_min} דק׳)"
        editing = True
    elif has_sys and system_time == "ערב":
        evening = f"💻 מערכת ({sys_min} דק׳)"
    elif has_lihi:
        evening = "💛 ליהי"
    elif has_friends:
        evening = f"👬 חברים{' — ' + friends_label if friends_label else ''}"
    else:
        evening = "🌙 זמן חופשי"

    # ── Overrides for Sat ────────────────────────────────────────────────────
    if day_index == 5:
        if not has_tennis and not has_grandparents:
            afternoon = "🌿 זמן חופשי"
        editing = False

    family = has_dad or has_grandparents or (day_index == 4)
    priority = (
        "דחוף"   if day_index in (0, 7) else
        "בינוני" if (has_lihi or has_basketball or has_blocked) else
        "גמיש"
    )

    return _page(
        day_he=day_he, day_en=day_en, day_date=day_date, week_type="Home",
        morning=morning, afternoon=afternoon, evening=evening,
        basketball=has_basketball, lihi=has_lihi, family=family,
        editing=editing, vr_event=has_vr, priority=priority,
    )


def distribute_vr(basketball_days: list[str], vr_count: int) -> set[str]:
    vr_days: set[str] = set()
    for day_en in DAYS_EN:
        if len(vr_days) >= vr_count:
            break
        if day_en not in basketball_days:
            vr_days.add(day_en)
    return vr_days

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_schedule(dry_run: bool = False) -> None:
    global WEEKLY_DB_ID, ROTATION_DB_ID
    WEEKLY_DB_ID   = resolve_db_id(WEEKLY_DB_ID,   hint="Weekly Schedule")
    ROTATION_DB_ID = resolve_db_id(ROTATION_DB_ID, hint="Rotation")

    week_start = get_week_start()
    log.info("Generating schedule for week starting %s", week_start)

    # Always delete old entries and rebuild from latest questionnaire answers
    delete_week_entries(week_start)

    rotation = find_rotation_entry(week_start)
    if rotation is None:
        log.error("No rotation entry found — cannot generate schedule.")
        sys.exit(1)

    props = rotation["properties"]
    week_type: str      = props["Week Type"]["select"]["name"]
    basketball_days_raw = [opt["name"] for opt in props["Basketball Days"]["multi_select"]]
    vr_count: int       = props["VR Events Count"]["number"] or 0

    # Load rich plan data if available (written by telegram_collect.py)
    plan = read_plan_json(rotation)
    if not plan:
        # Fall back to defaults derived from existing rotation fields
        plan = {
            "week_type":           week_type,
            "lihi_days":           list(DEFAULT_LIHI_DAYS),
            "basketball_days":     basketball_days_raw,
            "course_view_min":     0,
            "course_practice_min": 0,
            "system_min":          0,
            "work_days":           [],
            "work_type":           "",
            "dad_days":            [],
            "grandparents_days":   [],
            "friends_count":       0,
            "friends_days":        [],
            "friends_type":        "",
            "blocked_days":        [],
        }
    else:
        # Plan JSON overrides basketball_days (in case they differ)
        basketball_days_raw = plan.get("basketball_days", basketball_days_raw)

    log.info("Week type: %s | Basketball: %s | VR: %d | Plan JSON: %s",
             week_type, basketball_days_raw, vr_count, bool(plan.get("course_view_min")))

    vr_days    = distribute_vr(basketball_days_raw, vr_count) if week_type == "Home" else set()
    assignments = assign_activities(plan) if week_type == "Home" else {}

    pages = []
    for i, (day_he, day_en) in enumerate(zip(DAYS_HE, DAYS_EN)):
        day_date = week_start + timedelta(days=i)
        if week_type == "Base":
            page = build_base_day(day_he, day_en, day_date)
        else:
            page = build_home_day(day_he, day_en, day_date, i, plan, assignments, vr_days)
        pages.append(page)

    if dry_run:
        for p in pages:
            print(json.dumps(p, ensure_ascii=False, indent=2))
        log.info("Dry run complete — no pages written.")
        return

    for page in pages:
        day_name = page["properties"]["Name"]["title"][0]["text"]["content"]
        notion.pages.create(**page)
        log.info("Created: %s", day_name)

    mark_schedule_created(rotation["id"])
    log.info("Done — 8 pages created for %s week starting %s.", week_type, week_start)


if __name__ == "__main__":
    generate_schedule(dry_run="--dry-run" in sys.argv)
