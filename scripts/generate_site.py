#!/usr/bin/env python3
"""
generate_site.py — Reads current week from Notion Weekly Schedule DB
and generates docs/index.html — mobile-first dark schedule (Mon–Mon, 8 days).

Usage:
    python scripts/generate_site.py

Required env vars:
    NOTION_TOKEN, WEEKLY_DB_ID
"""

import os
import re
import pathlib
from datetime import date, timedelta, datetime, timezone
from dotenv import load_dotenv

load_dotenv()


def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)


NOTION_TOKEN = os.environ["NOTION_TOKEN"].strip()
WEEKLY_DB_ID = _clean(os.environ["WEEKLY_DB_ID"])

from notion_client import Client
notion = Client(auth=NOTION_TOKEN)

# ── Day config ────────────────────────────────────────────────────────────────
# Week: Mon(0) Tue(1) Wed(2) Thu(3) Fri(4) Sat(5) Sun(6) Mon(7) — 8 days
WEEKDAY_TO_EN = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
DAYS_HE = {
    "Mon": "שני",   "Tue": "שלישי", "Wed": "רביעי",
    "Thu": "חמישי", "Fri": "שישי",  "Sat": "שבת",  "Sun": "ראשון",
}
DAY_SORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def resolve_db_id(id_or_page: str) -> str:
    try:
        notion.databases.retrieve(database_id=id_or_page)
        return id_or_page
    except Exception:
        pass
    results = notion.search(filter={"property": "object", "value": "database"})
    for db in results.get("results", []):
        title_parts = db.get("title", [])
        name = title_parts[0]["plain_text"] if title_parts else ""
        if "weekly" in name.lower() or "schedule" in name.lower() or "שבועי" in name:
            return db["id"]
    raise ValueError(f"Could not resolve {id_or_page!r} to a Weekly Schedule database.")


WEEKLY_DB_ID = resolve_db_id(WEEKLY_DB_ID)


def get_week_start() -> date:
    """Return this week's Monday. When run on Sunday (cron night), return tomorrow."""
    today = date.today()
    wd = today.weekday()  # Mon=0 … Sun=6
    if wd == 6:
        return today + timedelta(days=1)
    return today - timedelta(days=wd)


def fetch_week(week_start: date) -> list[dict]:
    """Fetch 8 days: Mon inclusive to following Mon inclusive."""
    week_end = week_start + timedelta(days=7)
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

    day_date_str = dt("Date")
    try:
        day_date = datetime.fromisoformat(day_date_str).date()
        day_en   = WEEKDAY_TO_EN.get(day_date.weekday(), "Mon")
        date_label = day_date.strftime("%-d/%-m")
    except Exception:
        day_en     = sel("Day") or "Mon"
        day_date   = None
        date_label = ""

    morning   = txt("Morning Block")
    afternoon = txt("Afternoon Block")
    evening   = txt("Evening Block")
    notes     = txt("Notes")
    full_text = " ".join([morning, afternoon, evening, notes]).lower()

    return {
        "day_en":     day_en,
        "day_label":  DAYS_HE.get(day_en, day_en),
        "date_label": date_label,
        "day_date":   day_date,
        "week_type":  sel("Week Type"),
        "morning":    morning,
        "afternoon":  afternoon,
        "evening":    evening,
        "notes":      notes,
        "full_text":  full_text,
        "basketball": chk("Basketball"),
        "lihi":       chk("Lihi"),
        "family":     chk("Family"),
        "editing":    chk("Editing"),
        "vr":         chk("VR Event"),
        "priority":   sel("Priority"),
    }


# ── Inference helpers ─────────────────────────────────────────────────────────

