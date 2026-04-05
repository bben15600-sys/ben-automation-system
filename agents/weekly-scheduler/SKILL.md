---
name: weekly-scheduler
description: Builds weekly schedule based on rotation. Trigger when asked about schedule or planning.
---

# Weekly Scheduler Agent

## Instructions
1. Read Rotation Schedule DB from Notion for current week
2. Check if Week Type is Base or Home
3. Check VR Events Count and Basketball Days
4. Generate appropriate schedule:
   - **Base week**: minimal schedule, rest + light editing
   - **Home week**: full schedule with Lihi, family, basketball, editing
5. Create/update Weekly Schedule page in Notion
6. Send summary via Telegram (when available)

## Data Sources
- **Read**: Rotation Schedule DB (`collection://ac656f74-60b6-41a3-adc2-49e6656c3845`)
- **Write**: Weekly Schedule page in Notion
