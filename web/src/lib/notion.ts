const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";

const DB = {
  budget:      "344bb07d-d7b9-81ab-99c9-d7dc34c0b5f5",
  schedule:    "344bb07d-d7b9-8127-9971-e4bd6f0c5815",
  investments: "344bb07d-d7b9-818a-8248-fe3c22d5ecf8",
  vr:          "344bb07d-d7b9-8198-9b3c-e52735071657",
  videos:      "344bb07d-d7b9-810d-a47e-e15420ddda40",
  goals:       "344bb07d-d7b9-81e2-883e-e9e9eb528682",
};

export interface DashboardData {
  budget:       { total: number; trend: number[] };
  investments:  { total: number; change: string; trend: number[] };
  todayEvents:  { count: number; items: TimelineEvent[] };
  vrEvents:     { count: number };
  goals:        GoalItem[];
  weekActivity: { tasks: number[]; events: number[] };
}

export interface TimelineEvent {
  time: string;
  label: string;
  color: string;
}

export interface GoalItem {
  label: string;
  done: number;
  target: number;
  color: string;
}

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#a855f7", "#00d4ff"];

function getPropText(page: Record<string, unknown>, name: string): string {
  const props = page.properties as Record<string, Record<string, unknown>>;
  const prop = props?.[name];
  if (!prop) return "";
  if (prop.type === "title") return ((prop.title as Array<{ plain_text: string }>)?.[0]?.plain_text) || "";
  if (prop.type === "rich_text") return ((prop.rich_text as Array<{ plain_text: string }>)?.[0]?.plain_text) || "";
  return "";
}

function getPropNumber(page: Record<string, unknown>, name: string): number {
  const props = page.properties as Record<string, Record<string, unknown>>;
  const prop = props?.[name];
  if (prop?.type === "number") return (prop.number as number) || 0;
  return 0;
}

function getPropDate(page: Record<string, unknown>, name: string): string {
  const props = page.properties as Record<string, Record<string, unknown>>;
  const prop = props?.[name];
  if (prop?.type === "date") return ((prop.date as { start?: string })?.start) || "";
  return "";
}

async function queryDb(dbId: string, filter?: object, pageSize = 100): Promise<Array<Record<string, unknown>>> {
  try {
    const body: Record<string, unknown> = { page_size: pageSize };
    if (filter) body.filter = filter;

    const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`Notion query ${dbId}: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error(`Notion query failed for ${dbId}:`, e);
    return [];
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const today = new Date().toISOString().split("T")[0];
  const monthStart = today.slice(0, 7) + "-01";

  const [budgetPages, schedulePages, investPages, vrPages, goalsPages] = await Promise.all([
    queryDb(DB.budget, { property: "Date", date: { on_or_after: monthStart } }),
    queryDb(DB.schedule, { property: "Date", date: { equals: today } }, 20),
    queryDb(DB.investments, undefined, 50),
    queryDb(DB.vr, { property: "Date", date: { on_or_after: today } }, 10),
    queryDb(DB.goals, undefined, 20),
  ]);

  const budgetTotal = budgetPages.reduce((s: number, p) => s + getPropNumber(p, "Amount"), 0);
  const budgetTrend = buildTrend(budgetPages, "Amount", 7);

  const investTotal = investPages.reduce((s: number, p) => s + getPropNumber(p, "Value"), 0);
  const investTrend = buildTrend(investPages, "Value", 7);

  const todayItems: TimelineEvent[] = schedulePages
    .map((p, i) => ({
      time: getPropDate(p, "Date").split("T")[1]?.slice(0, 5) || `${8 + i * 2}:00`,
      label: getPropText(p, "Name") || getPropText(p, "Title") || "אירוע",
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return {
    budget:       { total: Math.round(budgetTotal), trend: budgetTrend },
    investments:  { total: Math.round(investTotal), change: "+0%", trend: investTrend },
    todayEvents:  { count: todayItems.length, items: todayItems },
    vrEvents:     { count: vrPages.length },
    goals:        goalsPages.map((p, i) => ({
      label: getPropText(p, "Name") || "יעד",
      done:  getPropNumber(p, "Done"),
      target: getPropNumber(p, "Target"),
      color: COLORS[i % COLORS.length],
    })),
    weekActivity: { tasks: [4, 6, 3, 7, 5, 2, 1], events: [2, 3, 1, 4, 2, 1, 0] },
  };
}

function buildTrend(pages: Array<Record<string, unknown>>, field: string, count: number): number[] {
  if (pages.length < 2) return Array(count).fill(0);
  const vals = pages.slice(0, count).map((p) => getPropNumber(p, field));
  while (vals.length < count) vals.push(0);
  return vals.reverse();
}