def infer_category(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ["כדורסל", "טניס", "אימון", "ספורט"]):        return "ספורט"
    if any(k in t for k in ["ליהי"]):                                      return "זוגיות"
    if any(k in t for k in ["אבא", "סבא", "סבתא", "משפחה"]):              return "משפחה"
    if any(k in t for k in ["עריכה", "קורס", "מערכת", "לוגיקה"]):         return "עבודה"
    if any(k in t for k in ["עבודה", "משמרת"]):                            return "עבודה"
    if any(k in t for k in ["חברים", "חבר", "קפה"]):                      return "חברתי"
    if any(k in t for k in ["שינה"]):                                      return "מנוחה"
    if any(k in t for k in ["מנוחה", "נוח"]):                             return "מנוחה"
    if any(k in t for k in ["חג", "יום טוב", "חגיגה"]):                   return "חג"
    if any(k in t for k in ["נסיעה", "הגעה", "יציאה", "בסיס", "כניסה"]): return "לוגיסטיקה"
    if any(k in t for k in ["ארוחת", "ארוחה", "קימה", "הפסקה", "בוקר"]): return "התחלת יום"
    if any(k in t for k in ["ספר", "קריאה"]):                             return "כללי"
    return "כללי"


CATEGORY_COLORS = {
    "ספורט":        ("#fb923c", "#2a1a0a"),
    "זוגיות":       ("#f472b6", "#2a0a1a"),
    "משפחה":        ("#f472b6", "#2a0a1a"),
    "עבודה":        ("#34d399", "#0a2a1a"),
    "חברתי":        ("#60a5fa", "#0a1a2a"),
    "מנוחה":        ("#a78bfa", "#1a0a2a"),
    "חג":           ("#fbbf24", "#2a1a00"),
    "לוגיסטיקה":   ("#94a3b8", "#1a1a2a"),
    "התחלת יום":   ("#6b7280", "#111827"),
    "כללי":         ("#4b5563", "#111827"),
}


def block_icon(text: str) -> str:
    t = text.lower()
    if "כדורסל" in t: return "🏀"
    if "טניס"   in t: return "🎾"
    if "ליהי"   in t: return "❤️"
    if "קורס"   in t or "עריכה" in t: return "🎬"
    if "מערכת"  in t or "לוגיקה" in t: return "💻"
    if "אבא"    in t: return "🧑"
    if "סבא"    in t or "סבתא"  in t: return "👴"
    if "חברים"  in t or "חבר"   in t: return "👥"
    if "שינה"   in t:                  return "😴"
    if "מנוחה"  in t:                  return "🛋️"
    if "ארוחת"  in t or "ארוחה" in t: return "🍽"
    if "הפסקה"  in t:                  return "☕"
    if "קפה"    in t:                  return "☕"
    if "קימה"   in t or "בוקר"  in t: return "☕"
    if "עבודה"  in t:                  return "💼"
    if "חג"     in t:                  return "🎉"
    if "נסיעה"  in t or "הגעה"  in t: return "🚗"
    if "בסיס"   in t or "כניסה" in t: return "✈️"
    if "יציאה"  in t:                  return "🚗"
    if "הליכה"  in t:                  return "🚶"
    if "ספר"    in t or "קריאה" in t: return "📖"
    if "vr"     in t:                  return "🥽"
    if "תכנון"  in t:                  return "📋"
    if "חופשי"  in t:                  return "✨"
    return "⚡"


