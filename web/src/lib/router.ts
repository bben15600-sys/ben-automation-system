/**
 * Smart model router — classifies user messages and picks the optimal model.
 *
 * Tier 1 (Free):    Simple lookups, schedule questions, basic Q&A
 * Tier 2 (Cheap):   Summaries, planning, moderate analysis
 * Tier 3 (Premium): Image analysis, complex reasoning, strategy
 */

export type Tier = "free" | "cheap" | "premium";

export interface RouteResult {
  model: string;
  tier: Tier;
  label: string;       // display name for the UI badge
}

// ── Model pool ─────────────────────────────────────────────────────────────

const MODELS: Record<Tier, RouteResult[]> = {
  free: [
    { model: "deepseek/deepseek-chat-v3-0324:free", tier: "free", label: "DeepSeek V3" },
    { model: "qwen/qwen3-235b-a22b:free",           tier: "free", label: "Qwen 3" },
  ],
  cheap: [
    { model: "anthropic/claude-3.5-haiku",  tier: "cheap", label: "Claude Haiku" },
    { model: "google/gemini-2.5-flash-preview", tier: "cheap", label: "Gemini Flash" },
  ],
  premium: [
    { model: "anthropic/claude-sonnet-4",   tier: "premium", label: "Claude Sonnet" },
  ],
};

// ── Classification rules ────────────────────────────────────────────────────

const SIMPLE_PATTERNS = [
  /^(מה יש|מה קורה|מה התוכנית|מה בלוז)/,
  /^(כמה|מתי|איפה|מי|האם)\b/,
  /^(הצג|תראה|תגיד)\b/,
  /(היום|מחר|השבוע|החודש)$/,
  /^(שלום|היי|בוקר טוב|ערב טוב)/,
];

const PREMIUM_PATTERNS = [
  /תנתח.*(תמונה|צילום|סקרינשוט|screenshot)/,
  /תבנה.*(אסטרטגי|תוכנית|מערכת)/,
  /תכתוב.*(קוד|סקריפט|פונקציה)/,
  /^(נתח|תנתח|analyze)/,
];

export function classifyMessage(text: string, hasImage: boolean): Tier {
  if (hasImage) return "premium";

  const t = text.trim();

  if (PREMIUM_PATTERNS.some((p) => p.test(t))) return "premium";
  if (SIMPLE_PATTERNS.some((p) => p.test(t))) return "free";

  // Default: if short → free, medium → cheap, long → cheap
  if (t.length < 30) return "free";
  return "cheap";
}

export function pickModel(tier: Tier): RouteResult {
  const pool = MODELS[tier];
  // Round-robin would be nice, but for simplicity pick first available
  return pool[0];
}

export function routeMessage(text: string, hasImage: boolean): RouteResult {
  const tier = classifyMessage(text, hasImage);
  return pickModel(tier);
}
