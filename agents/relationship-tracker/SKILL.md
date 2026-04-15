---
name: relationship-tracker
description: Tracks when you last saw important people and reminds you. Trigger on people/family/friends/relationship queries.
---

# Relationship Tracker Agent

## Instructions
1. Read Relationships DB for all contacts
2. For each contact — calculate days since last meeting
3. Compare to contact's reminder threshold (default: 14 days)
4. If overdue — flag for reminder
5. Generate Hebrew summary grouped by urgency:
   - Overdue (past threshold)
   - Coming up (within 3 days of threshold)
   - Recent (met recently)
6. When user logs a meeting — update "Last Seen" date

## Contact Categories
- Family: אבא, סבא וסבתא, אחים
- Partner: ליהי
- Friends: חברים קרובים
- Extended: חברים רחוקים, קולגות

## Reminder Thresholds (defaults, configurable per contact)
- Partner: 3 days
- Family (close): 14 days
- Grandparents: 21 days
- Close friends: 21 days
- Extended: 45 days

## DB Schema — Relationships
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Contact name |
| Category | Select | Family / Partner / Friends / Extended |
| Last Seen | Date | Date of last meeting |
| Threshold Days | Number | Days before reminder (default per category) |
| Notes | Rich Text | Optional notes about last meeting |
| Reminder Sent | Checkbox | Whether reminder was already sent this cycle |

## Output Format
```
--- מעקב קשרים ---
דורש תשומת לב:
- סבא וסבתא — 24 ימים (סף: 21) 
- [שם חבר] — 30 ימים (סף: 21)

בקרוב:
- אבא — 12 ימים (סף: 14)

נפגשת לאחרונה:
- ליהי — אתמול
```

## Data Sources
- **Read/Write**: Relationships DB (`collection://RELATIONSHIPS_DB_ID`)
