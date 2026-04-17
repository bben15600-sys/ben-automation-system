const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";

export async function GET() {
  if (!NOTION_TOKEN) return Response.json({ error: "No token" });

  // Search for all databases
  const res = await fetch(`${NOTION_API}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ filter: { property: "object", value: "database" }, page_size: 50 }),
  });

  if (!res.ok) return Response.json({ error: `Search failed: ${res.status}` });
  const data = await res.json();

  const dbs = (data.results || []).map((db: Record<string, unknown>) => {
    const titleArr = (db.title as Array<{ plain_text: string }>) || [];
    const title = titleArr.map(t => t.plain_text).join("") || "untitled";
    const props = db.properties as Record<string, { type: string }> | undefined;
    const fields = props ? Object.entries(props).map(([name, val]) => ({ name, type: val.type })) : [];
    return { id: db.id, title, fields };
  });

  return Response.json({ databases: dbs });
}
