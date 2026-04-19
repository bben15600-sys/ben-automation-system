#!/usr/bin/env python3
"""
test_run_scheduler.py — Manual end-to-end test of weekly_scheduler.py.

Seeds a sample Home-week rotation entry with a realistic Plan JSON into
the new Rotation DB, then calls weekly_scheduler.generate_schedule() so
individual events land in the oslife Dashboard "לוז יומי" DB.

Existing rotation entries in the current-week range are archived first
so the test is idempotent.

Usage:
    NOTION_TOKEN=... ROTATION_DB_ID=... WEEKLY_DB_ID=... \
        python scripts/test_run_scheduler.py

The sample data will be replaced the next time the real Telegram bot
runs — nothing permanent is created.
"""

from __future__ import annotations

import json
import logging
import os
import re as _re
from datetime import date, timedelta

from dotenv import load_dotenv
from notion_client import Client

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)


def _clean(v: str) -> str:
    return _re.sub(r"\s", "", v)


NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = _clean(os.environ["ROTATION_DB_ID"])

notion = Client(auth=NOTION_TOKEN)


SAMPLE_PLAN = {
    "week_type": "Home",
    "lihi_days": ["Tue", "Fri", "Sat"],
    "basketball_days": ["Wed", "Fri"],
    "tennis_days": ["Wed", "Thu"],
    "course_view_min": 90,
    "course_view_time": "בוקר",
    "course_view_days": ["Mon", "Thu"],
    "course_view_per_day": {"Mon": 60, "Thu": 30},
    "course_practice_min": 60,
    "course_practice_time": "צהריים",
    "course_practice_days": ["Tue"],
    "course_practice_per_day": {"Tue": 60},
    "system_min": 60,
    "system_time": "בוקר",
    "system_days": ["Wed"],
    "system_per_day": {"Wed": 60},
    "dad_days": ["Sat"],
    "grandparents_days": [],
    "friends_days": [],
    "friends_type": "",
    "work_days": [],
    "work_type": "",
    "blocked_days": [],
    "basketball_time_start": "20:00",
    "basketball_time_end": "22:30",
    "lihi_time_start": "19:00",
    "vr_time_start": "19:00",
    "dad_time_start": "15:00",
    "grandparents_time_start": "14:00",
    "friends_time_start": "20:00",
    "wake_times": {
        "Mon": "09:30", "Tue": "08:30", "Wed": "09:30",
        "Thu": "09:30", "Fri": "09:30", "Sat": "10:30", "Sun": "09:30",
    },
    "wake_time_free": "09:30",
    "vr_count": 1,
    "book_min": 30,
}


def get_week_start() -> date:
    today = date.today()
    wd = today.weekday()
    if wd == 6:
        return today + timedelta(days=1)
    return today - timedelta(days=wd)


def archive_existing_rotation(week_start: date) -> None:
    week_end = week_start + timedelta(days=6)
    res = notion.databases.query(
        database_id=ROTATION_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
        ]},
    )
    for page in res.get("results", []):
        notion.pages.update(page_id=page["id"], archived=True)
        log.info("Archived existing rotation entry %s", page["id"])


def seed_rotation(week_start: date) -> str:
    page = notion.pages.create(
        parent={"database_id": ROTATION_DB_ID},
        properties={
            "Name": {"title": [{"text": {"content": f"TEST שבוע {week_start.strftime('%d/%m')}"}}]},
            "Week Type": {"select": {"name": "Home"}},
            "Date": {"date": {"start": week_start.isoformat()}},
            "Basketball Days": {"multi_select": [{"name": d} for d in SAMPLE_PLAN["basketball_days"]]},
            "VR Events Count": {"number": SAMPLE_PLAN["vr_count"]},
            "Schedule Created": {"checkbox": False},
            "Plan JSON": {
                "rich_text": [{"text": {"content": json.dumps(SAMPLE_PLAN, ensure_ascii=False)}}]
            },
        },
    )
    return page["id"]


def main() -> None:
    week_start = get_week_start()
    log.info("Seeding test rotation for week starting %s", week_start)

    archive_existing_rotation(week_start)
    rotation_id = seed_rotation(week_start)
    log.info("Seeded test rotation: %s", rotation_id)

    # Import and run the real scheduler now that the rotation entry exists
    log.info("Running weekly_scheduler.generate_schedule() …")
    from weekly_scheduler import generate_schedule  # noqa: E402
    generate_schedule(dry_run=False)
    log.info("Test run complete — check oslife.app/schedule")


if __name__ == "__main__":
    main()
