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
import sys
import urllib.request
import urllib.parse
import json

TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"].strip()
TELEGRAM_CHAT_ID = os.environ["TELEGRAM_CHAT_ID"].strip()

TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def send_message(text: str, parse_mode: str = "Markdown") -> dict:
    url = f"{TELEGRAM_API}/sendMessage"
    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": parse_mode,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main():
    message = (
        "📅 *תכנון שבוע הבא*\n\n"
        "שלח תשובה בפורמט הבא:\n\n"
        "```\n"
        "סוג: בית\n"
        "כדורסל: שני,רביעי,חמישי\n"
        "VR: 0\n"
        "```\n\n"
        "📌 *אפשרויות:*\n"
        "• *סוג:* `בית` או `בסיס`\n"
        "• *כדורסל:* ימים מופרדים בפסיקים (או ריק אם אין)\n"
        "• *VR:* מספר אירועי VR השבוע (ברירת מחדל: 0)\n\n"
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
