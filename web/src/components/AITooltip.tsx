"use client";

import { useState } from "react";

export default function AITooltip({ onOpen }: { onOpen?: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="ai-tooltip hidden md:flex"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.()}
    >
      <div className="flex flex-col items-end">
        <span style={{ fontSize: 12, fontWeight: 600, color: "#F5F6FF" }}>
          העוזר האישי שלי (AI)
        </span>
        <span style={{ fontSize: 11, color: "#B4B8D4" }}>
          במה אפשר לעזור לך היום?
        </span>
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: "radial-gradient(circle at 30% 25%, #C4B5FD 0%, #8B5CF6 70%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        aria-label="סגור"
        style={{
          marginInlineStart: 4,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "none",
          color: "#6B7094",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
