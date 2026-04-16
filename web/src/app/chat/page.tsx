"use client";

import { useState } from "react";
import ChatBot from "@/components/ChatBot";

const MODELS = [
  { value: "", label: "אוטומטי", desc: "ניתוב חכם לפי סוג השאלה", tier: "auto" },
  { value: "deepseek/deepseek-v3-0324:free", label: "DeepSeek V3", desc: "חינם — שאלות פשוטות", tier: "free" },
  { value: "deepseek/deepseek-r1:free", label: "DeepSeek R1", desc: "חינם — חשיבה מורכבת", tier: "free" },
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
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);

  const currentModel = MODELS.find((m) => m.value === selectedModel) || MODELS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-card border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-bold text-text-primary">צ׳אט AI</h1>
        </div>
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-input border border-border-subtle text-xs text-text-secondary
                     hover:border-border-active transition-all"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[currentModel.tier]}`} />
          {currentModel.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Model picker */}
      {showModelPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          <div className="absolute top-[7.5rem] md:top-[8rem] left-4 right-4 md:left-auto md:right-8 md:w-72 z-50
                          bg-bg-card border border-border-subtle rounded-2xl p-1.5 shadow-lg">
            {MODELS.map((m) => (
              <button
                key={m.value}
                onClick={() => { setSelectedModel(m.value); setShowModelPicker(false); }}
                className={`w-full text-right px-3 py-2.5 rounded-xl transition-all ${
                  selectedModel === m.value
                    ? "bg-accent-indigo/10 text-accent-indigo"
                    : "hover:bg-bg-card-hover text-text-secondary"
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

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatBot forceModel={selectedModel || undefined} />
      </div>
    </div>
  );
}
