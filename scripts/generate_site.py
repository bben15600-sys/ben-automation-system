#!/usr/bin/env python3
"""
generate_site.py — Reads current week from Notion Weekly Schedule DB
and generates docs/index.html — a beautiful mobile-first dark schedule.

Usage:
    python scripts/generate_site.py

Required env vars:
    NOTION_TOKEN, WEEKLY_DB_ID
"""

import os
import re
import json
import pathlib
from datetime import date, timedelta, datetime
from dotenv import load_dotenv

load_dotenv()

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
WEEKLY_DB_ID = _clean(os.environ["WEEKLY_DB_ID"])

from notion_client import Client
notion = Client(auth=NOTION_TOKEN)

DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
DAYS_HE    = {"Sun": "ראשון", "Mon": "שני",  "Tue": "שלישי",
              "Wed": "רביעי", "Thu": "חמישי", "Fri": "שישי", "Sat": "שבת"}

# ── Notion fetch ──────────────────────────────────────────────────────────────

def get_week_start() -> date:
    today = date.today()
    return today - timedelta(days=(today.weekday() + 1) % 7)


def fetch_week(week_start: date) -> list[dict]:
    week_end = week_start + timedelta(days=6)
    res = notion.databases.query(
        database_id=WEEKLY_DB_ID,
        filter={"and": [
            {"property": "Date", "date": {"on_or_after":  week_start.isoformat()}},
            {"property": "Date", "date": {"on_or_before": week_end.isoformat()}},
        ]},
        sorts=[{"property": "Date", "direction": "ascending"}],
    )
    return res.get("results", [])


def parse_entry(page: dict) -> dict:
    p = page["properties"]

    def txt(k):
        return "".join(x["plain_text"] for x in p.get(k, {}).get("rich_text", []))

    def chk(k):
        return p.get(k, {}).get("checkbox", False)

    def sel(k):
        s = p.get(k, {}).get("select")
        return s["name"] if s else ""

    def dt(k):
        d = p.get(k, {}).get("date")
        return d["start"] if d else ""

    day_en = sel("Day")
    day_date_str = dt("Date")
    try:
        day_date = datetime.fromisoformat(day_date_str).date()
        day_label = f"{DAYS_HE.get(day_en, day_en)} {day_date.strftime('%-d/%-m')}"
    except Exception:
        day_label = DAYS_HE.get(day_en, day_en)

    return {
        "day_en":    day_en,
        "day_label": day_label,
        "day_date":  day_date_str,
        "week_type": sel("Week Type"),
        "morning":   txt("Morning Block"),
        "afternoon": txt("Afternoon Block"),
        "evening":   txt("Evening Block"),
        "basketball":chk("Basketball"),
        "lihi":      chk("Lihi"),
        "family":    chk("Family"),
        "editing":   chk("Editing"),
        "vr":        chk("VR Event"),
        "priority":  sel("Priority"),
        "notes":     txt("Notes"),
    }

# ── Helpers ───────────────────────────────────────────────────────────────────

def block_icon(text: str) -> str:
    t = text.lower()
    if "כדורסל" in t: return "🏀"
    if "טניס"   in t: return "🎾"
    if "ליהי"   in t: return "💛"
    if "קורס"   in t or "עריכה" in t: return "🎬"
    if "מערכת"  in t or "לוגיקה" in t: return "💻"
    if "משפחה"  in t or "אבא"  in t: return "👨‍👩‍👧"
    if "סבא"    in t or "סבתא" in t: return "👵"
    if "חברים"  in t: return "👬"
    if "vr"     in t: return "🥽"
    if "בסיס"   in t: return "🪖"
    if "שינה"   in t or "מנוחה" in t: return "😴"
    if "הליכה"  in t: return "🚶"
    if "ספר"    in t: return "📖"
    if "תכנון"  in t: return "📋"
    return "☀️"


def block_time(slot: str) -> str:
    return {"morning": "09:30 – 13:00",
            "afternoon": "13:00 – 17:00",
            "evening": "19:30 – 22:30"}.get(slot, "")


def priority_class(e: dict) -> str:
    if e["lihi"]:       return "lihi"
    if e["basketball"]: return "sport"
    p = e["priority"]
    if p == "דחוף":    return "urgent"
    if p == "בינוני":  return "medium"
    return "flex"


def day_emoji(e: dict) -> str:
    if e["priority"] == "דחוף": return "🔥"
    if e["lihi"] and e["family"]: return "💛"
    if e["lihi"]:      return "💛"
    if e["basketball"]:return "🏀"
    if e["editing"]:   return "🎬"
    if e["family"]:    return "👨‍👩‍👧"
    if "בסיס" in e["morning"]: return "🪖"
    return "✨"


