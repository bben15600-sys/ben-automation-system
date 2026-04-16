export type ChatMode = "general" | "code";

export interface ChatSession {
  id: string;
  name: string;
  mode: ChatMode;
  messages: SessionMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface SessionMessage {
  id: string;
  role: "user" | "assistant";
  content: string | ContentPart[];
  model?: string;
  tier?: string;
}

export type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

const STORAGE_KEY = "oslife-sessions";

export function loadSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch { /* ignore */ }
}

export function createSession(mode: ChatMode): ChatSession {
  return {
    id: crypto.randomUUID(),
    name: mode === "code" ? "תכנון קוד חדש" : "שיחה חדשה",
    mode,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function getTextContent(content: string | ContentPart[]): string {
  if (typeof content === "string") return content;
  return content.filter((p) => p.type === "text").map((p) => (p as { type: "text"; text: string }).text).join("");
}

export function getImages(content: string | ContentPart[]): string[] {
  if (typeof content === "string") return [];
  return content.filter((p) => p.type === "image_url").map((p) => (p as { type: "image_url"; image_url: { url: string } }).image_url.url);
}

export function autoNameSession(session: ChatSession): string {
  const firstUser = session.messages.find((m) => m.role === "user");
  if (!firstUser) return session.name;
  const text = getTextContent(firstUser.content);
  return text.slice(0, 40) + (text.length > 40 ? "..." : "");
}
