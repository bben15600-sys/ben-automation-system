---
name: budget-tracker
description: Tracks budget and savings progress. Trigger on budget/expense/savings queries.
---

# Budget Tracker Agent

## Instructions
1. Read all Budget DB entries for current month
2. Calculate: total income, total expenses by category
3. Calculate car savings progress toward 40,000 NIS target
4. Check if IBKR investment was made this month
5. Update Monthly Summary page in Notion

## Categories
- Food, Going Out, Shopping, Investment, Car Savings, Other

## Income Sources
- Army, VR (Enjoy VR), Freelance, Other

## Data Sources
- **Read**: Budget DB (`collection://295bb07d-d7b9-8176-a6bd-000b6ad23eca`)
- **Read**: VR Events DB (`collection://8d15b9e6-8aed-47fc-97bc-38f1570dea79`)
