const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";
const DB = "344bb07d-d7b9-814d-8340-ec900e1a5637";

export async function GET() {
  if (!NOTION_TOKEN) return Response.json({ items: [], total: 0 });

  const monthStart = new Date().toISOString().slice(0, 7) + "-01";

  const res = await fetch(`${NOTION_API}/databases/${DB}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({
      filter: { property: "Date", date: { on_or_after: monthStart } },
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 100,
    }),
  });

  if (!res.ok) return Response.json({ items: [], total: 0 });
  const data = await res.json();

  let total = 0;
  const byCategory: Record<string, number> = {};
  const items = (data.results || []).map((p: Record<string, unknown>) => {
    const props = p.properties as Record<string, Record<string, unknown>>;
    const titleArr = props?.Name?.title as Array<{ plain_text: string }> | undefined;
    const amount = (props?.Amount?.number as number) || 0;
    const catObj = props?.Category?.select as { name?: string } | undefined;
    const dateObj = props?.Date?.date as { start?: string } | undefined;
    const cat = catObj?.name || "אחר";
    total += amount;
    byCategory[cat] = (byCategory[cat] || 0) + amount;
    return { name: titleArr?.[0]?.plain_text || "", amount, category: cat, date: dateObj?.start || "" };
  });

  return Response.json({ items, total: Math.round(total), byCategory });
}
