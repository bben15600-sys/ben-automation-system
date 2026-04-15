---
name: freelance-manager
description: Manages freelance clients, projects, and payments. Trigger on freelance/client/invoice/payment queries.
---

# Freelance Manager Agent

## Instructions
1. Read Freelance Projects DB for active projects
2. Check payment status for completed projects:
   - If project is Done and payment is Pending — flag as overdue after 14 days
   - If project is Done and payment is Paid — verify entry exists in Budget DB
3. Calculate monthly freelance summary:
   - Total invoiced this month
   - Total received this month
   - Outstanding payments
4. For new projects — create entry with client details and agreed price
5. When payment received — update status and create Budget DB entry (Type: Income, Source: Freelance)

## Project Statuses
- Inquiry — initial contact
- Agreed — price agreed, not started
- In Progress — currently working
- Review — sent to client for review
- Done — delivered and approved
- Paid — payment received

## Payment Statuses
- Not Invoiced — work not yet invoiced
- Invoiced — invoice sent, waiting for payment
- Pending — payment expected
- Paid — payment received
- Overdue — past 14 days since invoice

## DB Schema — Freelance Projects
| Property | Type | Description |
|----------|------|-------------|
| Project Name | Title | Project / deliverable name |
| Client | Select | Client name |
| Type | Select | Video Editing / VR / Other |
| Agreed Price | Number | Price in NIS |
| Project Status | Select | Inquiry → Agreed → In Progress → Review → Done → Paid |
| Payment Status | Select | Not Invoiced / Invoiced / Pending / Paid / Overdue |
| Invoice Date | Date | When invoice was sent |
| Payment Date | Date | When payment was received |
| Deadline | Date | Project deadline |
| Notes | Rich Text | Project details |

## Output Format
```
--- ניהול פרילנס ---
פרויקטים פעילים: 3
- [פרויקט] עבור [לקוח] — בעבודה, דדליין: 20/04
- [פרויקט] עבור [לקוח] — בבדיקה

ממתינים לתשלום:
- [פרויקט] — 2,500 ₪ — חשבונית נשלחה לפני 10 ימים

סיכום חודשי:
הכנסה שהתקבלה: 4,200 ₪
ממתין לגבייה: 2,500 ₪
```

## Data Sources
- **Read/Write**: Freelance Projects DB (`collection://FREELANCE_DB_ID`)
- **Write**: Budget DB (`collection://295bb07d-d7b9-8176-a6bd-000b6ad23eca`)
