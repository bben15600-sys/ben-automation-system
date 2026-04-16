"use client";

import { useState } from "react";

export default function SetupPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runAction = async (url: string, body: object = {}) => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Error");
    }
    setLoading(false);
  };

  const btn = (label: string, color: string, onClick: () => void) => (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", padding: 14, borderRadius: 12, border: "none", marginBottom: 10,
      background: loading ? "rgba(255,255,255,0.1)" : color,
      color: loading ? "rgba(160,172,210,0.4)" : "white",
      fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer",
    }}>
      {loading ? "⏳ מעבד..." : label}
    </button>
  );

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto", direction: "rtl" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e8eeff", marginBottom: 16 }}>
        🟣 ניהול נתונים
      </h1>

      {btn("📈 עדכן השקעות (נתונים אמיתיים)", "linear-gradient(135deg, #8b5cf6, #6366f1)",
        () => runAction("/api/update-data", { action: "investments" }))}

      {btn("🗑️ מחק תקציב מזויף", "linear-gradient(135deg, #ef4444, #dc2626)",
        () => runAction("/api/update-data", { action: "clear-fake-budget" }))}

      {btn("📥 מלא לוז + יעדים מהשבועי", "linear-gradient(135deg, #10b981, #14b8a6)",
        () => runAction("/api/populate"))}

      {btn("🔧 צור databases חדשים", "linear-gradient(135deg, #6366f1, #a855f7)",
        () => runAction("/api/setup-notion"))}

      {result && (
        <pre style={{
          marginTop: 16, padding: 16, borderRadius: 12,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8eeff", fontSize: 11, overflow: "auto", whiteSpace: "pre-wrap",
          direction: "ltr", textAlign: "left",
        }}>
          {result}
        </pre>
      )}
    </div>
  );
}
