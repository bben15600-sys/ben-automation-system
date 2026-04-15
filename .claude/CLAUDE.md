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

### Existing
| Database | Collection ID |
|---|---|
| Rotation Schedule | `ac656f74-60b6-41a3-adc2-49e6656c3845` |
| Budget | `295bb07d-d7b9-8176-a6bd-000b6ad23eca` |
| VR Events | `8d15b9e6-8aed-47fc-97bc-38f1570dea79` |
| Video Projects | `36f48996-4d93-4080-b805-5b59f8f51e0b` |
| Investments | `30c5ed27-8b02-439a-a510-de4601e22a30` |
| Daily Brief | `bfcfbfe8-e343-43d2-85a6-f12668150157` |

### New (need to create in Notion and fill in IDs)
| Database | Placeholder ID | Agent |
|---|---|---|
| Relationships | `RELATIONSHIPS_DB_ID` | relationship-tracker |
| Freelance Projects | `FREELANCE_DB_ID` | freelance-manager, invoice-generator |
| Recipes | `RECIPES_DB_ID` | meal-planner |
| Meal Plans | `MEAL_PLANS_DB_ID` | meal-planner |
| Invoices | `INVOICES_DB_ID` | invoice-generator |

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
