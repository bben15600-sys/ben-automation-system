"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import HoloLogo from "@/components/HoloLogo";

interface SpeechRecognitionAlternative { transcript: string }
interface SpeechRecognitionResult { 0: SpeechRecognitionAlternative }
interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult }
interface SpeechRecognitionEvent { results: SpeechRecognitionResultList }
interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
}

type Msg = { role: "user" | "ai"; text: string; model?: string };
type Session = {
  id: string;
  title: string;
  mode: "general" | "code";
  messages: Msg[];
  createdAt: number;
};

const MODELS = [
  { id: "auto",     label: "אוטומטי",         tier: "ניתוב חכם" },
  { id: "free",     label: "Auto Free",        tier: "חינם" },
  { id: "haiku",    label: "Claude Haiku",     tier: "זול · עברית" },
  { id: "gemini",   label: "Gemini Flash",     tier: "זול · מהיר" },
  { id: "sonnet",   label: "Claude Sonnet",    tier: "פרימיום" },
];

const QUICK_GENERAL = ["מה יש לי היום?", "מצב תקציב", "תסכם את השבוע", "מה עשיתי בחודש האחרון?"];
const QUICK_CODE    = ["תעזור לי עם bug ב-Next.js", "תכתוב קומפוננטה של טבלה", "תסביר את ההבדל בין useMemo ל-useCallback"];