def day_type_info(e: dict) -> tuple:
    ft = e["full_text"]
    if "כניסה לבסיס" in ft or ("בסיס" in ft and "כניסה" in ft):
        return "כניסה לבסיס", "#94a3b8", "#1e293b"
    if "יציאה מבסיס" in ft or ("בסיס" in ft and "יציאה" in ft):
        return "יציאה מבסיס", "#94a3b8", "#1e293b"
    if "בסיס" in ft:
        return "בסיס", "#94a3b8", "#1e293b"
    if "חג" in ft:
        return "חג", "#fbbf24", "#451a03"
    if "נסיעה" in ft:
        return "נסיעה", "#60a5fa", "#1e3a5f"
    if not e["basketball"] and ("מנוחה מלא" in ft or (e["day_en"] == "Sat" and not e["lihi"])):
        return "מנוחה מלאה", "#a78bfa", "#2e1065"
    if "הגעה הביתה" in ft:
        return "חזרה הביתה", "#6b7280", "#1f2937"
    if e["priority"] == "דחוף" or "עמוס" in ft:
        return "יום עמוס", "#fb923c", "#431407"
    if e["lihi"] and e["family"]:
        return "יום עם ליהי", "#f472b6", "#500724"
    if e["lihi"]:
        return "יום עם ליהי", "#f472b6", "#500724"
    if e["editing"]:
        return "יום עריכה", "#34d399", "#064e3b"
    if e["basketball"]:
        return "יום ספורט", "#fb923c", "#431407"
    if e["family"]:
        return "יום משפחה", "#f472b6", "#500724"
    return "יום רגיל", "#6b7280", "#1f2937"


def day_main_icon(e: dict) -> str:
    ft = e["full_text"]
    if "חג" in ft:                        return "🎉"
    if "נסיעה" in ft:                     return "🚗"
    if "כניסה לבסיס" in ft:               return "✈️"
    if "יציאה מבסיס" in ft:               return "🏠"
    if "בסיס" in ft:                      return "✈️"
    if e["lihi"]:                         return "💜"
    if e["basketball"]:                   return "🏀"
    if e["editing"]:                      return "🎬"
    if e["family"]:                       return "👨‍👩‍👧"
    if e["day_en"] == "Sat":              return "🌙"
    return "✨"


def day_icon_bg(e: dict) -> str:
    ft = e["full_text"]
    if "בסיס" in ft:      return "linear-gradient(135deg,#374151,#1f2937)"
    if "חג" in ft:         return "linear-gradient(135deg,#78350f,#451a03)"
    if "נסיעה" in ft:      return "linear-gradient(135deg,#1e3a5f,#0c2340)"
    if e["lihi"]:          return "linear-gradient(135deg,#7c3aed,#4c1d95)"
    if e["basketball"]:    return "linear-gradient(135deg,#c2410c,#7c2d12)"
    if e["editing"]:       return "linear-gradient(135deg,#065f46,#064e3b)"
    if e["family"]:        return "linear-gradient(135deg,#9d174d,#831843)"
    if e["day_en"] == "Sat": return "linear-gradient(135deg,#2e1065,#1e0a3a)"
    return "linear-gradient(135deg,#374151,#1f2937)"


# ── Items builder ─────────────────────────────────────────────────────────────

TIME_LABELS = {
    "morning":   "בוקר",
    "afternoon": "צהריים",
    "evening":   "ערב",
}


def _time_mins(t: str) -> int:
    """'HH:MM' → minutes since midnight for sorting. Returns 9999 if unparseable."""
    m = re.match(r'^(\d{1,2}):(\d{2})', t.strip())
    return int(m.group(1)) * 60 + int(m.group(2)) if m else 9999


