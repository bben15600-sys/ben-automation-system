const NOTION_TOKEN = process.env.NOTION_API_TOKEN || "";
const NOTION_API = "https://api.notion.com/v1";

const HEADERS = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

async function searchPages(): Promise<Array<{ id: string; title: string }>> {
  const res = await fetch(`${NOTION_API}/search`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ filter: { property: "object", value: "page" }, page_size: 20 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((p: Record<string, unknown>) => {
    const props = p.properties as Record<string, Record<string, unknown>> | undefined;
    const titleProp = props?.title || props?.Name;
    const titleArr = titleProp?.title as Array<{ plain_text: string }> | undefined;
    const title = titleArr?.[0]?.plain_text || "ללא שם";
    return { id: p.id as string, title };
  });
}

async function createDatabase(parentId: string, title: string, emoji: string, properties: Record<string, object>) {
  const res = await fetch(`${NOTION_API}/databases`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentId },
      title: [{ text: { content: title } }],
      icon: { type: "emoji", emoji },
      properties,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create "${title}": ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.id;
}

export async function GET() {
  if (!NOTION_TOKEN) {
    return Response.json({ error: "NOTION_API_TOKEN not set" }, { status: 500 });
  }
  const pages = await searchPages();
  return Response.json({ pages });
}

async function createSubPage(parentId: string, title: string) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentId },
      properties: { title: [{ text: { content: title } }] },
      icon: { type: "emoji", emoji: "🟣" },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create sub-page: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.id;
}

export async function POST(req: Request) {
  if (!NOTION_TOKEN) {
    return Response.json({ error: "NOTION_API_TOKEN not set" }, { status: 500 });
  }

  const body = await req.json();
  let parentId: string = body.parentId;

  if (!parentId) {
    const pages = await searchPages();
    if (pages.length === 0) {
      return Response.json({ error: "No accessible pages in Notion. Connect oslife to a page first." }, { status: 400 });
    }
    parentId = pages[0].id;
  }

  try {
    const oslifePage = await createSubPage(parentId, "oslife Dashboard");
    parentId = oslifePage;
    const [budget, schedule, investments, vr, videos, goals] = await Promise.all([
      createDatabase(parentId, "תקציב", "💰", {
        Name:     { title: {} },
        Amount:   { number: { format: "number" } },
        Category: { select: { options: [
          { name: "אוכל", color: "green" },
          { name: "תחבורה", color: "blue" },
          { name: "בילויים", color: "pink" },
          { name: "חשבונות", color: "orange" },
          { name: "קניות", color: "purple" },
          { name: "אחר", color: "gray" },
        ] } },
        Date: { date: {} },
      }),

      createDatabase(parentId, "לוז יומי", "📅", {
        Name:     { title: {} },
        Date:     { date: {} },
        Category: { select: { options: [
          { name: "עבודה", color: "blue" },
          { name: "אישי", color: "green" },
          { name: "בריאות", color: "red" },
          { name: "חברתי", color: "pink" },
          { name: "למידה", color: "purple" },
        ] } },
        Done: { checkbox: {} },
      }),

      createDatabase(parentId, "השקעות", "📈", {
        Name:   { title: {} },
        Value:  { number: { format: "number" } },
        Change: { number: { format: "percent" } },
        Type:   { select: { options: [
          { name: "מניות", color: "blue" },
          { name: "קריפטו", color: "orange" },
          { name: "חיסכון", color: "green" },
          { name: "אחר", color: "gray" },
        ] } },
        Date: { date: {} },
      }),

      createDatabase(parentId, "אירועי VR", "🥽", {
        Name:     { title: {} },
        Date:     { date: {} },
        Location: { rich_text: {} },
        Status:   { select: { options: [
          { name: "מתוכנן", color: "blue" },
          { name: "הושלם", color: "green" },
          { name: "בוטל", color: "red" },
        ] } },
      }),

      createDatabase(parentId, "פרויקטי וידאו", "🎬", {
        Name:     { title: {} },
        Status:   { select: { options: [
          { name: "רעיון", color: "gray" },
          { name: "צילום", color: "blue" },
          { name: "עריכה", color: "orange" },
          { name: "הושלם", color: "green" },
        ] } },
        Deadline: { date: {} },
        Platform: { select: { options: [
          { name: "YouTube", color: "red" },
          { name: "TikTok", color: "pink" },
          { name: "Instagram", color: "purple" },
        ] } },
      }),

      createDatabase(parentId, "יעדים שבועיים", "🎯", {
        Name:   { title: {} },
        Done:   { number: { format: "number" } },
        Target: { number: { format: "number" } },
        Color:  { select: { options: [
          { name: "כחול", color: "blue" },
          { name: "ורוד", color: "pink" },
          { name: "כתום", color: "orange" },
          { name: "ירוק", color: "green" },
          { name: "סגול", color: "purple" },
        ] } },
      }),
    ]);

    return Response.json({
      success: true,
      databases: { budget, schedule, investments, vr, videos, goals },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
