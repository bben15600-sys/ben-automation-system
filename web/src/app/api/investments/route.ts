const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";
const DB = "344bb07d-d7b9-810e-ab8d-c95436081d84";

export async function GET() {
  if (!NOTION_TOKEN) return Response.json({ items: [], total: 0 });

  const res = await fetch(`${NOTION_API}/databases/${DB}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ page_size: 50 }),
  });

  if (!res.ok) return Response.json({ items: [], total: 0 });
  const data = await res.json();

  let total = 0;
  const items = (data.results || []).map((p: Record<string, unknown>) => {
    const props = p.properties as Record<string, Record<string, unknown>>;
    const titleArr = props?.Name?.title as Array<{ plain_text: string }> | undefined;
    const value = (props?.Value?.number as number) || 0;
    const change = (props?.Change?.number as number) || 0;
    const typeObj = props?.Type?.select as { name?: string } | undefined;
    total += value;
    return { name: titleArr?.[0]?.plain_text || "", value, change, type: typeObj?.name || "" };
  });

  return Response.json({ items, total: Math.round(total) });
}
