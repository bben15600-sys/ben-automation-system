export type Tier = "free" | "cheap" | "premium";

export interface RouteResult {
  model: string;
  tier: Tier;
  label: string;
}

const MODELS: Record<Tier, RouteResult[]> = {
  free: [
    { model: "google/gemini-2.0-flash-exp:free", tier: "free", label: "Gemini Flash" },
    { model: "meta-llama/llama-3.3-70b-instruct:free", tier: "free", label: "Llama 3.3" },
    { model: "qwen/qwen-2.5-72b-instruct:free", tier: "free", label: "Qwen 2.5" },
    { model: "deepseek/deepseek-v3-0324:free", tier: "free", label: "DeepSeek V3" },
  ],
  cheap: [
    { model: "anthropic/claude-3.5-haiku", tier: "cheap", label: "Claude Haiku" },
    { model: "google/gemini-2.0-flash-001", tier: "cheap", label: "Gemini Flash" },
  ],
  premium: [
    { model: "anthropic/claude-sonnet-4", tier: "premium", label: "Claude Sonnet" },
  ],
};

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
  if (t.length < 30) return "free";
  return "cheap";
}

export function pickModel(tier: Tier): RouteResult {
  const pool = MODELS[tier];
  return pool[0];
}

export function routeMessage(text: string, hasImage: boolean): RouteResult {
  const tier = classifyMessage(text, hasImage);
  return pickModel(tier);
}
