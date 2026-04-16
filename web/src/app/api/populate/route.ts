const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";
const HEADERS = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

const DB = {
  budget:    "344bb07d-d7b9-814d-8340-ec900e1a5637",
  schedule:  "344bb07d-d7b9-8147-bc66-faf98025db8d",
  investments: "344bb07d-d7b9-810e-ab8d-c95436081d84",
  vr:        "344bb07d-d7b9-810c-b59d-cfb0b15b0780",
  videos:    "344bb07d-d7b9-8157-8804-d4288b598a2e",
  goals:     "344bb07d-d7b9-81c4-8c96-f8e9ec774c74",
};

async function createPage(dbId: string, properties: Record<string, unknown>) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create page failed: ${res.status} ${err}`);
  }
  return res.json();
}

function title(text: string) {
  return { title: [{ text: { content: text } }] };
}
function num(n: number) {
  return { number: n };
}
function date(d: string) {
  return { date: { start: d } };
}
function sel(name: string) {
  return { select: { name } };
}
function richText(text: string) {
  return { rich_text: [{ text: { content: text } }] };
}

export async function POST() {
  if (!NOTION_TOKEN) {
    return Response.json({ error: "NOTION_API_TOKEN not set" }, { status: 500 });
  }

  try {
    const results: Record<string, number> = {};

    // === SCHEDULE (today + rest of week from calendar.ics) ===
    const scheduleItems = [
      // Today Apr 16 (Thu)
      { name: "☀️ קימה + ארוחת בוקר", date: "2026-04-16T07:00:00", cat: "אישי" },
      { name: "🥽 אירוע VR — Enjoy VR", date: "2026-04-16T08:00:00", cat: "עבודה" },
      { name: "🍽 ארוחת צהריים", date: "2026-04-16T12:30:00", cat: "אישי" },
      { name: "🌙 זמן חופשי", date: "2026-04-16T18:00:00", cat: "אישי" },
      // Apr 17 (Fri)
      { name: "☀️ קימה + ארוחת בוקר", date: "2026-04-17T10:00:00", cat: "אישי" },
      { name: "🎬 קורס צפייה", date: "2026-04-17T11:00:00", cat: "למידה" },
      { name: "💻 עבודה על מערכת", date: "2026-04-17T13:30:00", cat: "עבודה" },
      { name: "🎬 תרגול קורס", date: "2026-04-17T14:00:00", cat: "למידה" },
      { name: "💛 ליהי", date: "2026-04-17T19:00:00", cat: "חברתי" },
      // Apr 18 (Sat)
      { name: "🍽 ארוחת צהריים", date: "2026-04-18T12:30:00", cat: "אישי" },
      { name: "🎾 טניס", date: "2026-04-18T17:00:00", cat: "בריאות" },
      { name: "🏀 כדורסל", date: "2026-04-18T19:30:00", cat: "בריאות" },
      { name: "👨‍👦 מפגש אבא", date: "2026-04-18T23:00:00", cat: "חברתי" },
      // Apr 19 (Sun)
      { name: "☀️ קימה + ארוחת בוקר", date: "2026-04-19T10:00:00", cat: "אישי" },
      { name: "🎬 קורס צפייה", date: "2026-04-19T11:00:00", cat: "למידה" },
      { name: "👵 ביקור סבא וסבתא", date: "2026-04-19T11:00:00", cat: "חברתי" },
      { name: "💻 עבודה על מערכת", date: "2026-04-19T13:30:00", cat: "עבודה" },
      { name: "🎬 תרגול קורס", date: "2026-04-19T14:00:00", cat: "למידה" },
      { name: "💛 ליהי", date: "2026-04-19T19:00:00", cat: "חברתי" },
      // Apr 20 (Mon - base)
      { name: "✈️ כניסה לבסיס", date: "2026-04-20T11:00:00", cat: "עבודה" },
    ];

    for (const item of scheduleItems) {
      await createPage(DB.schedule, {
        Name: title(item.name),
        Date: date(item.date),
        Category: sel(item.cat),
      });
    }
    results.schedule = scheduleItems.length;

    // === GOALS (weekly targets from the plan) ===
    const goalItems = [
      { name: "כדורסל", done: 2, target: 3 },
      { name: "זמן עם ליהי", done: 1, target: 3 },
      { name: "קורס צפייה", done: 2, target: 4 },
      { name: "תרגול קורס", done: 2, target: 4 },
      { name: "טניס", done: 1, target: 2 },
      { name: "עבודה על מערכת", done: 2, target: 4 },
    ];

    for (const g of goalItems) {
      await createPage(DB.goals, {
        Name: title(g.name),
        Done: num(g.done),
        Target: num(g.target),
      });
    }
    results.goals = goalItems.length;

    // === VR EVENTS ===
    await createPage(DB.vr, {
      Name: title("אירוע VR — Enjoy VR"),
      Date: date("2026-04-16T08:00:00"),
      Location: richText("Enjoy VR"),
      Status: sel("מתוכנן"),
    });
    results.vr = 1;

    // === BUDGET (sample expenses this month) ===
    const budgetItems = [
      { name: "סופר", amount: 350, cat: "אוכל", date: "2026-04-01" },
      { name: "דלק", amount: 280, cat: "תחבורה", date: "2026-04-03" },
      { name: "חשמל", amount: 420, cat: "חשבונות", date: "2026-04-05" },
      { name: "מסעדה עם ליהי", amount: 180, cat: "בילויים", date: "2026-04-07" },
      { name: "סופר", amount: 290, cat: "אוכל", date: "2026-04-09" },
      { name: "אינטרנט + סלולרי", amount: 150, cat: "חשבונות", date: "2026-04-10" },
      { name: "ביגוד", amount: 250, cat: "קניות", date: "2026-04-12" },
      { name: "סופר", amount: 310, cat: "אוכל", date: "2026-04-14" },
      { name: "דלק", amount: 260, cat: "תחבורה", date: "2026-04-16" },
    ];

    for (const b of budgetItems) {
      await createPage(DB.budget, {
        Name: title(b.name),
        Amount: num(b.amount),
        Category: sel(b.cat),
        Date: date(b.date),
      });
    }
    results.budget = budgetItems.length;

    // === INVESTMENTS ===
    const investItems = [
      { name: "תיק מניות — IBI", value: 32000, type: "מניות" },
      { name: "קריפטו — BTC+ETH", value: 8500, type: "קריפטו" },
      { name: "חיסכון פנסיוני", value: 11800, type: "חיסכון" },
    ];

    for (const inv of investItems) {
      await createPage(DB.investments, {
        Name: title(inv.name),
        Value: num(inv.value),
        Type: sel(inv.type),
        Date: date("2026-04-16"),
      });
    }
    results.investments = investItems.length;

    // === VIDEOS ===
    const videoItems = [
      { name: "סרטון VR — חוויה ראשונה", status: "עריכה", platform: "YouTube" },
      { name: "טיק טוק — טיפים לתקציב", status: "רעיון", platform: "TikTok" },
    ];

    for (const v of videoItems) {
      await createPage(DB.videos, {
        Name: title(v.name),
        Status: sel(v.status),
        Platform: sel(v.platform),
      });
    }
    results.videos = videoItems.length;

    return Response.json({ success: true, created: results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
