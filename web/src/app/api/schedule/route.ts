const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";
const DB = "344bb07d-d7b9-8147-bc66-faf98025db8d";

export async function GET() {
  if (!NOTION_TOKEN) return Response.json({ items: [] });

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const res = await fetch(`${NOTION_API}/databases/${DB}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({
      filter: { property: "Date", date: { on_or_after: weekStart.toISOString().split("T")[0] } },
      sorts: [{ property: "Date", direction: "ascending" }],
      page_size: 100,
    }),
  });

  if (!res.ok) return Response.json({ items: [] });
  const data = await res.json();

  const items = (data.results || []).map((p: Record<string, unknown>) => {
    const props = p.properties as Record<string, Record<string, unknown>>;
    const titleArr = props?.Name?.title as Array<{ plain_text: string }> | undefined;
    const dateObj = props?.Date?.date as { start?: string } | undefined;
    const catObj = props?.Category?.select as { name?: string } | undefined;
    const doneObj = props?.Done?.checkbox as boolean | undefined;
    return {
      name: titleArr?.[0]?.plain_text || "",
      date: dateObj?.start || "",
      category: catObj?.name || "",
      done: doneObj || false,
    };
  });

  return Response.json({ items });
}