const STORAGE_KEY = "oslife.chat.sessions.v1";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function initialSession(mode: "general" | "code" = "general"): Session {
  return {
    id: newId(),
    title: mode === "code" ? "שיחת קוד חדשה" : "שיחה חדשה",
    mode,
    messages: [],
    createdAt: Date.now(),
  };
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [model, setModel] = useState("auto");
  const [modelOpen, setModelOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load/persist sessions in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveId(parsed[0].id);
          return;
        }
      }
    } catch {}
    const first = initialSession();
    setSessions([first]);
    setActiveId(first.id);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch {}
    }
  }, [sessions]);

  const active = useMemo(() => sessions.find((s) => s.id === activeId), [sessions, activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, typing]);

  const updateActive = (fn: (s: Session) => Session) => {
    setSessions((arr) => arr.map((s) => (s.id === activeId ? fn(s) : s)));
  };

  const makeTitle = (firstMsg: string) => {
    const clean = firstMsg.trim().slice(0, 40);
    return clean || "שיחה חדשה";
  };

  const send = (textOverride?: string) => {
    const q = (textOverride ?? input).trim();
    if (!q || !active) return;

    const userMsg: Msg = { role: "user", text: q };
    const isFirst = active.messages.length === 0;

    updateActive((s) => ({
      ...s,
      title: isFirst ? makeTitle(q) : s.title,
      messages: [...s.messages, userMsg],
    }));
    setInput("");
    setTyping(true);

    // Streaming simulation
    const fullReply =
      active.mode === "code"
        ? `הנה פתרון ראשוני:\n\n\`\`\`tsx\nconst fix = () => {\n  // mock implementation\n  return 'ready';\n};\n\`\`\`\n\n**שים לב:** כשהחיבור יהיה חי, זה יגיע דרך OpenRouter (מודל: ${MODELS.find((m) => m.id === model)?.label}).`
        : `קיבלתי את השאלה "${q}".\n\n- זה mock. ברגע שנחבר את OpenRouter ונטען את הנתונים מ-Notion, התשובה תהיה אמיתית.\n- מודל נבחר: **${MODELS.find((m) => m.id === model)?.label}**.`;

    let streamed = "";
    const words = fullReply.split(/(\s+)/);
    let wordIdx = 0;
    const interval = window.setInterval(() => {
      if (wordIdx >= words.length) {
        window.clearInterval(interval);
        setTyping(false);
        return;
      }
      streamed += words[wordIdx];
      wordIdx += 1;
      setTyping(false);
      // Update the AI message incrementally
      updateActive((s) => {
        const arr = [...s.messages];
        const last = arr[arr.length - 1];
        if (last && last.role === "ai" && last.model === model) {
          arr[arr.length - 1] = { ...last, text: streamed };
        } else {
          arr.push({ role: "ai", text: streamed, model });
        }
        return { ...s, messages: arr };
      });
    }, 45);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !active) return;
    updateActive((s) => ({
      ...s,
      messages: [...s.messages, { role: "user", text: `📎 ${f.name} (${Math.round(f.size / 1024)} KB)` }],
    }));
    e.target.value = "";
  };

  const startVoice = () => {
    // Web Speech API (Hebrew)
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("הדפדפן לא תומך בהקלטה קולית");
      return;
    }
    const rec = new SR();
    rec.lang = "he-IL";
    rec.interimResults = false;
    rec.continuous = false;
    setListening(true);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      setInput((cur) => (cur ? cur + " " + text : text));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
  };

  const newChat = (mode: "general" | "code") => {
    const s = initialSession(mode);
    setSessions((arr) => [s, ...arr]);
    setActiveId(s.id);
  };

  const deleteSession = (id: string) => {
    setSessions((arr) => {
      const next = arr.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = initialSession();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const QUICK = active?.mode === "code" ? QUICK_CODE : QUICK_GENERAL;
  const currentModel = MODELS.find((m) => m.id === model) || MODELS[0];

  return (
    <div className="chat-page-root stage">
      {/* Sessions sidebar (desktop) */}
      <aside
        className="chat-sidebar chat-sidebar-hide-mobile"
        style={{ ["--i" as string]: 0 } as React.CSSProperties}
      >
        <div className="flex gap-2">
          <button
            className="chat-quick-chip"
            style={{ flex: 1, justifyContent: "center", display: "inline-flex" }}
            onClick={() => newChat("general")}
          >
            + שיחה חדשה
          </button>
          <button
            className="chat-quick-chip"
            onClick={() => newChat("code")}
            aria-label="שיחת קוד"
            title="שיחת קוד"
          >
            {"</>"}
          </button>
        </div>
        <div className="flex flex-col gap-1.5" style={{ marginTop: 8 }}>
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-1" style={{ position: "relative" }}>
              <button
                className="chat-session-item"
                aria-current={s.id === activeId}
                onClick={() => setActiveId(s.id)}
              >
                {s.mode === "code" ? (
                  <span style={{ fontSize: 11, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{"</>"}</span>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                <span className="chat-session-item-title">{s.title}</span>
              </button>
              <button
                onClick={() => deleteSession(s.id)}
                aria-label="מחק שיחה"
                style={{
                  position: "absolute",
                  insetInlineEnd: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "transparent",
                  border: "none",
                  color: "#6B7094",
                  cursor: "pointer",
                  opacity: 0.6,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat main */}
      <section className="chat-main" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
        {/* Chat page header */}
        <div
          className="flex items-center gap-3"
          style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <HoloLogo size={22} />
          <div className="flex flex-col flex-1 min-w-0">
            <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F6FF" }}>
              {active?.title || "שיחה"}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-ink-muted)" }}>
              מצב: {active?.mode === "code" ? "קוד" : "שיחה רגילה"} · {active?.messages.length || 0} הודעות
            </span>
          </div>

          {/* Mode toggle */}
          <div className="chat-mode-toggle" aria-label="מצב שיחה">
            <button
              className="chat-mode-btn"
              aria-selected={active?.mode === "general"}
              onClick={() => updateActive((s) => ({ ...s, mode: "general" }))}
            >
              שיחה
            </button>
            <button
              className="chat-mode-btn"
              aria-selected={active?.mode === "code"}
              onClick={() => updateActive((s) => ({ ...s, mode: "code" }))}
            >
              קוד
            </button>
          </div>

          {/* Model selector */}
          <div style={{ position: "relative" }}>
            <button className="chat-model-pill" onClick={() => setModelOpen((o) => !o)}>
              {currentModel.label} ▾
            </button>
            {modelOpen && (
              <div
                style={{
                  position: "absolute",
                  insetInlineEnd: 0,
                  top: "calc(100% + 6px)",
                  zIndex: 20,
                  minWidth: 220,
                  background: "rgba(18, 20, 44, 0.95)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: 4,
                  boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
                }}
              >
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setModel(m.id);
                      setModelOpen(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: m.id === model ? "rgba(167,139,250,0.12)" : "transparent",
                      border: "none",
                      color: m.id === model ? "#F5F6FF" : "#B4B8D4",
                      fontSize: 13,
                      fontWeight: 500,
                      width: "100%",
                      textAlign: "start",
                      cursor: "pointer",
                    }}
                  >
                    <span>{m.label}</span>
                    <span style={{ fontSize: 10, color: "var(--color-ink-muted)" }}>{m.tier}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {active && active.messages.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center text-center"
              style={{ flex: 1, padding: "48px 16px", gap: 12 }}
            >
              <HoloLogo size={44} />
              <h3 className="display" style={{ fontSize: 22, marginTop: 8 }}>
                {active.mode === "code" ? "עוזר קוד" : "מה בראש שלך?"}
              </h3>
              <p style={{ fontSize: 13, color: "var(--color-ink-soft)", maxWidth: 380 }}>
                {active.mode === "code"
                  ? "שאל שאלות על Next.js, TypeScript, הפרויקט שלך. תקבל קוד, הסברים, ודיבאג."
                  : "עוזר שמכיר את הלוז, התקציב, היעדים וההשקעות שלך. שאל מה שבא לך."}
              </p>
              <div className="chat-quick-replies" style={{ padding: 0, marginTop: 14, justifyContent: "center" }}>
                {QUICK.map((q) => (
                  <button key={q} className="chat-quick-chip" onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {active?.messages.map((m, i) => (
                <div key={i} className={`chat-msg chat-msg-${m.role}`}>
                  {m.role === "ai" && m.model && (
                    <span className="chat-model-badge">
                      {MODELS.find((x) => x.id === m.model)?.label || m.model}
                    </span>
                  )}
                  <div className="chat-bubble">
                    {m.role === "ai" ? (
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    ) : (
                      m.text.split("\n").map((line, j) => <p key={j}>{line || "\u00A0"}</p>)
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="chat-msg chat-msg-ai">
                  <div className="chat-bubble chat-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          <button
            className="chat-icon-btn"
            aria-label="העלה תמונה"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            className="chat-icon-btn"
            aria-label="הקלטה קולית (עברית)"
            onClick={startVoice}
            style={listening ? { color: "#FB7185", borderColor: "rgba(251,113,133,0.4)" } : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>
          <input
            className="chat-input"
            placeholder={active?.mode === "code" ? "שאל על קוד..." : "שאל משהו..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            dir="rtl"
          />
          <button
            className="chat-send-btn"
            onClick={() => send()}
            disabled={!input.trim()}
            aria-label="שלח"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