def build_items(e: dict) -> list[dict]:
    items = []
    for slot in ["morning", "afternoon", "evening"]:
        text = e[slot]
        if not text or not text.strip():
            continue

        lines      = [l.strip() for l in text.split("\n") if l.strip()]
        slot_label = TIME_LABELS[slot]

        for i, line in enumerate(lines):
            # "HH:MM–HH:MM ..." range prefix
            range_m  = re.match(r'^(\d{1,2}:\d{2}\s*[–\-]\s*\d{1,2}:\d{2})\s*[—\-–]?\s*(.*)', line)
            # "HH:MM — text" or "HH:MM text"
            single_m = re.match(r'^(\d{1,2}:\d{2})\s*(?:[—\-–]\s*)?(.*)', line)

            if range_m:
                t_display = range_m.group(1).replace("-", "–").strip()
                body      = range_m.group(2).strip()
            elif single_m and single_m.group(2).strip():
                t_display = single_m.group(1)
                body      = single_m.group(2).strip()
            else:
                t_display = slot_label if i == 0 else ""
                body      = line

            if not body:
                continue

            # Old-format single line may have comma-separated sub-items
            if not range_m and not (single_m and single_m.group(2).strip()):
                parts = [p.strip() for p in body.split(",") if p.strip()]
                for j, part in enumerate(parts):
                    items.append({
                        "icon":     block_icon(part),
                        "text":     part,
                        "time":     t_display if j == 0 else "",
                        "category": infer_category(part),
                    })
            else:
                items.append({
                    "icon":     block_icon(body),
                    "text":     body,
                    "time":     t_display,
                    "category": infer_category(body),
                })

    if e["notes"]:
        items.append({"icon": "📝", "text": e["notes"], "time": "", "category": "כללי"})

    # Sort all items by time so cross-block ordering is correct
    items.sort(key=lambda i: _time_mins(i["time"]))

    return items


# ── Stats ─────────────────────────────────────────────────────────────────────

def compute_stats(entries: list[dict]) -> dict:
    basketball_days = sum(1 for e in entries if e["basketball"])
    lihi_days       = sum(1 for e in entries if e["lihi"])
    family_days     = sum(1 for e in entries if e["family"] or e["lihi"])
    editing_days    = sum(1 for e in entries if e["editing"])
    vr_count        = sum(1 for e in entries if e["vr"])

    basketball_h = round(basketball_days * 2.5)

    # Try to extract editing hours from text (e.g. "עריכה – 4 שעות")
    editing_h = 0
    for e in entries:
        m = re.search(r'(\d+)\s*שעות?', e["full_text"])
        if m and e["editing"]:
            editing_h += int(m.group(1))
    if not editing_h:
        editing_h = editing_days * 3

    family_h = family_days * 3

    return {
        "basketball_days": basketball_days,
        "basketball_h":    basketball_h,
        "lihi_days":       lihi_days,
        "family_days":     family_days,
        "family_h":        family_h,
        "editing_days":    editing_days,
        "editing_h":       editing_h,
        "vr_count":        vr_count,
    }


# ── HTML rendering ────────────────────────────────────────────────────────────

def render_stat_card(number, label: str, emoji: str, color: str) -> str:
    return f"""
    <div class="stat-card">
      <div class="stat-num" style="color:{color}">{number}</div>
      <div class="stat-emoji">{emoji}</div>
      <div class="stat-label">{label}</div>
    </div>"""


def render_progress_bar(label: str, icon: str, hours: int, max_h: int = 15) -> str:
    pct = min(100, int(hours / max_h * 100)) if max_h else 0
    return f"""
    <div class="bar-row">
      <div class="bar-label">{icon} {label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:{pct}%"></div></div>
      <div class="bar-val">~{hours} שעות</div>
    </div>"""


def render_item(item: dict) -> str:
    cat      = item["category"]
    fg, bg   = CATEGORY_COLORS.get(cat, ("#4b5563", "#111827"))
    time_str = item["time"]
    time_html = f'<span class="item-time">{time_str}</span>' if time_str else ""
    return f"""
      <div class="day-item">
        <div class="item-main">
          <span class="item-text">{item["text"]}</span>
          <span class="item-icon">{item["icon"]}</span>
          {time_html}
        </div>
        <span class="item-tag" style="color:{fg};background:{bg}">{cat}</span>
      </div>"""


