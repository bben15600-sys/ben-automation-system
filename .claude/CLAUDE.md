# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

- **Engine**: Claude Code — interprets agent SKILL.md files and executes operations
- **Data Layer**: Notion — all persistent data lives in Notion databases (no local DB)
- **Repository**: GitHub — stores agent instructions, config templates, and version history
- **Access Layer**: Telegram / Remote Control (planned, not yet implemented)

At runtime, Claude Code reads a SKILL.md, connects to Notion via MCP, and performs read/write operations based on user queries.

## MCP Servers Required

Copy `config/claude_desktop_config.template.json` to your Claude Desktop config and fill in secrets:

| Server | Package | Secret |
|---|---|---|
| notion | `@notionhq/notion-mcp-server` | `NOTION_API_TOKEN` |
| brave-search | `@modelcontextprotocol/server-brave-search` | `BRAVE_API_KEY` |
| desktop-commander | `@wonderwhy-er/desktop-commander@latest` | — |
| playwright | `@playwright/mcp@latest` | — |

Secrets go in environment variables — never committed to the repo (see `.gitignore`).

## Notion Databases

| Database | Collection ID |
|---|---|
| Budget (תקציב) | `344bb07d-d7b9-814d-8340-ec900e1a5637` |
| Schedule (לוז יומי) | `344bb07d-d7b9-8147-bc66-faf98025db8d` |
| Investments (השקעות) | `344bb07d-d7b9-810e-ab8d-c95436081d84` |
| VR Events (אירועי VR) | `344bb07d-d7b9-810c-b59d-cfb0b15b0780` |
| Videos (פרויקטי וידאו) | `344bb07d-d7b9-8157-8804-d4288b598a2e` |
| Goals (יעדים שבועיים) | `344bb07d-d7b9-81c4-8c96-f8e9ec774c74` |

## Agent Structure

Each agent lives in `agents/<name>/SKILL.md` and follows this pattern:
- **Trigger**: keywords that activate the agent (e.g. "budget", "schedule")
- **Operations**: ordered steps — read DBs → compute → write back to Notion
- **Data Sources**: which Notion DBs are read vs. written
- **Output**: Hebrew summary returned to user

## Conventions

- Agent instructions: `agents/<name>/SKILL.md`
- Config templates: `config/` (never commit filled-in secrets)
- Scripts: `scripts/` (not yet created)
- Language: Hebrew for all user-facing output; English for code, config, and SKILL.md logic
