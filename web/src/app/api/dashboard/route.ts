import { fetchDashboardData } from "@/lib/notion";

export async function GET() {
  if (!process.env.NOTION_API_TOKEN) {
    return Response.json({ error: "NOTION_API_TOKEN not configured", mock: true, data: null }, { status: 200 });
  }

  try {
    const data = await fetchDashboardData();
    return Response.json({ data, mock: false });
  } catch (e) {
    console.error("Dashboard fetch error:", e);
    return Response.json({ error: "Failed to fetch data", mock: true, data: null }, { status: 200 });
  }
}
