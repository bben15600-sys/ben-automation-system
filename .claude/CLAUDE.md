# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Web (Next.js)
```bash
cd web && npm run dev      # Dev server on localhost:3000
cd web && npm run build    # Production build (runs TypeScript check)
cd web && npm run lint     # ESLint
```

### Python Scripts
```bash
python scripts/weekly_planner_bot.py      # Interactive Telegram questionnaire (25min timeout)
python scripts/weekly_scheduler.py        # Generate individual events in "לוז יומי" DB
python scripts/setup_oslife_notion.py     # Discover DBs + create Rotation (one-time)
python scripts/telegram_collect.py        # Parse filled questionnaire → Rotation DB
python scripts/seed_rotation.py           # Populate rotation DB (one-time)

# Obsolete (kept for reference, not used by workflow):
python scripts/generate_site.py           # Old static HTML generator for docs/
```

Requires: `pip install -r requirements.txt` (notion-client, python-dotenv)

## Architecture

Three-layer system: **Next.js frontend** → **API routes** → **Notion databases**

### Weekly Planning Pipeline (automated via GitHub Actions every Sunday 20:00 IST)
1. `weekly_planner_bot.py` — Telegram inline-keyboard questionnaire collects preferences
2. `weekly_scheduler.py` — Reads Plan JSON from Rotation DB, emits individual timed events (not day blocks) into "לוז יומי" DB; oslife.app reads these directly
3. Telegram notification with link to oslife.app/schedule

### Web App (Next.js 16.2.4, App Router)
- **Dashboard** (`page.tsx`): Fetches `/api/dashboard` → renders metrics, goals, timeline with Framer Motion
- **Chat** (`chat/page.tsx`): Session manager, model picker, image upload, voice input
- **API Routes**: `/api/chat` (OpenRouter SSE streaming), `/api/dashboard` (Notion queries), `/api/setup-notion`, `/api/populate`

### Agent System
Agents live in `agents/<name>/SKILL.md`. Claude Code reads the SKILL.md and executes Notion operations:
- `budget-tracker` — Monthly expense totals by category, car savings progress
- `daily-brief` — Stock prices (VOO, QQQ, NVDA, TSLA) vs portfolio targets
- `weekly-scheduler` — Schedule generation from Rotation DB
- `vr-income-tracker` — VR event income → Budget DB entries
- `video-project-manager` — Video project lifecycle + spec enforcement

## Notion Databases

All databases live under "oslife Dashboard" page in Notion.

| Database | ID | Key Fields |
|---|---|---|
| Budget (תקציב) | `344bb07d-d7b9-81f5-b81c-c68e52058fca` | Name, Amount, Category, Date |
| Schedule (לוז יומי) | `344bb07d-d7b9-81d5-93ac-e7fdae80c08e` | Name, Date (with time), Category, Done |
| Investments (השקעות) | `344bb07d-d7b9-8189-ab07-cb694b8a690d` | Name, Value, Change, Type, Date |
| VR Events (אירועי VR) | `344bb07d-d7b9-818d-b476-e66913f38d9b` | Name, Date, Location, Status |
| Videos (פרויקטי וידאו) | `344bb07d-d7b9-81d6-8fab-e056ba2f41f1` | Name, Status, Deadline, Platform |
| Goals (יעדים שבועיים) | `344bb07d-d7b9-819c-ba1a-ec09b4261d94` | Name, Done, Target, Color |
| Rotation (new) | `347bb07d-d7b9-81d9-ad13-fa7906b5f20e` | Name, Week Type, Date, Basketball Days, VR Events Count, Schedule Created, Plan JSON |

Notion queries use raw `fetch` against `https://api.notion.com/v1` (not the SDK — the SDK v5 removed `databases.query`).

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NOTION_API_TOKEN` | Vercel + GitHub Actions | Notion API auth |
| `OPENROUTER_API_KEY` | Vercel | Chat model routing |
| `TELEGRAM_BOT_TOKEN` | GitHub Actions | Telegram bot |
| `TELEGRAM_CHAT_ID` | GitHub Actions | Target chat |
| `ROTATION_DB_ID` | GitHub Actions | Python scripts rotation DB |
| `WEEKLY_DB_ID` | GitHub Actions | Python scripts schedule DB |

## Key Technical Details

- **Tailwind v4**: Uses `@import "tailwindcss"` + `@theme inline` block in CSS (no tailwind.config.js)
- **RTL Hebrew**: `<html lang="he" dir="rtl">` with Heebo font
- **Dark theme**: Base `#060a14`, glass cards with `backdrop-filter: blur`, neon accents
- **Chat routing**: `lib/router.ts` classifies messages into free/cheap/premium tiers, picks model, falls back on 404/400
- **Chat streaming**: OpenRouter SSE passthrough with `X-Model-Label/Tier/Id` headers
- **Sessions**: `lib/sessions.ts` stores chat sessions in localStorage with auto-naming
- **Schedule week**: Monday–Monday (8 days), not standard Sun–Sat
- **Plan JSON**: Full weekly plan stored as rich_text field in Rotation DB (2000-char limit)

## Conventions

- Agent instructions: `agents/<name>/SKILL.md`
- Config templates: `config/` (never commit filled-in secrets)
- Language: Hebrew for all user-facing output; English for code, config, and SKILL.md logic
- Web app pages are client components (`"use client"`) for state/animation; API routes are server-side
- All Notion database IDs are hardcoded in `web/src/lib/notion.ts` — if databases are recreated, update there + CLAUDE.md
