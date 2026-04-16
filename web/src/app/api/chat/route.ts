import { NextRequest } from "next/server";
import { routeMessage, classifyMessage, type RouteResult, type Tier } from "@/lib/router";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `אתה העוזר האישי של בן. שמך oslife.
אתה עוזר לנהל את החיים — לוז שבועי, תקציב, השקעות, עסקי VR, פרויקטי וידאו, ומערכות יחסים.
ענה תמיד בעברית. היה קצר, ישיר, ושימושי.
אם אתה לא יודע משהו, תגיד בכנות.`;

const FALLBACK_MODELS: Record<Tier, string[]> = {
  free: [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "deepseek/deepseek-v3-0324:free",
  ],
  cheap: [
    "anthropic/claude-3.5-haiku",
    "google/gemini-2.0-flash-001",
  ],
  premium: [
    "anthropic/claude-sonnet-4",
  ],
};

async function tryModel(model: string, apiMessages: Array<{ role: string; content: string | object[] }>) {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://oslife.app",
      "X-Title": "oslife",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...apiMessages],
      stream: true,
    }),
  });
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return Response.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json();
  const messages: Array<{ role: string; content: string | object[] }> = body.messages || [];
  const forceModel: string | undefined = body.model;

  const lastMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastText = typeof lastMsg?.content === "string" ? lastMsg.content : "";
  const hasImage =
    Array.isArray(lastMsg?.content) &&
    (lastMsg.content as Array<{ type: string }>).some((c) => c.type === "image_url");

  let route: RouteResult;
  if (forceModel) {
    route = { model: forceModel, tier: "premium", label: forceModel.split("/").pop() || forceModel };
  } else {
    route = routeMessage(lastText, hasImage);
  }

  // Try primary model, fallback to alternatives on 404
  let response = await tryModel(route.model, messages);

  if (!response.ok && (response.status === 404 || response.status === 400) && !forceModel) {
    const tier = classifyMessage(lastText, hasImage);
    const fallbacks = FALLBACK_MODELS[tier].filter((m) => m !== route.model);
    for (const fallbackModel of fallbacks) {
      response = await tryModel(fallbackModel, messages);
      if (response.ok) {
        route = { model: fallbackModel, tier, label: fallbackModel.split("/").pop()?.replace(":free", "") || fallbackModel };
        break;
      }
    }
  }

  if (!response.ok) {
    const err = await response.text();
    return Response.json(
      { error: `OpenRouter error: ${response.status}`, details: err },
      { status: response.status }
    );
  }

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Model-Label": route.label,
    "X-Model-Tier": route.tier,
    "X-Model-Id": route.model,
  });

  return new Response(response.body, { headers });
}
