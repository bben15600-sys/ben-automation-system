# Ben Automation System

## Architecture
- **Engine**: Claude Code (runs agents, logic, permissions)
- **Data Layer**: Notion (databases, views, operational data)
- **Repository**: GitHub (code, prompts, skills, config, version history)
- **Access Layer**: Remote Control / Telegram (future)

## Notion Data Sources
- Rotation Schedule DB: `collection://ac656f74-60b6-41a3-adc2-49e6656c3845`
- Budget DB: `collection://295bb07d-d7b9-8176-a6bd-000b6ad23eca`
- VR Events DB: `collection://8d15b9e6-8aed-47fc-97bc-38f1570dea79`
- Video Projects DB: `collection://36f48996-4d93-4080-b805-5b59f8f51e0b`
- Investments DB: `collection://30c5ed27-8b02-439a-a510-de4601e22a30`
- Daily Brief DB: `collection://bfcfbfe8-e343-43d2-85a6-f12668150157`

## Conventions
- All agent instructions live in `agents/<name>/SKILL.md`
- Scripts in `scripts/`
- Config templates in `config/`
- Language: Hebrew for user-facing, English for code and config
