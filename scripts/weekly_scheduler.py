#!/usr/bin/env python3
"""
weekly_scheduler.py — Agent 1: Weekly Schedule Generator

Reads the Rotation Schedule DB, checks the current week's type (Base/Home),
and creates 7 daily entries in the Weekly Schedule DB.

Usage:
    python weekly_scheduler.py           # run and write to Notion
    python weekly_scheduler.py --dry-run # print payloads, no writes

Required env vars (see .env.example):
    NOTION_TOKEN
    ROTATION_DB_ID
    WEEKLY_DB_ID
"""

import json
import logging
import os
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
NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = os.environ.get("ROTATION_DB_ID", "ac656f74-60b6-41a3-adc2-49e6656c3845").strip()
WEEKLY_DB_ID = os.environ["WEEKLY_DB_ID"].strip()

# Hebrew day names (Sun–Sat) and matching Notion select values
DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

notion = Client(auth=NOTION_TOKEN)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_week_start() -> date:
    """Return the Sunday that begins the current ISO week (Israel starts Sun)."""
    today = date.today()
    # Python: Monday=0 … Sunday=6  →  days since Sunday = (weekday + 1) % 7
    days_since_sunday = (today.weekday() + 1) % 7
    return today - timedelta(days=days_since_sunday)


def find_rotation_entry(week_start: date) -> dict | None:
    """Query Rotation Schedule DB for the entry that covers this week."""
    week_end = week_start + timedelta(days=6)
    response = notion.databases.query(
        database_id=ROTATION_DB_ID,
        filter={
            "and": [
                {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
                {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
            ]
        },
    )
    results = response.get("results", [])
    if not results:
        log.warning("No rotation entry found for week %s – %s", week_start, week_end)
        return None
    if len(results) > 1:
        log.warning("Multiple rotation entries found — using the first one.")
    return results[0]


def schedule_already_exists(week_start: date) -> bool:
    """Return True if the Weekly Schedule DB already has entries for this week."""
    week_end = week_start + timedelta(days=6)
    response = notion.databases.query(
        database_id=WEEKLY_DB_ID,
        filter={
            "and": [
                {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
                {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
            ]
        },
    )
    return len(response.get("results", [])) > 0


def mark_schedule_created(rotation_page_id: str) -> None:
    notion.pages.update(
        page_id=rotation_page_id,
        properties={"Schedule Created": {"checkbox": True}},
    )
    log.info("Marked Schedule Created on rotation entry %s", rotation_page_id)


# ---------------------------------------------------------------------------
# Schedule logic
# ---------------------------------------------------------------------------

def _page(
    day_he: str,
    day_en: str,
    day_date: date,
    week_type: str,
    morning: str,
    afternoon: str,
    evening: str,
    basketball: bool = False,
    lihi: bool = False,
    family: bool = False,
    editing: bool = False,
    vr_event: bool = False,
    priority: str = "גמיש",
    notes: str = "",
) -> dict:
    """Build a Notion page payload for one day."""
    # NOTE: If your Weekly Schedule DB title property is not named "Name",
    #       change "Name" below to match the actual property name.
    return {
        "parent": {"database_id": WEEKLY_DB_ID},
        "properties": {
            "Name": {
                "title": [{"text": {"content": f"{day_he} — {day_date.strftime('%d/%m')}"}}]
            },
            "Day": {"select": {"name": day_en}},
            "Date": {"date": {"start": day_date.isoformat()}},
            "Week Type": {"select": {"name": week_type}},
            "Morning Block": {"rich_text": [{"text": {"content": morning}}]},
            "Afternoon Block": {"rich_text": [{"text": {"content": afternoon}}]},
            "Evening Block": {"rich_text": [{"text": {"content": evening}}]},
            "Basketball": {"checkbox": basketball},
            "Lihi": {"checkbox": lihi},
            "Family": {"checkbox": family},
            "Editing": {"checkbox": editing},
            "VR Event": {"checkbox": vr_event},
            "Priority": {"select": {"name": priority}},
            "Notes": {"rich_text": [{"text": {"content": notes}}]},
        },
    }


def build_base_day(day_he: str, day_en: str, day_date: date) -> dict:
    """Minimal entry for a base-week day (Ben is on base)."""
    return _page(
        day_he=day_he,
        day_en=day_en,
        day_date=day_date,
        week_type="Base",
        morning="בסיס — משמרת",
        afternoon="בסיס — משמרת",
        evening="מנוחה",
        priority="גמיש",
    )


def build_home_day(
    day_he: str,
    day_en: str,
    day_date: date,
    day_index: int,
    basketball_days: list[str],
    vr_days: set[str],
) -> dict:
    """Full entry for a home-week day."""
    has_basketball = day_en in basketball_days
    has_vr = day_en in vr_days

    # Defaults
    morning = "קימה 09:30 — אוכל, התארגנות"
    afternoon = "עריכה / פרויקטים אישיים"
    evening = "זמן חופשי"
    lihi = False
    family = False
    editing = True
    priority = "בינוני"

    # Basketball overrides evening
    if has_basketball:
        evening = "כדורסל 20:00–22:30"

    # VR event overrides evening (takes priority over free time, not over basketball)
    if has_vr and not has_basketball:
        evening = "אירוע VR — Enjoy VR"

    # Day-specific overrides
    if day_index == 0:  # Sunday — start of home week
        morning = "קימה 09:30 — אוכל, תכנון שבוע"
        priority = "דחוף"
        if not has_basketball and not has_vr:
            evening = "ליהי"
            lihi = True

    elif day_index == 5:  # Friday — family day
        morning = "קימה 09:30 — ארוחת בוקר"
        afternoon = "משפחה (אבא, סבא וסבתא)"
        evening = "שבת — מנוחה"
        family = True
        editing = False
        priority = "בינוני"
        lihi = False

    elif day_index == 6:  # Saturday — rest
        morning = "שינה / מנוחה"
        afternoon = "זמן חופשי"
        editing = False
        priority = "גמיש"
        if not has_basketball and not has_vr:
            evening = "ליהי"
            lihi = True

    return _page(
        day_he=day_he,
        day_en=day_en,
        day_date=day_date,
        week_type="Home",
        morning=morning,
        afternoon=afternoon,
        evening=evening,
        basketball=has_basketball,
        lihi=lihi,
        family=family,
        editing=editing,
        vr_event=has_vr,
        priority=priority,
    )


def distribute_vr(basketball_days: list[str], vr_count: int) -> set[str]:
    """Assign VR events to the first available non-basketball evenings."""
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
    week_start = get_week_start()
    log.info("Generating schedule for week starting %s", week_start)

    # Idempotency check
    if schedule_already_exists(week_start):
        log.info("Schedule already exists for this week — nothing to do.")
        return

    rotation = find_rotation_entry(week_start)
    if rotation is None:
        log.error("Cannot generate schedule: no rotation entry found.")
        sys.exit(1)

    props = rotation["properties"]
    week_type: str = props["Week Type"]["select"]["name"]
    basketball_days: list[str] = [
        opt["name"] for opt in props["Basketball Days"]["multi_select"]
    ]
    vr_count: int = props["VR Events Count"]["number"] or 0
    already_created: bool = props["Schedule Created"]["checkbox"]

    log.info(
        "Week type: %s | Basketball days: %s | VR events: %d",
        week_type, basketball_days, vr_count,
    )

    if already_created and not dry_run:
        log.info("Rotation entry already marked as created — skipping.")
        return

    vr_days = distribute_vr(basketball_days, vr_count) if week_type == "Home" else set()

    pages = []
    for i, (day_he, day_en) in enumerate(zip(DAYS_HE, DAYS_EN)):
        day_date = week_start + timedelta(days=i)
        if week_type == "Base":
            page = build_base_day(day_he, day_en, day_date)
        else:
            page = build_home_day(day_he, day_en, day_date, i, basketball_days, vr_days)
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
    log.info("Done — 7 pages created for %s week starting %s.", week_type, week_start)


if __name__ == "__main__":
    generate_schedule(dry_run="--dry-run" in sys.argv)
