"use client";

import { useState } from "react";
import ChatBot from "@/components/ChatBot";

const MODELS = [
  { value: "", label: "🤖 אוטומטי (מומלץ)", desc: "ניתוב חכם לפי סוג השאלה" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek V3", desc: "חינם — שאלות פשוטות" },
  { value: "qwen/qwen3-235b-a22b:free", label: "Qwen 3", desc: "חינם — חשיבה מורכבת" },
  { value: "anthropic/claude-3.5-haiku", label: "Claude Haiku", desc: "זול — עברית מעולה" },
  { value: "google/gemini-2.5-flash-preview", label: "Gemini Flash", desc: "זול — מהיר" },
  { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet", desc: "פרימיום — הכי חכם" },
];

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);

  const currentModel = MODELS.find((m) => m.value === selectedModel) || MODELS[0];

  return (
    <div className="flex flex-col h-screen md:h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-card">
        <h1 className="text-lg font-bold">💬 צ׳אט</h1>
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-hover text-xs text-text-secondary
                     hover:text-text-primary transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-accent-green" />
          {currentModel.label}
        </button>
      </div>

      {/* Model picker dropdown */}
      {showModelPicker && (
        <div className="absolute top-14 left-4 right-4 md:left-auto md:right-24 md:w-72 z-50
                        bg-bg-card border border-border-subtle rounded-2xl p-2 shadow-2xl">
          {MODELS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                setSelectedModel(m.value);
                setShowModelPicker(false);
              }}
              className={`w-full text-right px-3 py-2.5 rounded-xl transition-colors ${
                selectedModel === m.value ? "bg-accent-purple/20" : "hover:bg-bg-hover"
              }`}
            >
              <div className="text-sm font-medium">{m.label}</div>
              <div className="text-[11px] text-text-muted">{m.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-hidden pb-16 md:pb-0">
        <ChatBot forceModel={selectedModel || undefined} />
      </div>
    </div>
  );
}
