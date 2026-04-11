#!/usr/bin/env python3
"""
telegram_questionnaire.py — Sends comprehensive weekly questionnaire via Telegram.
Every field is dynamic — filled fresh each week.

Required env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
"""

import os
import re
import sys
import urllib.request
import urllib.error
import json
from datetime import date, timedelta


def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)


TELEGRAM_BOT_TOKEN = _clean(os.environ["TELEGRAM_BOT_TOKEN"])
TELEGRAM_CHAT_ID   = _clean(os.environ["TELEGRAM_CHAT_ID"])
TELEGRAM_API       = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def send_message(text: str, parse_mode: str = "HTML") -> dict:
    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": parse_mode,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{TELEGRAM_API}/sendMessage", data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP {e.code}: {e.read().decode()}")
        raise


def get_next_sunday() -> date:
    today = date.today()
    diff = (6 - today.weekday()) % 7
    return today + timedelta(days=diff if diff > 0 else 7)


def main():
    next_sun = get_next_sunday()
    label    = next_sun.strftime('%d/%m')

    # Header message
    send_message(
        f"📅 <b>תכנון שבוע {label}</b>\n\n"
        "מלא את הטמפלייט למטה ושלח חזרה.\n"
        "השתמש ב <code>—</code> לאין / לא."
    )

    # Template message (as pre block for easy copy)
    template = (
        "<pre>"
        "סוג: בית\n"
        "\n"
        "-- ליהי --\n"
        "ליהי-ערב: שלישי,שבת\n"
        "ליהי-יום-מלא: שישי\n"
        "ליהי-לינה: —\n"
        "ליהי-יציאה: —\n"
        "\n"
        "-- ספורט --\n"
        "כדורסל: שני,רביעי\n"
        "כדורסל-אופציונלי: חמישי\n"
        "טניס: רביעי,חמישי\n"
        "\n"
        "-- קורס עריכה --\n"
        "קורס-צפייה: 90\n"
        "קורס-תרגול: 60\n"
        "\n"
        "-- מערכת --\n"
        "מערכת: 60\n"
        "מערכת-סוג: בניית-לוגיקה\n"
        "\n"
        "-- עבודה --\n"
        "עבודה-משמרת: —\n"
        "עבודה-ספונטנית: —\n"
        "\n"
        "-- משפחה --\n"
        "אבא-ערב: —\n"
        "אבא-מפגש: שישי\n"
        "סבא: —\n"
        "\n"
        "-- חברים --\n"
        "חברים-ערב: —\n"
        "חברים-קפה: —\n"
        "\n"
        "-- עצמי --\n"
        "עצמי: הליכה,מנוחה\n"
        "ספר: 30\n"
        "\n"
        "-- אחר --\n"
        "חסומים: —\n"
        "הערות: "
        "</pre>"
    )
    result = send_message(template)
    if result.get("ok"):
        print("✅ Questionnaire sent.")
    else:
        print(f"❌ Failed: {result}")
        sys.exit(1)


if __name__ == "__main__":
    main()
