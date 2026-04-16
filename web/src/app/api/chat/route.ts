import { NextRequest } from "next/server";
import { routeMessage, type RouteResult } from "@/lib/router";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `אתה העוזר האישי של בן. שמך oslife.
אתה עוזר לנהל את החיים — לוז שבועי, תקציב, השקעות, עסקי VR, פרויקטי וידאו, ומערכות יחסים.
ענה תמיד בעברית. היה קצר, ישיר, ושימושי.
אם אתה לא יודע משהו, תגיד בכנות.`;

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return Response.json(
      { error: "OPENROUTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const messages: Array<{ role: string; content: string | object[] }> = body.messages || [];
  const forceModel: string | undefined = body.model;

  // Get last user message for routing
  const lastMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastText = typeof lastMsg?.content === "string" ? lastMsg.content : "";
  const hasImage =
    Array.isArray(lastMsg?.content) &&
    (lastMsg.content as Array<{ type: string }>).some((c) => c.type === "image_url");

  // Route to optimal model (or use forced model)
  let route: RouteResult;
  if (forceModel) {
    route = { model: forceModel, tier: "premium", label: forceModel.split("/").pop() || forceModel };
  } else {
    route = routeMessage(lastText, hasImage);
  }

  // Build request
  const payload = {
    model: route.model,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
  };

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://oslife.app",
      "X-Title": "oslife",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json(
      { error: `OpenRouter error: ${response.status}`, details: err },
      { status: response.status }
    );
  }

  // Stream the response back with model info in a custom header
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Model-Label": route.label,
    "X-Model-Tier": route.tier,
    "X-Model-Id": route.model,
  });

  // Pipe the OpenRouter stream directly to the client
  return new Response(response.body, { headers });
}
