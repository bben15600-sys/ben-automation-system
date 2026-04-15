# בריף לסשן בנייה — סוכנים חדשים

> מסמך זה מסכם את כל מה שתוכנן ומוכן לפיתוח.
> יש להעביר אותו לסשן Claude Code חדש כדי להתחיל בנייה.

---

## רקע — מה כבר קיים במערכת

### סוכנים פעילים (5)
1. **weekly-scheduler** — בניית לוח שבועי לפי רוטציה (בסיס/בית)
2. **budget-tracker** — מעקב הוצאות והכנסות חודשי, חיסכון לרכב
3. **vr-income-tracker** — מעקב אירועי Enjoy VR, הכנסות, חשבוניות
4. **video-project-manager** — ניהול פרויקטי עריכת וידאו
5. **daily-brief** — סקירת שוק יומית (VOO, QQQ, NVDA, TSLA)

### תשתית
- **Engine**: Claude Code
- **Data Layer**: Notion (6 databases)
- **Automation**: GitHub Actions + Google Cloud Scheduler (כל יום ראשון 20:00)
- **Access**: Telegram bot (שאלון שבועי + קישור ללוח)
- **Site**: GitHub Pages — לוח שבועי + iCal export

### Notion Databases קיימים
| Database | Collection ID |
|---|---|
| Rotation Schedule | `ac656f74-60b6-41a3-adc2-49e6656c3845` |
| Budget | `295bb07d-d7b9-8176-a6bd-000b6ad23eca` |
| VR Events | `8d15b9e6-8aed-47fc-97bc-38f1570dea79` |
| Video Projects | `36f48996-4d93-4080-b805-5b59f8f51e0b` |
| Investments | `30c5ed27-8b02-439a-a510-de4601e22a30` |
| Daily Brief | `bfcfbfe8-e343-43d2-85a6-f12668150157` |

---

## מה צריך לבנות — 6 סוכנים חדשים

כל הסוכנים כבר מוגדרים כ-SKILL.md ב-repo תחת `agents/<name>/SKILL.md`.
צריך: ליצור את ה-Notion DBs, למלא את ה-IDs, ולהפעיל.

---

### 1. מעקב קשרים (Relationship Tracker)
**קובץ:** `agents/relationship-tracker/SKILL.md`
**מטרה:** מעקב מתי בפעם האחרונה ראית אנשים חשובים. תזכורת כשעובר יותר מדי זמן.

**Notion DB חדש נדרש:** Relationships
**שדות:**
- Name (Title) — שם איש הקשר
- Category (Select) — Family / Partner / Friends / Extended
- Last Seen (Date) — תאריך מפגש אחרון
- Threshold Days (Number) — סף ימים לתזכורת
- Notes (Rich Text) — הערות
- Reminder Sent (Checkbox)

**סף ברירת מחדל:**
- ליהי: 3 ימים
- משפחה קרובה: 14 ימים
- סבא וסבתא: 21 ימים
- חברים קרובים: 21 ימים
- חברים רחוקים: 45 ימים

**פלט:** סיכום בעברית — מי דורש תשומת לב, מי בקרוב, מי נפגש לאחרונה.

---

### 2. ניהול פרילנס (Freelance Manager)
**קובץ:** `agents/freelance-manager/SKILL.md`
**מטרה:** מעקב לקוחות, פרויקטים, מחירים, תשלומים. התראה על תשלום שלא התקבל.

**Notion DB חדש נדרש:** Freelance Projects
**שדות:**
- Project Name (Title)
- Client (Select)
- Type (Select) — Video Editing / VR / Other
- Agreed Price (Number) — מחיר ב-₪
- Project Status (Select) — Inquiry → Agreed → In Progress → Review → Done → Paid
- Payment Status (Select) — Not Invoiced / Invoiced / Pending / Paid / Overdue
- Invoice Date (Date)
- Payment Date (Date)
- Deadline (Date)
- Notes (Rich Text)

**לוגיקה:**
- פרויקט Done + תשלום Pending מעל 14 יום → התראה "overdue"
- כשתשלום מתקבל → יצירת רשומה ב-Budget DB (Income, Source: Freelance)
- סיכום חודשי: כמה הופק, כמה התקבל, כמה ממתין

**אינטגרציה:** כותב ל-Budget DB הקיים

---

### 3. תכנון ארוחות (Meal Planner)
**קובץ:** `agents/meal-planner/SKILL.md`
**מטרה:** תפריט שבועי לפי סוג שבוע + רשימת קניות אוטומטית.

**Notion DBs חדשים נדרשים:** Recipes + Meal Plans

