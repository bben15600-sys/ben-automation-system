"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

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
  { label: "📅 מה יש לי היום?", text: "מה יש לי היום בלוז?" },
  { label: "💰 מצב תקציב", text: "מה מצב התקציב שלי החודש?" },
  { label: "📊 תסכם את השבוע", text: "תסכם לי את השבוע" },
  { label: "🎯 מה כדאי לעשות?", text: "מה כדאי לי לעשות היום?" },
];

const TIER_COLORS: Record<string, string> = {
  free: "#22c55e",
  cheap: "#60a5fa",
  premium: "#c084fc",
};

// ── Component ───────────────────────────────────────────────────────────────

export default function ChatBot({ forceModel }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: forceModel || undefined,
        }),
      });

      const modelLabel = res.headers.get("X-Model-Label") || "AI";
      const modelTier = res.headers.get("X-Model-Tier") || "free";

      // Update assistant message with model info
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, model: modelLabel, tier: modelTier } : m
        )
      );

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: `שגיאה: ${err.error || "Unknown error"}` }
              : m
          )
        );
        return;
      }

      // Stream response
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
                prev.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: m.content + delta } : m
                )
              );
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "שגיאה בחיבור לשרת. נסה שוב." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, forceModel]);

  // ── Voice input ─────────────────────────────────────────────────────────

  const toggleVoice = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
               (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SR as any)();
    recognition.lang = "he-IL";
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript;
      if (text) {
        setInput(text);
        sendMessage(text);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    setIsListening(true);
    recognition.start();
  }, [isListening, sendMessage]);

  // ── Handle key ──────────────────────────────────────────────────────────

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center pt-16">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-xl font-bold mb-2">שלום, אני oslife</h2>
            <p className="text-text-muted text-sm mb-8">העוזר האישי שלך. שאל אותי כל דבר.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.text}
                  onClick={() => sendMessage(qr.text)}
                  className="px-3 py-2 rounded-xl bg-bg-card border border-border-subtle text-sm
                             hover:bg-bg-hover transition-colors"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-accent-purple/20 text-text-primary"
                  : "bg-bg-card border border-border-subtle"
              }`}
            >
              {/* Model badge */}
              {msg.role === "assistant" && msg.model && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: TIER_COLORS[msg.tier || "free"] }}
                  />
                  <span className="text-[10px] text-text-muted">{msg.model}</span>
                </div>
              )}

              {/* Content */}
              {msg.content ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              ) : msg.role === "assistant" ? (
                <div className="flex gap-1 py-1">
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies after last assistant message */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 justify-end">
          {QUICK_REPLIES.slice(0, 3).map((qr) => (
            <button
              key={qr.text}
              onClick={() => sendMessage(qr.text)}
              className="px-2.5 py-1 rounded-lg bg-bg-card border border-border-subtle
                         text-[11px] text-text-muted hover:text-text-primary transition-colors"
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 border-t border-border-subtle bg-bg-primary">
        <div className="flex items-end gap-2 bg-bg-card rounded-2xl border border-border-subtle px-3 py-2">
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isListening
                ? "bg-red-500/20 text-red-400"
                : "bg-bg-hover text-text-muted hover:text-text-primary"
            }`}
          >
            {isListening ? "⏹" : "🎤"}
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="כתוב הודעה..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm
                       placeholder:text-text-muted max-h-32"
          />

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                       bg-accent-purple text-white disabled:opacity-30 transition-opacity"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
