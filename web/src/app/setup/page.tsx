"use client";

import { useState } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "creating" | "success" | "error">("idle");
  const [result, setResult] = useState("");

  const runSetup = async () => {
    setStatus("creating");
    try {
      const res = await fetch("/api/setup-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      setStatus(data.success ? "success" : "error");
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Error");
      setStatus("error");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto", direction: "rtl" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e8eeff", marginBottom: 8 }}>
        🟣 הגדרת Notion
      </h1>
      <p style={{ fontSize: 13, color: "rgba(160,172,210,0.6)", marginBottom: 24 }}>
        לחיצה אחת — יוצר דף "oslife Dashboard" ב-Notion עם 6 databases מוכנים
      </p>

      {status === "idle" && (
        <button onClick={runSetup} style={{
          width: "100%", padding: 16, borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 0 20px rgba(99,102,241,0.4)",
        }}>
          צור הכל אוטומטית
        </button>
      )}

      {status === "creating" && (
        <div style={{
          padding: 20, borderRadius: 12, textAlign: "center",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
          color: "#6366f1", fontSize: 15, fontWeight: 600,
        }}>
          ⏳ יוצר דף + 6 databases... חכה רגע
        </div>
      )}

      {status === "success" && (
        <div style={{
          padding: 20, borderRadius: 12,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981", fontSize: 15, fontWeight: 600, marginBottom: 16,
        }}>
          ✅ הכל נוצר בהצלחה! שלח לי screenshot של המידע למטה.
        </div>
      )}

      {status === "error" && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 16,
        }}>
          ❌ שגיאה
        </div>
      )}

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