def make_tags(e: dict) -> list[tuple[str, str]]:
    tags = []
    if e["basketball"]: tags.append(("🏀 כדורסל", "basketball"))
    if e["lihi"]:       tags.append(("💛 ליהי",   "lihi"))
    if e["family"]:     tags.append(("👨‍👩‍👧 משפחה", "family"))
    if e["editing"]:    tags.append(("🎬 עריכה",  "editing"))
    if e["vr"]:         tags.append(("🥽 VR",      "vr"))
    if e["priority"] == "דחוף": tags.append(("🔥 דחוף", "urgent"))
    return tags


def make_timeline(e: dict) -> list[dict]:
    items = []
    for slot, key in [("morning","morning"),("afternoon","afternoon"),("evening","evening")]:
        text = e[key]
        if text and text.strip():
            items.append({
                "icon":  block_icon(text),
                "text":  text,
                "time":  block_time(slot),
                "filled": slot == "evening" and (e["basketball"] or e["lihi"]),
            })
    if e["notes"]:
        items.append({"icon": "📝", "text": e["notes"], "time": "", "filled": False})
    return items

# ── Summary stats ─────────────────────────────────────────────────────────────

def compute_stats(entries: list[dict]) -> dict:
    return {
        "basketball": sum(1 for e in entries if e["basketball"]),
        "lihi":       sum(1 for e in entries if e["lihi"]),
        "editing":    sum(1 for e in entries if e["editing"]),
        "family":     sum(1 for e in entries if e["family"]),
        "vr":         sum(1 for e in entries if e["vr"]),
    }

# ── HTML generation ───────────────────────────────────────────────────────────

CARD_COLORS = {
    "lihi":    "#c084fc",
    "sport":   "#fb923c",
    "urgent":  "#f87171",
    "medium":  "#fbbf24",
    "flex":    "#4ade80",
}

TAG_COLORS = {
    "basketball": ("#fb923c", "#2a1a0a"),
    "lihi":       ("#c084fc", "#1e0a2a"),
    "family":     ("#f472b6", "#2a0a1a"),
    "editing":    ("#34d399", "#0a2a1a"),
    "vr":         ("#60a5fa", "#0a1a2a"),
    "urgent":     ("#f87171", "#2a0a0a"),
}


def render_tag(label: str, kind: str) -> str:
    fg, bg = TAG_COLORS.get(kind, ("#aaa", "#222"))
    return f'<span class="tag" style="color:{fg};background:{bg}">{label}</span>'


def render_timeline_item(item: dict, last: bool) -> str:
    dot_style = "background:#c084fc" if item["filled"] else "background:#3a3a4a"
    line = "" if last else '<div class="tl-line"></div>'
    time_html = f'<div class="tl-time">{item["time"]}</div>' if item["time"] else ""
    return f"""
    <div class="tl-item">
      <div class="tl-left">
        <div class="tl-dot" style="{dot_style}"></div>
        {line}
      </div>
      <div class="tl-body">
        <div class="tl-row">
          <span class="tl-icon">{item["icon"]}</span>
          <span class="tl-text">{item["text"]}</span>
        </div>
        {time_html}
      </div>
    </div>"""


def render_day_card(e: dict) -> str:
    pc    = priority_class(e)
    color = CARD_COLORS.get(pc, "#555")
    emoji = day_emoji(e)
    tags  = make_tags(e)
    tl    = make_timeline(e)

    tags_html = "".join(render_tag(l, k) for l, k in tags)
    tl_html   = "".join(render_timeline_item(item, i == len(tl)-1) for i, item in enumerate(tl))

    return f"""
  <div class="day-card" style="border-right-color:{color}">
    <div class="day-header">
      <div>
        <span class="day-emoji">{emoji}</span>
        <span class="day-name">{e["day_label"]}</span>
      </div>
    </div>
    <div class="tags">{tags_html}</div>
    <div class="timeline">{tl_html}</div>
  </div>"""


def render_stat_card(number, label: str, emoji: str, color: str) -> str:
    return f"""
  <div class="stat-card" style="border-top:3px solid {color}">
    <div class="stat-num" style="color:{color}">{number}</div>
    <div class="stat-emoji">{emoji}</div>
    <div class="stat-label">{label}</div>
  </div>"""