**שדות Recipes:**
- Name (Title) — שם מתכון בעברית
- Category (Select) — Quick (<30 דק') / Medium (30-60) / Full Cook (60+)
- Prep Time (Number) — דקות
- Ingredients (Rich Text) — רשימת מרכיבים עם כמויות
- Instructions (Rich Text) — שלבי הכנה
- Tags (Multi-select) — Meat / Dairy / Vegan / Parve
- Rating (Number) — 1-5
- Last Made (Date) — לגיוון

**שדות Meal Plans:**
- Week (Title) — "2026-W16"
- Day (Select) — ראשון–שבת
- Meal (Select) — צהריים / ערב
- Recipe (Relation) — קישור ל-Recipes
- Notes (Rich Text)

**לוגיקה:**
- שבוע בסיס → דילוג (אוכלים בבסיס)
- שבוע בית → בדיקת ימים פנויים, הצמדת ארוחות
- ימים עמוסים → מתכונים מהירים
- ימים חופשיים → מתכונים ארוכים יותר
- רשימת קניות → איחוד מרכיבים מכל המתכונים

**אינטגרציה:** קורא מ-Rotation Schedule DB הקיים

---

### 4. התראות תקציב חכמות (Smart Budget Alerts)
**קובץ:** `agents/budget-alerts/SKILL.md`
**מטרה:** התראה כשמתקרבים או עוברים תקרת תקציב בקטגוריה.

**אין צורך ב-DB חדש** — משתמש ב-Budget DB הקיים.

**תקרות חודשיות (ב-₪):**
| קטגוריה | תקרה |
|----------|-------|
| אוכל | 1,500 |
| אוכל בחוץ | 800 |
| קניות | 600 |
| תחבורה | 400 |
| מנויים | 200 |
| אחר | 500 |
| **סה"כ** | **4,000** |

**לוגיקה:**
- 80%+ → אזהרה
- 100%+ → חריגה
- בדיקת קצב: אם הוצאת 80% ועבר רק 50% מהחודש → קצב גבוה
- בדיקת חיסכון רכב: 2,000 ₪ לחודש ביחס ל-40,000 ₪ יעד
- בדיקת IBKR: האם בוצעה השקעה החודש

**פלט:** סיכום בעברית עם חריגות, אזהרות, ומצב תקין

---

### 5. יצירת חשבוניות אוטומטית (Auto-Invoice Generator)
**קובץ:** `agents/invoice-generator/SKILL.md`
**מטרה:** יצירת חשבוניות לאירועי VR ופרויקטי פרילנס מתוך הנתונים בנושן.

**Notion DB חדש נדרש:** Invoices
**שדות:**
- Invoice Number (Title) — INV-YYYYMM-NNN
- Client (Text)
- Service Type (Select) — VR Event / Video Editing / Other
- Service Date (Date)
- Amount (Number) — לפני מע"מ
- VAT (Number) — 17%
- Total (Number) — אחרי מע"מ
- Status (Select) — Draft / Sent / Paid
- Related Event (Relation) — קישור ל-VR Events או Freelance
- PDF Generated (Checkbox)

**לוגיקה:**
- מספור אוטומטי: INV-202604-001, INV-202604-002...
- בדיקה אם כבר יש חשבונית לאירוע/פרויקט
- חישוב מע"מ 17% אוטומטי
- שמירת טקסט חשבונית בדף נושן

**אינטגרציה:** קורא מ-VR Events DB ו-Freelance Projects DB

---

### 6. דשבורד אישי (Personal Dashboard)
**קובץ:** `agents/personal-dashboard/SKILL.md`
**מטרה:** דף HTML שמציג את כל המטריקות במבט אחד. שדרוג לאתר GitHub Pages הקיים.

**אין צורך ב-DB חדש** — קורא מכל ה-DBs הקיימים.

**סקשנים בדשבורד:**
1. **Header** — תאריך, סוג שבוע, סטטוס כללי
2. **כספים** — הכנסות vs הוצאות, פירוט קטגוריות, פרוגרס בר חיסכון רכב
3. **VR** — הכנסה חודשית, השוואה לחודש קודם, ממוצע לאירוע
4. **פרילנס** — פרויקטים פעילים, תשלומים ממתינים, דדליינים
5. **השקעות** — אלוקציה vs יעדים, צריך איזון מחדש?
6. **קשרים** — תזכורות פתוחות
7. **פרויקטי וידאו** — פרויקטים פעילים, דדליין קרוב

**עיצוב:**
- Mobile-first, dark theme (כמו אתר הלוח הקיים)
- RTL עברית
- צבעים: ירוק (תקין), צהוב (אזהרה), אדום (חריגה)
- קובץ: `docs/dashboard.html`
- קישור מהדף הראשי

---

## Notion DBs חדשים שצריך ליצור

| DB | שדות עיקריים | סוכנים שמשתמשים |
|----|-------------|----------------|
| Relationships | Name, Category, Last Seen, Threshold Days | relationship-tracker |
| Freelance Projects | Project Name, Client, Price, Status, Payment | freelance-manager, invoice-generator |
| Recipes | Name, Category, Prep Time, Ingredients | meal-planner |
| Meal Plans | Week, Day, Meal, Recipe | meal-planner |
| Invoices | Invoice Number, Client, Amount, VAT, Status | invoice-generator |

## סדר בנייה מומלץ
1. **budget-alerts** — הכי פשוט, אין DB חדש, משתמש במה שיש
2. **relationship-tracker** — DB פשוט, לוגיקה פשוטה
3. **freelance-manager** — DB בינוני, אינטגרציה עם Budget
4. **invoice-generator** — תלוי ב-freelance-manager (משתמש באותו DB)
5. **meal-planner** — 2 DBs חדשים, לוגיקה מורכבת יותר
6. **personal-dashboard** — תלוי בכל השאר (קורא מהכל)

---

## קבצים רלוונטיים ב-repo
```
agents/
├── relationship-tracker/SKILL.md   ← חדש
├── freelance-manager/SKILL.md      ← חדש
├── meal-planner/SKILL.md           ← חדש
├── budget-alerts/SKILL.md          ← חדש
├── invoice-generator/SKILL.md      ← חדש
├── personal-dashboard/SKILL.md     ← חדש
├── budget-tracker/SKILL.md         ← קיים
├── vr-income-tracker/SKILL.md      ← קיים
├── video-project-manager/SKILL.md  ← קיים
├── weekly-scheduler/SKILL.md       ← קיים
└── daily-brief/SKILL.md            ← קיים

.claude/CLAUDE.md                   ← מעודכן עם DBs חדשים
docs/brainstorm-ideas.md            ← מסמך רעיונות מלא
docs/build-session-brief.md         ← הקובץ הזה
```
