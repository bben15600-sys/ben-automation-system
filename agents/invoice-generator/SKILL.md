---
name: invoice-generator
description: Generates invoices for VR events and freelance projects. Trigger on invoice/receipt/bill/חשבונית queries.
---

# Auto-Invoice Generator Agent

## Instructions
1. Identify source — VR event or freelance project
2. Read relevant DB for event/project details
3. Check if invoice already exists (Invoice Generated checkbox)
4. Gather invoice details:
   - Client / event name
   - Date of service
   - Description of service
   - Amount (NIS)
   - Invoice number (auto-increment)
5. Generate invoice content in structured format
6. Save invoice text to Notion page (attached to the event/project)
7. Mark "Invoice Generated" checkbox
8. Return Hebrew confirmation with invoice summary

## Invoice Numbering
- Format: `INV-YYYYMM-NNN` (e.g. INV-202604-001)
- Auto-increment per month, read last invoice number from Invoices DB

## Invoice Template
```
--- חשבונית מס' [INV-YYYYMM-NNN] ---

מאת: בן [שם מלא]
ת.ז: [מספר]
תאריך: [DD/MM/YYYY]

עבור: [שם לקוח / אירוע]
תיאור: [סוג שירות]
תאריך שירות: [DD/MM/YYYY]

סכום: [X,XXX] ₪
מע"מ (17%): [XXX] ₪
סה"כ לתשלום: [X,XXX] ₪

פרטי תשלום:
בנק: [שם בנק]
סניף: [מספר]
חשבון: [מספר]
```

## Invoice DB Schema — Invoices
| Property | Type | Description |
|----------|------|-------------|
| Invoice Number | Title | INV-YYYYMM-NNN format |
| Client | Text | Client / event name |
| Service Type | Select | VR Event / Video Editing / Other |
| Service Date | Date | When service was provided |
| Amount | Number | Amount before VAT (NIS) |
| VAT | Number | 17% VAT amount |
| Total | Number | Amount + VAT |
| Status | Select | Draft / Sent / Paid |
| Related Event | Relation | Link to VR Events or Freelance DB |
| PDF Generated | Checkbox | Whether PDF was created |

## Data Sources
- **Read**: VR Events DB (`collection://8d15b9e6-8aed-47fc-97bc-38f1570dea79`)
- **Read**: Freelance Projects DB (`collection://FREELANCE_DB_ID`)
- **Read/Write**: Invoices DB (`collection://INVOICES_DB_ID`)