def generate_html(entries: list[dict], week_start: date) -> str:
    stats   = compute_stats(entries)
    week_end = week_start + timedelta(days=6)
    week_range = f"{week_start.strftime('%-d/%-m')} – {week_end.strftime('%-d/%-m/%Y')}"
    generated  = datetime.now().strftime("%d/%m %H:%M")

    stat_cards = "".join([
        render_stat_card(stats["basketball"], "אימוני כדורסל", "🏀", "#fb923c"),
        render_stat_card(stats["lihi"],       "ימים עם ליהי",  "💛", "#c084fc"),
        render_stat_card(stats["editing"],    "ימי עריכה",     "🎬", "#34d399"),
        render_stat_card(stats["family"],     "ימי משפחה",     "👨‍👩‍👧", "#f472b6"),
    ])

    # Sort entries by day order
    order = {d: i for i, d in enumerate(DAYS_ORDER)}
    sorted_entries = sorted(entries, key=lambda e: order.get(e["day_en"], 99))
    day_cards = "".join(render_day_card(e) for e in sorted_entries)

    return f"""<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>לוז שבועי — {week_range}</title>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: #0d0d14;
    color: #e2e2e8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    direction: rtl;
    min-height: 100vh;
    padding: 0 0 40px;
  }}

  /* ── Header ── */
  .header {{
    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 100%);
    padding: 28px 20px 20px;
    text-align: center;
    border-bottom: 1px solid #ffffff10;
  }}
  .header-title {{
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }}
  .header-sub {{
    color: #888;
    font-size: 13px;
    margin-top: 4px;
  }}

  /* ── Stat cards ── */
  .stats-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 16px;
  }}
  .stat-card {{
    background: #1a1a2a;
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
  }}
  .stat-num  {{ font-size: 34px; font-weight: 800; line-height: 1; }}
  .stat-emoji {{ font-size: 20px; margin: 4px 0; }}
  .stat-label {{ font-size: 12px; color: #aaa; }}

  /* ── Section title ── */
  .section-title {{
    font-size: 14px;
    font-weight: 600;
    color: #888;
    padding: 8px 20px 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }}

  /* ── Day cards ── */
  .day-card {{
    background: #1a1a2a;
    border-radius: 16px;
    margin: 8px 16px;
    border-right: 4px solid #555;
    overflow: hidden;
  }}
  .day-header {{
    padding: 14px 16px 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .day-emoji {{ font-size: 18px; margin-left: 8px; }}
  .day-name  {{ font-size: 18px; font-weight: 700; }}

  /* ── Tags ── */
  .tags {{ display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 16px 10px; }}
  .tag {{
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }}

  /* ── Timeline ── */
  .timeline {{ padding: 4px 16px 16px; }}
  .tl-item {{
    display: flex;
    gap: 10px;
    margin-bottom: 4px;
  }}
  .tl-left {{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 12px;
    flex-shrink: 0;
    padding-top: 5px;
  }}
  .tl-dot {{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }}
  .tl-line {{
    width: 2px;
    flex: 1;
    background: #2a2a3a;
    min-height: 14px;
    margin: 2px 0;
  }}
  .tl-body  {{ flex: 1; padding-bottom: 10px; }}
  .tl-row   {{ display: flex; align-items: baseline; gap: 6px; }}
  .tl-icon  {{ font-size: 15px; flex-shrink: 0; }}
  .tl-text  {{ font-size: 14px; font-weight: 500; line-height: 1.4; }}
  .tl-time  {{ font-size: 11px; color: #666; margin-top: 2px; }}

  /* ── Footer ── */
  .footer {{
    text-align: center;
    color: #444;
    font-size: 12px;
    padding: 24px 16px 0;
  }}
</style>
</head>
<body>

<div class="header">
  <div class="header-title">📅 לוז שבועי</div>
  <div class="header-sub">{week_range}</div>
</div>

<div class="stats-grid">
{stat_cards}
</div>

<div class="section-title">⚡ פירוט יומי</div>

{day_cards}

<div class="footer">עודכן {generated}</div>

</body>
</html>"""

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    week_start = get_week_start()
    print(f"Fetching week {week_start}…")

    pages = fetch_week(week_start)
    if not pages:
        print("No entries found for this week.")
        # Generate placeholder page
        entries = []
    else:
        entries = [parse_entry(p) for p in pages]
        print(f"Found {len(entries)} days.")

    html = generate_html(entries, week_start)

    out = pathlib.Path(__file__).parent.parent / "docs" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"✅ Generated {out}")


if __name__ == "__main__":
    main()
