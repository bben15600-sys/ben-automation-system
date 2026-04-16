# ASLife.app — Build Brief

> מסמך זה מסכם את כל ההחלטות שנתקבלו. גיבוי להקשר.

---

## הדומיין
- **`oslife.app`** — נקנה ב-Namecheap, $7.18/שנה
- OS Life = Operating System for Life

---

## טכנולוגיות

| רכיב | טכנולוגיה | חבילה |
|---|---|---|
| Frontend | Next.js 16 + Tailwind CSS | `next`, `tailwindcss` |
| Hosting | Vercel (Hobby, חינם) | — |
| Domain | Namecheap → Vercel DNS | — |
| Data | Notion API | `@notionhq/client` |
| AI Chatbot | OpenRouter (400+ models) | `openai` (compatible) |
| Charts | Chart.js | `chart.js`, `react-chartjs-2` |
| Voice Input | Web Speech API | built-in |
| Voice Output | SpeechSynthesis API | built-in |
| PWA | next-pwa | `@ducanh2912/next-pwa` |

### Install command
```bash
npm install @notionhq/client chart.js react-chartjs-2 openai @ducanh2912/next-pwa
```

### Environment Variables (.env.local)
```
NOTION_API_TOKEN=secret_xxx
OPENROUTER_API_KEY=sk-or-xxx
ROTATION_DB_ID=ac656f74-60b6-41a3-adc2-49e6656c3845
BUDGET_DB_ID=295bb07d-d7b9-8176-a6bd-000b6ad23eca
VR_DB_ID=8d15b9e6-8aed-47fc-97bc-38f1570dea79
VIDEO_DB_ID=36f48996-4d93-4080-b805-5b59f8f51e0b
INVESTMENTS_DB_ID=30c5ed27-8b02-439a-a510-de4601e22a30
DAILY_BRIEF_DB_ID=bfcfbfe8-e343-43d2-85a6-f12668150157
```

---

## עלות חודשית
- Vercel: $0
- OpenRouter (free models): $0
- Notion API: $0
- Domain: ~$0.60/חודש ($7.18/שנה)
- **סה"כ: ~3 ₪/חודש**

---

## Chatbot Architecture — Smart Router

```
User message
    ↓
Router (rules + Haiku classifier)
    ↓
Tier 1 (Free)         Tier 2 (Cheap)        Tier 3 (Premium)
DeepSeek V3           Claude Haiku           Claude Sonnet
Llama 4 Scout         GPT-4.1 mini           GPT-4.1
Qwen 3 235B           Gemini Flash           
$0                    $0.25-0.40/1M          $3-5/1M

"מה יש מחר?"         "תסכם את השבוע"       "תנתח תמונה"
"כמה הוצאתי?"        "תתכנן לי יום"         "תבנה אסטרטגיה"
```

80%+ requests → free. Rest → pennies.

---

## Pages

| Page | Route | Data Source |
|---|---|---|
| Dashboard + Morning Brief | `/` | All DBs |
| Weekly Schedule | `/schedule` | Rotation Schedule |
| Budget | `/budget` | Budget DB |
| Investments | `/investments` | Investments DB, Daily Brief DB |
| VR Income | `/vr` | VR Events DB |
| Video Projects | `/videos` | Video Projects DB |
| Freelance | `/freelance` | Freelance DB (new) |
| Relationships | `/relationships` | Relationships DB (new) |
| Meals | `/meals` | Recipes + Meal Plans DBs (new) |
| Chat | `/chat` | OpenRouter + all DBs as context |

---

## Key Features

### Dashboard
- Morning brief — today's schedule, budget status, stock changes, reminders
- Life Balance Radar — spider chart (6 axes)
- Quick Actions — one-tap shortcuts
- Weekly comparison cards (this week vs last)

### Chatbot
- Multi-model with auto-routing (OpenRouter)
- Model badge on each response
- Manual model override dropdown
- Voice input (Web Speech API, he-IL)
- Image upload + analysis (Llama Vision / Claude)
- Quick reply chips
- Typing indicator animation
- Conversation memory (localStorage)
- Glassmorphism dark UI

### Gamification
- Life area leveling system (VR Business Lv12, Budget Master Lv8...)
- Weekly Boss Battle challenge
- Grace days (1 miss doesn't break streak)
- Streak tracking

### Notifications (3 tiers)
- Urgent → push (VR in 1 hour, birthday tomorrow)
- Important → morning brief (budget summary, deadline approaching)
- Info → dashboard only (weekly stats)

### Design
- Dark mode (glassmorphism)
- RTL Hebrew
- Mobile-first
- PWA (installable)
- Smooth animations (View Transitions API)
- App-like feel

---

## Build Order

1. Layout + Sidebar + Dark theme + RTL
2. Chatbot (OpenRouter + multi-model + voice)
3. Notion connection + Dashboard + Morning Brief
4. Content pages (schedule, budget, investments...)
5. PWA + Domain connection + Vercel deploy
6. Gamification + smart notifications

---

## Files already created
- `web/src/app/layout.tsx` — root layout (RTL, Hebrew, Heebo font)
- `web/src/app/globals.css` — dark theme CSS variables
- `web/src/components/Sidebar.tsx` — navigation (desktop + mobile)

## Existing agents (Python + Notion)
- weekly-scheduler, budget-tracker, vr-income-tracker
- video-project-manager, daily-brief

## New agents planned (SKILL.md ready)
- budget-alerts, relationship-tracker, freelance-manager
- invoice-generator, meal-planner, personal-dashboard
