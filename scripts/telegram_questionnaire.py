#!/usr/bin/env python3
"""
telegram_questionnaire.py — Sends weekly Sunday questionnaire via Telegram.
Runs every Sunday at 20:00 Israel time via GitHub Actions.

Required env vars:
    TELEGRAM_BOT_TOKEN
    TELEGRAM_CHAT_ID
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


def get_next_sunday() -> date:
    today = date.today()
    days_until_sunday = (6 - today.weekday()) % 7
    return today + timedelta(days=days_until_sunday if days_until_sunday > 0 else 7)


def main():
    next_sunday = get_next_sunday()
    week_label  = next_sunday.strftime('%d/%m')

    message = (
        f"📅 <b>תכנון שבוע {week_label}</b>\n\n"
        "העתק, מלא ושלח חזרה:\n\n"
        "<pre>"
        "סוג: בית\n"
        "ליהי: שלישי,שישי,שבת\n"
        "כדורסל: שני,רביעי,חמישי\n"
        "עבודה: —\n"
        "קורס-צפייה: 90\n"
        "קורס-תרגול: 60\n"
        "מערכת: 60\n"
        "אבא: שישי\n"
        "סבא: לא\n"
        "חברים: 0\n"
        "חסומים: —\n"
        "הערות: "
        "</pre>\n\n"
        "📌 <b>מפתח:</b>\n"
        "• <b>סוג:</b> <code>בית</code> / <code>בסיס</code>\n"
        "• <b>ימים:</b> ראשון שני שלישי רביעי חמישי שישי שבת\n"
        "• <b>קורס/מערכת:</b> דקות סה״כ השבוע (0 = אין)\n"
        "• <code>—</code> או <code>לא</code> = ריק\n\n"
        "⏰ יש לך עד 20:30 לענות."
    )

    result = send_message(message)
    if result.get("ok"):
        print("✅ Questionnaire sent successfully.")
    else:
        print(f"❌ Failed: {result}")
        sys.exit(1)


if __name__ == "__main__":
    main()
