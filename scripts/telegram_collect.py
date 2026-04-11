#!/usr/bin/env python3
"""
telegram_collect.py — Polls Telegram for weekly schedule response, writes to Rotation DB.

Runs 30 minutes after telegram_questionnaire.py sends the message.
Looks for the most recent message containing "סוג:" within the last 2 hours.
If found, parses it and creates a Rotation Schedule entry for next week.
Then triggers weekly_scheduler.py to generate the schedule.

Required env vars:
    TELEGRAM_BOT_TOKEN
    TELEGRAM_CHAT_ID
    NOTION_TOKEN
    ROTATION_DB_ID

Optional env vars:
    WEEKLY_DB_ID  (passed to weekly_scheduler.py if set)
"""

import os
import sys
import re
import json
import time
import subprocess
import urllib.request
from datetime import date, timedelta, datetime, timezone

# ── Config ────────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"].strip()
TELEGRAM_CHAT_ID   = os.environ["TELEGRAM_CHAT_ID"].strip()
TELEGRAM_API       = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

# Notion
import importlib.util, pathlib
_root = pathlib.Path(__file__).parent.parent
sys.path.insert(0, str(_root / "scripts"))

from dotenv import load_dotenv
load_dotenv()

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN    = os.environ["NOTION_TOKEN"].strip()
ROTATION_DB_ID  = _clean(os.environ.get("ROTATION_DB_ID", "29d51fc8-512b-4415-97c8-67121564b4f2"))

from notion_client import Client
notion = Client(auth=NOTION_TOKEN)

# ── Day name mapping (Hebrew → English) ──────────────────────────────────────
HE_TO_EN = {
    "ראשון": "Sun", "שני": "Mon", "שלישי": "Tue",
    "רביעי": "Wed", "חמישי": "Thu", "שישי": "Fri", "שבת": "Sat",
}
WEEK_TYPE_MAP = {"בית": "Home", "בסיס": "Base"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def tg_get(method: str, params: dict = None) -> dict:
    url = f"{TELEGRAM_API}/{method}"
    if params:
        url += "?" + "&".join(f"{k}={urllib.parse.quote(str(v))}" for k, v in params.items())
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read())


def send_message(text: str, parse_mode: str = "Markdown") -> None:
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
    """Return the text of the most recent qualifying message within max_age_seconds."""
    updates = tg_get("getUpdates", {"limit": 20, "allowed_updates": "message"})
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


def parse_response(text: str) -> tuple[str, list[str], int]:
    """
    Parse response like:
        סוג: בית
        כדורסל: שני,רביעי,חמישי
        VR: 2

    Returns (week_type_en, basketball_days_en, vr_count).
    """
    week_type_en = "Home"
    basketball_days = []
    vr_count = 0

    for line in text.splitlines():
        line = line.strip()
        if line.startswith("סוג:"):
            val = line.split(":", 1)[1].strip()
            week_type_en = WEEK_TYPE_MAP.get(val, "Home")

        elif line.startswith("כדורסל:"):
            val = line.split(":", 1)[1].strip()
            for part in re.split(r"[,،\s]+", val):
                part = part.strip()
                if part in HE_TO_EN:
                    basketball_days.append(HE_TO_EN[part])
                elif part in HE_TO_EN.values():
                    basketball_days.append(part)  # already English

        elif line.lower().startswith("vr:"):
            val = line.split(":", 1)[1].strip()
            try:
                vr_count = int(val)
            except ValueError:
                vr_count = 0

    return week_type_en, basketball_days, vr_count


def get_next_sunday() -> date:
    today = date.today()
    days_until_sunday = (6 - today.weekday()) % 7
    if days_until_sunday == 0:
        days_until_sunday = 7
    return today + timedelta(days=days_until_sunday)


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


def create_rotation_entry(week_start: date, week_type: str, basketball_days: list[str], vr_count: int) -> None:
    if entry_exists(week_start):
        print(f"Entry already exists for {week_start} — skipping Notion write.")
        return
    notion.pages.create(
        parent={"database_id": ROTATION_DB_ID},
        properties={
            "Name":              {"title": [{"text": {"content": f"שבוע {week_start.strftime('%d/%m')}"}}]},
            "Week Type":         {"select": {"name": week_type}},
            "Date":              {"date": {"start": week_start.isoformat()}},
            "Basketball Days":   {"multi_select": [{"name": d} for d in basketball_days]},
            "VR Events Count":   {"number": vr_count},
            "Schedule Created":  {"checkbox": False},
        },
    )
    print(f"✅ Created rotation entry: {week_start} | {week_type} | basketball={basketball_days} | vr={vr_count}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("🔍 Polling Telegram for weekly schedule response…")
    response_text = get_recent_response(max_age_seconds=7200)

    if not response_text:
        msg = (
            "⚠️ לא התקבלה תשובה תוך 30 דקות.\n\n"
            "שלח תשובה בפורמט:\n"
            "```\nסוג: בית\nכדורסל: שני,רביעי,חמישי\nVR: 0\n```\n"
            "ואז הרץ ידנית את ה-workflow `Collect Weekly Response`."
        )
        send_message(msg)
        print("❌ No response found.")
        sys.exit(1)

    print(f"📨 Response found:\n{response_text}")
    week_type, basketball_days, vr_count = parse_response(response_text)
    next_sunday = get_next_sunday()

    print(f"📅 Next week starts: {next_sunday}")
    print(f"   Type: {week_type} | Basketball: {basketball_days} | VR: {vr_count}")

    create_rotation_entry(next_sunday, week_type, basketball_days, vr_count)

    # Confirm to user
    bball_he = ", ".join(basketball_days) if basketball_days else "—"
    send_message(
        f"✅ *שבוע {next_sunday.strftime('%d/%m')} נשמר!*\n\n"
        f"📋 סוג: *{'בית' if week_type == 'Home' else 'בסיס'}*\n"
        f"🏀 כדורסל: {bball_he}\n"
        f"🎮 VR: {vr_count}\n\n"
        f"_לו\"ז מפורט ייווצר ביום ראשון בבוקר._"
    )
    print("Done.")


if __name__ == "__main__":
    main()
