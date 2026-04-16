"use client";

import { useState } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<string>("");

  const runSetup = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/setup-notion", { method: "POST" });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      setStatus(data.success ? "success" : "error");
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto", direction: "rtl" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#e8eeff", marginBottom: 8 }}>
        🟣 הגדרת Notion
      </h1>
      <p style={{ fontSize: 14, color: "rgba(160,172,210,0.6)", marginBottom: 24 }}>
        לחץ על הכפתור ליצירת כל ה-databases ב-Notion
      </p>

      {status === "idle" && (
        <button onClick={runSetup} style={{
          width: "100%", padding: "16px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 0 20px rgba(99,102,241,0.4)",
        }}>
          צור databases ב-Notion
        </button>
      )}

      {status === "loading" && (
        <div style={{
          padding: 16, borderRadius: 12, textAlign: "center",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
          color: "#6366f1", fontSize: 14, fontWeight: 600,
        }}>
          יוצר databases... חכה רגע
        </div>
      )}

      {status === "success" && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981", fontSize: 14, fontWeight: 600, marginBottom: 16,
        }}>
          ✅ כל ה-databases נוצרו בהצלחה!
        </div>
      )}

      {status === "error" && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444", fontSize: 14, fontWeight: 600, marginBottom: 16,
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
