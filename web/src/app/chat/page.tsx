"use client";

import { useState, useEffect, useCallback } from "react";
import ChatBot from "@/components/ChatBot";
import { loadSessions, saveSessions, createSession, autoNameSession, type ChatSession, type ChatMode, type SessionMessage } from "@/lib/sessions";

const MODELS = [
  { value: "", label: "אוטומטי", desc: "ניתוב חכם לפי סוג השאלה", tier: "auto" },
  { value: "openrouter/free", label: "Auto Free", desc: "חינם — ניתוב אוטומטי", tier: "free" },
  { value: "anthropic/claude-3.5-haiku", label: "Claude Haiku", desc: "זול — עברית מעולה", tier: "cheap" },
  { value: "google/gemini-2.0-flash-001", label: "Gemini Flash", desc: "זול — מהיר", tier: "cheap" },
  { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet", desc: "פרימיום — הכי חכם", tier: "premium" },
];

const TIER_DOT: Record<string, string> = {
  auto: "bg-accent-indigo",
  free: "bg-accent-green",
  cheap: "bg-accent-blue",
  premium: "bg-accent-purple",
};

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    const saved = loadSessions();
    if (saved.length > 0) {
      setSessions(saved);
      setActiveId(saved[0].id);
    } else {
      const s = createSession("general");
      setSessions([s]);
      setActiveId(s.id);
    }
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId);
  const currentModel = MODELS.find((m) => m.value === selectedModel) || MODELS[0];

  const updateSessions = useCallback((updated: ChatSession[]) => {
    setSessions(updated);
    saveSessions(updated);
  }, []);

  const handleNewChat = (mode: ChatMode) => {
    const s = createSession(mode);
    const updated = [s, ...sessions];
    updateSessions(updated);
    setActiveId(s.id);
    setShowSessions(false);
  };

  const handleSelectSession = (id: string) => {
    setActiveId(id);
    setShowSessions(false);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    updateSessions(updated);
    if (activeId === id) {
      if (updated.length > 0) setActiveId(updated[0].id);
      else { const s = createSession("general"); updateSessions([s]); setActiveId(s.id); }
    }
  };

  const handleMessagesUpdate = useCallback((messages: SessionMessage[]) => {
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== activeId) return s;
        const named = s.messages.length === 0 && messages.length > 0
          ? autoNameSession({ ...s, messages })
          : s.name;
        return { ...s, messages, name: named, updatedAt: Date.now() };
      });
      saveSessions(updated);
      return updated;
    });
  }, [activeId]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}>
        <div className="flex items-center gap-2">
          {/* Sessions toggle */}
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-input transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              activeSession?.mode === "code"
                ? "bg-gradient-to-br from-accent-orange to-accent-red"
                : "bg-gradient-to-br from-accent-indigo to-accent-purple"
            }`}>
              {activeSession?.mode === "code" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-xs font-bold text-text-primary leading-tight">
                {activeSession?.mode === "code" ? "תכנון קוד" : "צ׳אט AI"}
              </h1>
              <span className="text-[10px] text-text-muted">{activeSession?.name || ""}</span>
            </div>
          </div>
        </div>

        {/* Model selector */}
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-input border border-border-subtle text-xs text-text-secondary hover:border-border-active transition-all"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[currentModel.tier]}`} />
          {currentModel.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Model picker dropdown */}
      {showModelPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          <div className="absolute top-[7.5rem] md:top-[8rem] left-4 right-4 md:left-auto md:right-8 md:w-72 z-50
                          glass rounded-2xl p-1.5">
            {MODELS.map((m) => (
              <button
                key={m.value}
                onClick={() => { setSelectedModel(m.value); setShowModelPicker(false); }}
                className={`w-full text-right px-3 py-2.5 rounded-xl transition-all ${
                  selectedModel === m.value ? "bg-accent-indigo/10 text-accent-indigo" : "hover:bg-bg-card-hover text-text-secondary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[m.tier]}`} />
                  <span className="text-sm font-medium">{m.label}</span>
                </div>
                <div className="text-[11px] text-text-muted mr-3.5 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Sessions panel */}
      {showSessions && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setShowSessions(false)} />
          <div className="fixed top-14 md:top-16 right-0 bottom-0 w-72 z-40 flex flex-col"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="p-3 border-b border-border-subtle">
              <div className="flex gap-2">
                <button
                  onClick={() => handleNewChat("general")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent-indigo text-white text-xs font-medium hover:bg-accent-indigo/90 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  שיחה חדשה
                </button>
                <button
                  onClick={() => handleNewChat("code")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent-orange text-white text-xs font-medium hover:bg-accent-orange/90 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                  תכנון קוד
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all ${
                    s.id === activeId ? "bg-accent-indigo/10" : "hover:bg-bg-card-hover"
                  }`}
                  onClick={() => handleSelectSession(s.id)}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                    s.mode === "code" ? "bg-accent-orange/20 text-accent-orange" : "bg-accent-indigo/20 text-accent-indigo"
                  }`}>
                    {s.mode === "code" ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary truncate">{s.name}</div>
                    <div className="text-[10px] text-text-muted">{s.messages.length} הודעות</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-accent-red hover:bg-red-50 transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        {activeSession && (
          <ChatBot
            key={activeSession.id}
            forceModel={selectedModel || undefined}
            mode={activeSession.mode}
            initialMessages={activeSession.messages}
            onMessagesChange={handleMessagesUpdate}
          />
        )}
      </div>
    </div>
  );
}