def render_day_card(e: dict, idx: int) -> str:
    type_label, type_fg, type_bg = day_type_info(e)
    main_icon  = day_main_icon(e)
    icon_bg    = day_icon_bg(e)
    items      = build_items(e)
    items_html = "".join(render_item(item) for item in items)
    card_id    = f"day-{idx}"
    date_str   = f" {e['date_label']}" if e.get("date_label") else ""

    return f"""
  <div class="day-card" id="{card_id}">
    <div class="day-header" onclick="toggleDay('{card_id}')">
      <span class="day-toggle" id="arr-{card_id}">▼</span>
      <span class="day-type-tag" style="color:{type_fg};background:{type_bg}">{type_label}</span>
      <div class="day-name-wrap">
        <span class="day-name">{e["day_label"]}</span>
        <span class="day-date">{date_str}</span>
      </div>
      <div class="day-icon-box" style="background:{icon_bg}">{main_icon}</div>
    </div>
    <div class="day-body" id="body-{card_id}">
{items_html}
    </div>
  </div>"""


def generate_html(entries: list[dict], week_start: date) -> str:
    stats      = compute_stats(entries)
    week_end   = week_start + timedelta(days=7)
    week_range = f"{week_start.strftime('%-d/%-m')} – {week_end.strftime('%-d/%-m/%Y')}"
    IST = timezone(timedelta(hours=3))
    generated  = datetime.now(IST).strftime("%d/%m %H:%M")

    # Sort: Mon first (this week), then Tue–Sun, then Mon (next week)
    first_mon   = [e for e in entries if e["day_en"] == "Mon" and e["day_date"] == week_start]
    middle_days = [e for e in entries if not (e["day_en"] == "Mon" and e["day_date"] == week_start)
                                      and not (e["day_en"] == "Mon" and e["day_date"] == week_end)]
    last_mon    = [e for e in entries if e["day_en"] == "Mon" and e["day_date"] == week_end]
    middle_days.sort(key=lambda e: DAY_SORT.index(e["day_en"]) if e["day_en"] in DAY_SORT else 99)
    sorted_entries = first_mon + middle_days + last_mon

    total_days = len(sorted_entries)

    stat_cards = "".join([
        render_stat_card(stats["basketball_days"], "אימוני כדורסל", "🏀", "#fb923c"),
        render_stat_card(stats["editing_h"],       "שעות עריכה",   "🎬", "#34d399"),
        render_stat_card(stats["lihi_days"],       "ימים עם ליהי", "❤️", "#f472b6"),
        render_stat_card(stats["vr_count"] or "—", "אירועי VR",   "🥽", "#60a5fa"),
    ])

    progress_bars = "".join([
        render_progress_bar("כדורסל",               "🏀", stats["basketball_h"]),
        render_progress_bar("עריכה",                "🎬", stats["editing_h"]),
        render_progress_bar("משפחה ואנשים אהובים",  "❤️", stats["family_h"]),
    ])

    day_cards = "".join(render_day_card(e, i) for i, e in enumerate(sorted_entries))

    return f"""<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>הלוז שלי — {week_range}</title>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: #0a0a12;
    color: #e2e2e8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    direction: rtl;
    min-height: 100vh;
    padding-bottom: 48px;
  }}

  /* ── Header ── */
  .header {{
    background: linear-gradient(160deg, #12122a 0%, #0d0d1e 100%);
    padding: 40px 20px 28px;
    text-align: center;
  }}
  .header-pill {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #7c3aed22, #db277722);
    border: 1px solid #7c3aed44;
    border-radius: 99px;
    padding: 6px 20px;
    font-size: 12px;
    color: #c4b5fd;
    margin-bottom: 18px;
    letter-spacing: 3px;
  }}
  .header-title {{
    font-size: 44px;
    font-weight: 900;
    background: linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    margin-bottom: 12px;
  }}
  .header-sub {{
    color: #6b7280;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }}
  .header-dot {{ width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }}

  /* ── Stats grid ── */
  .stats-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 20px 16px 0;
  }}
  .stat-card {{
    background: #12122a;
    border-radius: 18px;
    padding: 20px 14px;
    text-align: center;
    border: 1px solid #ffffff08;
  }}
  .stat-num   {{ font-size: 42px; font-weight: 900; line-height: 1; }}
  .stat-emoji {{ font-size: 22px; margin: 6px 0 4px; }}
  .stat-label {{ font-size: 12px; color: #9ca3af; }}

  /* ── Weekly breakdown ── */
  .breakdown {{
    margin: 14px 16px 0;
    background: #12122a;
    border-radius: 18px;
    padding: 18px 16px;
    border: 1px solid #ffffff08;
  }}
  .breakdown-title {{
    font-size: 14px;
    font-weight: 700;
    color: #e2e2e8;
    margin-bottom: 16px;
  }}
  .bar-row {{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }}
  .bar-row:last-child {{ margin-bottom: 0; }}
  .bar-label {{ font-size: 13px; color: #d1d5db; min-width: 90px; text-align: right; }}
  .bar-track {{
    flex: 1;
    height: 6px;
    background: #1f2937;
    border-radius: 99px;
    overflow: hidden;
  }}
  .bar-fill {{
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #db2777);
    border-radius: 99px;
  }}
  .bar-val {{ font-size: 12px; color: #6b7280; min-width: 60px; text-align: left; direction: ltr; }}

  /* ── Section title ── */
  .section-title {{
    font-size: 12px;
    font-weight: 700;
    color: #4b5563;
    padding: 20px 20px 8px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }}

  /* ── Day cards ── */
  .day-card {{
    background: #12122a;
    border-radius: 20px;
    margin: 8px 16px;
    border: 1px solid #ffffff08;
    overflow: hidden;
  }}
  .day-header {{
    padding: 14px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }}
  .day-toggle {{
    font-size: 11px;
    color: #4b5563;
    transition: transform 0.25s ease;
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }}
  .day-toggle.open {{ transform: rotate(180deg); }}
  .day-type-tag {{
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    flex-shrink: 0;
    white-space: nowrap;
  }}
  .day-name-wrap {{
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }}
  .day-name  {{ font-size: 20px; font-weight: 800; }}
  .day-date  {{ font-size: 12px; color: #6b7280; }}
  .day-icon-box {{
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }}

  /* ── Day body & items ── */
  .day-body {{ overflow: hidden; }}
  .day-body.collapsed {{ display: none; }}
  .day-item {{
    padding: 10px 14px;
    border-top: 1px solid #ffffff06;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }}
  .item-main {{
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .item-text {{ flex: 1; font-size: 14px; font-weight: 500; line-height: 1.4; }}
  .item-icon {{ font-size: 18px; flex-shrink: 0; }}
  .item-time {{ font-size: 12px; color: #6b7280; direction: ltr; white-space: nowrap; flex-shrink: 0; }}
  .item-tag  {{
    display: inline-block;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    width: fit-content;
  }}

  /* ── Footer ── */
  .footer {{
    text-align: center;
    color: #374151;
    font-size: 11px;
    padding: 28px 16px 0;
  }}
</style>
</head>
<body>

<div class="header">
  <div class="header-pill">📅 ה ל ו ז  ה א י ש י  ש ל י</div>
  <div class="header-title">השבוע שלי</div>
  <div class="header-sub">
    <div class="header-dot"></div>
    {total_days} ימים · מאורגן ומוכן
  </div>
</div>

<div class="stats-grid">
{stat_cards}
</div>

<div class="breakdown">
  <div class="breakdown-title">⚡ פירוט שבועי</div>
{progress_bars}
</div>

<div class="section-title">⚡ פירוט יומי</div>

{day_cards}

<div class="footer">עודכן {generated}</div>

<script>
function toggleDay(id) {{
  var body = document.getElementById('body-' + id);
  var arr  = document.getElementById('arr-' + id);
  if (!body) return;
  body.classList.toggle('collapsed');
  arr.classList.toggle('open');
}}
</script>

</body>
</html>"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    week_start = get_week_start()
    print(f"Fetching week {week_start} (Mon–Mon, 8 days)…")

    pages = fetch_week(week_start)
    if not pages:
        print("No entries found for this week.")
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
