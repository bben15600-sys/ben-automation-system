#!/usr/bin/env python3
"""
telegram_questionnaire.py — Sends weekly Sunday questionnaire via Telegram.

Asks about next week's schedule (week type, basketball days, VR events).
Runs every Sunday at 20:00 Israel time via GitHub Actions.

Required env vars:
    TELEGRAM_BOT_TOKEN
    TELEGRAM_CHAT_ID
"""

import os
import re
import sys
import urllib.request
import urllib.parse
import json


def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)


TELEGRAM_BOT_TOKEN = _clean(os.environ["TELEGRAM_BOT_TOKEN"])
TELEGRAM_CHAT_ID   = _clean(os.environ["TELEGRAM_CHAT_ID"])

TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def send_message(text: str, parse_mode: str = "HTML") -> dict:
    url = f"{TELEGRAM_API}/sendMessage"
    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": parse_mode,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"❌ HTTP {e.code}: {body}")
        raise


def main():
    print(f"Token starts with: {TELEGRAM_BOT_TOKEN[:10]}...")
    print(f"Chat ID: {TELEGRAM_CHAT_ID}")
    message = (
        "📅 <b>תכנון שבוע הבא</b>\n\n"
        "שלח תשובה בפורמט הבא:\n\n"
        "<pre>סוג: בית\n"
        "כדורסל: שני,רביעי,חמישי\n"
        "VR: 0</pre>\n\n"
        "📌 <b>אפשרויות:</b>\n"
        "• <b>סוג:</b> <code>בית</code> או <code>בסיס</code>\n"
        "• <b>כדורסל:</b> ימים מופרדים בפסיקים (ריק אם אין)\n"
        "• <b>VR:</b> מספר אירועי VR (ברירת מחדל: 0)\n\n"
        "⏰ יש לך 30 דקות לענות."
    )
    result = send_message(message)
    if result.get("ok"):
        print("✅ Questionnaire sent successfully.")
    else:
        print(f"❌ Failed to send: {result}")
        sys.exit(1)


if __name__ == "__main__":
    main()
