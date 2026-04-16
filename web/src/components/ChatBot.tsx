"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { type ChatMode, type SessionMessage, type ContentPart, getTextContent, getImages } from "@/lib/sessions";

interface ChatBotProps {
  forceModel?: string;
  mode?: ChatMode;
  initialMessages?: SessionMessage[];
  onMessagesChange?: (messages: SessionMessage[]) => void;
}

const QUICK_REPLIES: Record<ChatMode, string[]> = {
  general: ["מה יש לי היום?", "מצב תקציב", "תסכם את השבוע"],
  code: ["תבנה לי API", "תכתוב פונקציה", "תסביר ארכיטקטורה"],
};

const TIER_COLORS: Record<string, string> = {
  free: "#10b981",
  cheap: "#3b82f6",
  premium: "#8b5cf6",
};

export default function ChatBot({ forceModel, mode = "general", initialMessages, onMessagesChange }: ChatBotProps) {
  const [messages, setMessages] = useState<SessionMessage[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Notify parent of message changes
  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") setPendingImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePendingImage = (idx: number) => setPendingImages((prev) => prev.filter((_, i) => i !== idx));

  const sendMessage = useCallback(async (text: string) => {
    if ((!text.trim() && pendingImages.length === 0) || isLoading) return;

    let userContent: string | ContentPart[];
    if (pendingImages.length > 0) {
      const parts: ContentPart[] = [];
      if (text.trim()) parts.push({ type: "text", text: text.trim() });
      pendingImages.forEach((img) => parts.push({ type: "image_url", image_url: { url: img } }));
      userContent = parts;
    } else {
      userContent = text.trim();
    }

    const userMsg: SessionMessage = { id: crypto.randomUUID(), role: "user", content: userContent };
    const assistantMsg: SessionMessage = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setPendingImages([]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: forceModel || undefined, mode }),
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
                prev.map((m) => m.id === assistantMsg.id
                  ? { ...m, content: (typeof m.content === "string" ? m.content : "") + delta }
                  : m
                )
              );
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, content: "שגיאה בחיבור לשרת. נסה שוב." } : m)
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, forceModel, pendingImages, mode]);

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
    recognition.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((r: SpeechRecognitionResult) => r[0].transcript).join("");
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) sendMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }, [isListening, sendMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const isCode = mode === "code";
  const accent = isCode ? "accent-orange" : "accent-indigo";
  const quickReplies = QUICK_REPLIES[mode];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${
              isCode ? "bg-gradient-to-br from-accent-orange to-accent-red" : "bg-gradient-to-br from-accent-indigo to-accent-purple"
            }`}>
              {isCode ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              )}
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-1">
              {isCode ? "תכנון קוד" : "שלום, אני oslife"}
            </h2>
            <p className="text-text-muted text-sm mb-8">
              {isCode ? "תאר את הפרויקט ואכתוב לך קוד מקצועי" : "העוזר האישי שלך. שאל אותי כל דבר."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickReplies.map((qr) => (
                <button key={qr} onClick={() => sendMessage(qr)}
                  className="px-4 py-2.5 rounded-xl bg-bg-card border border-border-subtle text-sm text-text-secondary
                             hover:bg-bg-card-hover hover:border-border-active hover:text-text-primary transition-all shadow-sm">
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? isCode ? "bg-accent-orange text-white" : "bg-accent-indigo text-white"
                  : "bg-bg-card border border-border-subtle shadow-sm"
              }`}>
                {msg.role === "assistant" && msg.model && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: TIER_COLORS[msg.tier || "free"] }} />
                    <span className="text-[10px] text-text-muted font-medium">{msg.model}</span>
                  </div>
                )}

                {msg.role === "user" && getImages(msg.content).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getImages(msg.content).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-32 h-32 object-cover rounded-xl" />
                    ))}
                  </div>
                )}

                {(() => {
                  const text = getTextContent(msg.content);
                  if (!text && msg.role === "assistant") {
                    return (
                      <div className="flex gap-1.5 py-1">
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    );
                  }
                  if (msg.role === "assistant" && text) {
                    return (
                      <div className={`text-sm leading-relaxed prose-sm prose-neutral max-w-none
                                      [&_pre]:bg-bg-input [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_pre]:overflow-x-auto
                                      [&_code]:bg-bg-input [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
                                      [&_ul]:pr-4 [&_ol]:pr-4 [&_li]:text-sm
                                      [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold
                                      [&_a]:text-${accent} [&_a]:underline
                                      [&_blockquote]:border-r-2 [&_blockquote]:border-${accent} [&_blockquote]:pr-3 [&_blockquote]:text-text-secondary`}>
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    );
                  }
                  return text ? <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div> : null;
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending images */}
      {pendingImages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
            {pendingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-xl border border-border-subtle" />
                <button onClick={() => removePendingImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-red text-white text-xs flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-bg-card rounded-2xl border border-border-subtle px-3 py-2.5 shadow-sm">
            <button onClick={toggleVoice} title="הודעה קולית"
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isListening ? "bg-red-50 text-accent-red animate-pulse" : "text-text-muted hover:text-text-secondary hover:bg-bg-input"
              }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            <button onClick={() => fileRef.current?.click()} title="שלח תמונה"
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-input transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={isListening ? "מקשיב..." : isCode ? "תאר את הקוד שאתה צריך..." : "כתוב הודעה..."} rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-text-primary placeholder:text-text-muted max-h-32 py-1.5" />

            <button onClick={() => sendMessage(input)}
              disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all shadow-sm ${
                isCode ? "bg-accent-orange hover:bg-accent-orange/90" : "bg-accent-indigo hover:bg-accent-indigo/90"
              }`}>
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
