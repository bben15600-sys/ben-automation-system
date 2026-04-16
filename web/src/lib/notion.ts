const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";

const DB = {
  budget:      "295bb07d-d7b9-8176-a6bd-000b6ad23eca",
  schedule:    "ac656f74-60b6-41a3-adc2-49e6656c3845",
  investments: "30c5ed27-8b02-439a-a510-de4601e22a30",
  vr:          "8d15b9e6-8aed-47fc-97bc-38f1570dea79",
  videos:      "36f48996-4d93-4080-b805-5b59f8f51e0b",
  daily:       "bfcfbfe8-e343-43d2-85a6-f12668150157",
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

  const [budgetPages, schedulePages, investPages, vrPages] = await Promise.all([
    queryDb(DB.budget, { property: "Date", date: { on_or_after: monthStart } }),
    queryDb(DB.schedule, { property: "Date", date: { equals: today } }, 20),
    queryDb(DB.investments, undefined, 50),
    queryDb(DB.vr, { property: "Date", date: { on_or_after: today } }, 10),
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
    goals:        [],
    weekActivity: { tasks: [4, 6, 3, 7, 5, 2, 1], events: [2, 3, 1, 4, 2, 1, 0] },
  };
}

function buildTrend(pages: Array<Record<string, unknown>>, field: string, count: number): number[] {
  if (pages.length < 2) return Array(count).fill(0);
  const vals = pages.slice(0, count).map((p) => getPropNumber(p, field));
  while (vals.length < count) vals.push(0);
  return vals.reverse();
}
