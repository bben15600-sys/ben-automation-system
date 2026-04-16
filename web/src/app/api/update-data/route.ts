const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";
const HEADERS = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

const DB = {
  investments: "344bb07d-d7b9-810e-ab8d-c95436081d84",
  budget:      "344bb07d-d7b9-814d-8340-ec900e1a5637",
};

async function clearDb(dbId: string) {
  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: "POST", headers: HEADERS, body: JSON.stringify({ page_size: 100 }),
  });
  if (!res.ok) return 0;
  const data = await res.json();
  let count = 0;
  for (const page of data.results) {
    await fetch(`${NOTION_API}/pages/${page.id}`, {
      method: "PATCH", headers: HEADERS,
      body: JSON.stringify({ archived: true }),
    });
    count++;
  }
  return count;
}

async function createPage(dbId: string, properties: Record<string, unknown>) {
  await fetch(`${NOTION_API}/pages`, {
    method: "POST", headers: HEADERS,
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
}

function title(t: string) { return { title: [{ text: { content: t } }] }; }
function num(n: number) { return { number: n }; }
function date(d: string) { return { date: { start: d } }; }
function sel(n: string) { return { select: { name: n } }; }

export async function POST(req: Request) {
  if (!NOTION_TOKEN) return Response.json({ error: "No token" }, { status: 500 });

  const body = await req.json();
  const action = body.action;

  if (action === "investments") {
    const cleared = await clearDb(DB.investments);

    // $8,500 total: 60% S&P 500, 30% NVDA, 10% cash
    const rate = 3.65; // USD to ILS approximate
    await createPage(DB.investments, {
      Name: title("S&P 500 (VOO/SPY)"),
      Value: num(Math.round(5100 * rate)),
      Change: num(0),
      Type: sel("מניות"),
      Date: date("2026-04-16"),
    });
    await createPage(DB.investments, {
      Name: title("NVIDIA (NVDA)"),
      Value: num(Math.round(2550 * rate)),
      Change: num(0),
      Type: sel("מניות"),
      Date: date("2026-04-16"),
    });
    await createPage(DB.investments, {
      Name: title("מזומן בתיק"),
      Value: num(Math.round(850 * rate)),
      Change: num(0),
      Type: sel("חיסכון"),
      Date: date("2026-04-16"),
    });

    return Response.json({
      success: true,
      cleared,
      created: 3,
      total_ils: Math.round(8500 * rate),
      breakdown: { "S&P 500 (60%)": `$5,100`, "NVDA (30%)": `$2,550`, "מזומן (10%)": `$850` },
    });
  }

  if (action === "clear-fake-budget") {
    const cleared = await clearDb(DB.budget);
    return Response.json({ success: true, cleared });
  }

  return Response.json({ error: "Unknown action. Use 'investments' or 'clear-fake-budget'" }, { status: 400 });
}
