---
name: budget-alerts
description: Monitors budget categories and alerts when approaching limits. Trigger on alert/limit/overspend/budget-check queries.
---

# Smart Budget Alerts Agent

## Instructions
1. Read Budget DB entries for current month
2. Group expenses by category
3. Compare each category total against its monthly limit
4. Generate alerts based on thresholds:
   - 80% spent → Warning (yellow)
   - 100% spent → Over budget (red)
   - Under 50% with 50%+ of month passed → On track / under-spending note
5. Calculate overall monthly spending vs. total budget
6. Check car savings pace — are you on track for 40,000 NIS target?
7. Return Hebrew summary with alerts

## Category Limits (monthly, in NIS — configurable)
| Category | Monthly Limit |
|----------|--------------|
| Food | 1,500 |
| Going Out | 800 |
| Shopping | 600 |
| Transport | 400 |
| Subscriptions | 200 |
| Other | 500 |
| **Total** | **4,000** |

## Savings Targets
- Car fund: 40,000 NIS total target
- Monthly car savings goal: 2,000 NIS
- IBKR monthly investment: check if done

## Alert Logic
```
spent_pct = category_total / category_limit * 100
days_passed_pct = current_day / days_in_month * 100

if spent_pct >= 100:
    alert = "חריגה"
elif spent_pct >= 80:
    alert = "אזהרה — מתקרב לגבול"
elif spent_pct > days_passed_pct + 15:
    alert = "קצב הוצאות גבוה"
else:
    alert = "תקין"
```

## Output Format
```
--- התראות תקציב — אפריל 2026 ---

חריגה:
- אוכל בחוץ: 850/800 ₪ (106%) — עברת את הגבול!

אזהרה:
- אוכל: 1,250/1,500 ₪ (83%) — נשארו 250 ₪ ל-15 יום

תקין:
- קניות: 200/600 ₪ (33%)
- תחבורה: 150/400 ₪ (38%)

סיכום חודשי: 3,200/4,000 ₪ (80%)
חיסכון רכב החודש: 1,500/2,000 ₪ — חסרים עוד 500 ₪
IBKR השקעה חודשית: לא בוצעה
```

## Data Sources
- **Read**: Budget DB (`collection://295bb07d-d7b9-8176-a6bd-000b6ad23eca`)
