"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  tier?: string;
}

interface ChatBotProps {
  forceModel?: string;
}

const QUICK_REPLIES = [
  "מה יש לי היום?",
  "מצב תקציב",
  "תסכם את השבוע",
];

const TIER_COLORS: Record<string, string> = {
  free: "#34d399",
  cheap: "#38bdf8",
  premium: "#8b5cf6",
};

export default function ChatBot({ forceModel }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: forceModel || undefined }),
      });

      const modelLabel = res.headers.get("X-Model-Label") || "AI";
      const modelTier = res.headers.get("X-Model-Tier") || "free";

      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, model: modelLabel, tier: modelTier } : m)
      );

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: `שגיאה: ${err.error || "Unknown error"}` } : m)
        );
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + delta } : m)
              );
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, content: "שגיאה בחיבור לשרת. נסה שוב." } : m)
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, forceModel]);

  const toggleVoice = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
               (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) { setIsListening(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SR as any)();
    recognition.lang = "he-IL";
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript;
      if (text) { setInput(text); sendMessage(text); }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }, [isListening, sendMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-1">שלום, אני oslife</h2>
            <p className="text-text-muted text-sm mb-8">העוזר האישי שלך. שאל אותי כל דבר.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="px-4 py-2.5 rounded-xl glass text-sm text-text-secondary
                             hover:bg-bg-card-hover hover:text-text-primary transition-all"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-accent-purple/15 text-text-primary"
                    : "glass"
                }`}
              >
                {msg.role === "assistant" && msg.model && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: TIER_COLORS[msg.tier || "free"] }}
                    />
                    <span className="text-[10px] text-text-muted font-medium">{msg.model}</span>
                  </div>
                )}

                {msg.content ? (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                ) : msg.role === "assistant" ? (
                  <div className="flex gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 pb-20 md:pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 glass rounded-2xl px-3 py-2.5">
            <button
              onClick={toggleVoice}
              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                isListening
                  ? "bg-accent-red/20 text-accent-red"
                  : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="כתוב הודעה..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm
                         placeholder:text-text-muted max-h-32 py-1"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                         bg-accent-purple text-white disabled:opacity-20 transition-all
                         hover:bg-accent-purple/80"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
