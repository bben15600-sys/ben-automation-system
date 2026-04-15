---
name: personal-dashboard
description: Generates a personal dashboard HTML page with all key metrics. Trigger on dashboard/סטטוס/overview queries.
---

# Personal Dashboard Agent

## Instructions
1. Read data from all relevant DBs:
   - Budget DB → monthly spending summary
   - VR Events DB → monthly VR income
   - Freelance Projects DB → active projects + outstanding payments
   - Investments DB → portfolio status
   - Relationships DB → overdue reminders
   - Video Projects DB → active projects + deadlines
   - Rotation Schedule DB → current week type
2. Calculate key metrics:
   - Monthly balance (income - expenses)
   - Car savings progress (current / 40,000 NIS)
   - Portfolio performance vs. targets
   - Overdue relationship reminders count
   - Active projects count
3. Generate dashboard HTML (mobile-first, dark theme)
4. Write to `docs/dashboard.html`
5. Return Hebrew summary of key metrics

## Dashboard Sections

### Header
- Current date + week type (Base/Home)
- Quick status: "הכל תקין" / "יש X דברים שדורשים תשומת לב"

### Financial Overview
- Monthly income vs. expenses (bar chart)
- Category breakdown (spending by category)
- Car savings progress bar (current / 40,000)
- IBKR investment status this month

### VR Business
- Monthly VR income
- Events this month vs. last month
- Average per event
- Next scheduled event

### Freelance
- Active projects count
- Outstanding payments total
- Upcoming deadlines

### Investments
- Portfolio value (if available)
- Allocation vs. targets (VOO/QQQ/Growth)
- Rebalance needed? (Yes/No)

### Relationships
- Overdue reminders (people you haven't seen)
- Upcoming birthdays (if tracked)

### Video Projects
- Active projects with status
- Nearest deadline

## Design Specs
- Mobile-first responsive
- Dark theme (matches existing schedule site)
- Hebrew RTL layout
- Color coding: green (good), yellow (warning), red (alert)
- Auto-refresh data on each generation
- Link from main schedule page

## Output Files
- `docs/dashboard.html` — main dashboard page
- Update `docs/index.html` — add link to dashboard

## Data Sources
- **Read**: Budget DB (`collection://295bb07d-d7b9-8176-a6bd-000b6ad23eca`)
- **Read**: VR Events DB (`collection://8d15b9e6-8aed-47fc-97bc-38f1570dea79`)
- **Read**: Freelance Projects DB (`collection://FREELANCE_DB_ID`)
- **Read**: Investments DB (`collection://30c5ed27-8b02-439a-a510-de4601e22a30`)
- **Read**: Relationships DB (`collection://RELATIONSHIPS_DB_ID`)
- **Read**: Video Projects DB (`collection://36f48996-4d93-4080-b805-5b59f8f51e0b`)
- **Read**: Rotation Schedule DB (`collection://ac656f74-60b6-41a3-adc2-49e6656c3845`)
