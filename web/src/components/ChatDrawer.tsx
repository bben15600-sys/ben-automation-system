"use client";

import { useEffect, useRef, useState } from "react";
import HoloLogo from "./HoloLogo";

type Msg = { role: "user" | "ai"; text: string; model?: string };

const SEED: Msg[] = [
  {
    role: "ai",
    text:
      "בוקר טוב בן. הנה סיכום קצר של היום:\n\n• 4 אירועים בלוז, הקרוב — פגישה עם הצוות ב־08:30\n• 2 יעדים ממתינים להשלמה השבוע\n• תיק ההשקעות עלה 1.2% מפתיחת המסחר",
    model: "Claude Haiku",
  },
];

const QUICK = ["מה יש לי מחר?", "כמה הוצאתי החודש?", "סכם את השבוע"];

export default function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { role: "ai", text: "קיבלתי — אחבר ל-Notion ו-OpenRouter וזה יהיה חי.", model: "Claude Haiku" },
      ]);
    }, 900);
  };

  return (
    <>
      <div
        className={`chat-backdrop${open ? " chat-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`chat-drawer${open ? " chat-drawer-open" : ""}`}
        role="dialog"
        aria-label="עוזר AI"
        aria-hidden={!open}
      >
        <header className="chat-header">
          <div className="flex items-center gap-3">
            <HoloLogo size={24} />
            <div className="flex flex-col">
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F6FF" }}>עוזר AI</span>
              <span
                style={{
                  fontSize: 11,
                  color: "#34D399",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "#34D399",
                    boxShadow: "0 0 6px #34D399",
                  }}
                />
                מחובר · Claude Haiku
              </span>
            </div>
          </div>
          <button onClick={onClose} className="chat-icon-btn" aria-label="סגור">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-msg-${m.role}`}>
              {m.role === "ai" && m.model && <span className="chat-model-badge">{m.model}</span>}
              <div className="chat-bubble">
                {m.text.split("\n").map((line, j) => (
                  <p key={j}>{line || "\u00A0"}</p>
                ))}
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
        </div>

        <div className="chat-quick-replies">
          {QUICK.map((q) => (
            <button key={q} className="chat-quick-chip" onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <button className="chat-icon-btn" aria-label="קלט קולי">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>
          <input
            className="chat-input"
            placeholder="שאל משהו..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            dir="rtl"
          />
          <button
            className="chat-send-btn"
            onClick={() => send()}
            aria-label="שלח"
            disabled={!input.trim()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
