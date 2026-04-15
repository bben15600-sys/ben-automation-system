---
name: meal-planner
description: Plans weekly meals and generates shopping lists. Trigger on meal/food/recipe/shopping/cooking queries.
---

# Meal Planner Agent

## Instructions
1. Read Rotation Schedule DB — determine week type (Base / Home)
2. If Base week — skip (meals provided on base)
3. If Home week:
   a. Read Recipes DB for available recipes
   b. Check which days are at home (from Weekly Schedule)
   c. Assign meals to home days — lunch and dinner
   d. Prefer variety — avoid repeating meals within the same week
   e. Consider prep time constraints:
      - Work days / busy days → quick meals (< 30 min)
      - Free days → can cook longer recipes
   f. Generate shopping list — aggregate all ingredients, merge duplicates
4. Create Weekly Meal Plan page in Notion
5. Return Hebrew summary with meals + shopping list

## Meal Categories
- Quick (< 30 min): פסטה, סלט, טוסט, ביצים, שקשוקה
- Medium (30-60 min): עוף בתנור, אורז מוקפץ, המבורגר
- Full cook (60+ min): תבשיל, לזניה, קדרה

## Recipe DB Schema — Recipes
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Recipe name (Hebrew) |
| Category | Select | Quick / Medium / Full Cook |
| Prep Time | Number | Minutes to prepare |
| Ingredients | Rich Text | List of ingredients with quantities |
| Instructions | Rich Text | Cooking steps |
| Tags | Multi-select | Meat / Dairy / Vegan / Parve |
| Rating | Number | 1-5 personal rating |
| Last Made | Date | When last cooked (for variety) |

## Meal Plan DB Schema — Meal Plans
| Property | Type | Description |
|----------|------|-------------|
| Week | Title | Week identifier (e.g. "2026-W16") |
| Day | Select | Sunday–Saturday |
| Meal | Select | Lunch / Dinner |
| Recipe | Relation | Link to Recipes DB |
| Notes | Rich Text | Substitutions, guests, etc. |

## Output Format
```
--- תפריט שבועי ---
ראשון:
  צהריים: פסטה ברוטב עגבניות (20 דק')
  ערב: חזה עוף בתנור + אורז (45 דק')

שני:
  צהריים: סלט טונה + לחם (15 דק')
  ערב: שקשוקה + סלט (25 דק')
...

--- רשימת קניות ---
ירקות: עגבניות x6, בצל x3, פלפל x2
חלבון: חזה עוף 500g, ביצים x12, טונה x2
מזווה: פסטה 500g, אורז 1kg, רוטב עגבניות
מקרר: גבינה צהובה, חמאה
```

## Data Sources
- **Read**: Rotation Schedule DB (`collection://ac656f74-60b6-41a3-adc2-49e6656c3845`)
- **Read**: Recipes DB (`collection://RECIPES_DB_ID`)
- **Write**: Meal Plans DB (`collection://MEAL_PLANS_DB_ID`)
