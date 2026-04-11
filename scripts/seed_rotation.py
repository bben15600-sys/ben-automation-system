#!/usr/bin/env python3
"""
seed_rotation.py — One-time setup: adds rotation entries for current + next week.
Run once to populate Rotation Schedule DB so weekly_scheduler.py can work.

Usage:
    python scripts/seed_rotation.py
"""

import os
import re
from datetime import date, timedelta
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID = re.sub(r'\s', '', os.environ.get("ROTATION_DB_ID", "29d51fc8-512b-4415-97c8-67121564b4f2"))

notion = Client(auth=NOTION_TOKEN)


def get_sunday(d: date) -> date:
    """Return the Sunday that starts the week containing d."""
    return d - timedelta(days=(d.weekday() + 1) % 7)


def entry_exists(week_start: date) -> bool:
    res = notion.databases.query(
        database_id=ROTATION_DB_ID,
        filter={
            "and": [
                {"property": "Date", "date": {"on_or_after": week_start.isoformat()}},
                {"property": "Date", "date": {"on_or_before": (week_start + timedelta(days=6)).isoformat()}},
            ]
        },
    )
    return len(res.get("results", [])) > 0


def add_entry(week_start: date, week_type: str, basketball_days: list[str], vr_count: int = 0):
    if entry_exists(week_start):
        print(f"Entry already exists for {week_start} — skipping.")
        return
    notion.pages.create(
        parent={"database_id": ROTATION_DB_ID},
        properties={
            "Name": {"title": [{"text": {"content": f"שבוע {week_start.strftime('%d/%m')}"}}]},
            "Week Type": {"select": {"name": week_type}},
            "Date": {"date": {"start": week_start.isoformat()}},
            "Basketball Days": {"multi_select": [{"name": d} for d in basketball_days]},
            "VR Events Count": {"number": vr_count},
            "Schedule Created": {"checkbox": False},
        },
    )
    print(f"Added: {week_start}  {week_type}  basketball={basketball_days}  vr={vr_count}")


if __name__ == "__main__":
    today = date.today()
    this_sunday = get_sunday(today)
    next_sunday = this_sunday + timedelta(weeks=1)

    # ── Edit these lines to match your actual schedule ──────────────────────
    add_entry(this_sunday, week_type="Base", basketball_days=[])
    add_entry(next_sunday, week_type="Home", basketball_days=["Mon", "Wed", "Thu"], vr_count=0)
    # ────────────────────────────────────────────────────────────────────────

    print("Done.")
