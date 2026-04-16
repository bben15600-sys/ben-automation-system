"use client";

import { useState, useEffect } from "react";

interface NotionPage {
  id: string;
  title: string;
}

export default function SetupPage() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<"pick" | "creating" | "success" | "error">("pick");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch("/api/setup-notion")
      .then((r) => r.json())
      .then((d) => {
        setPages(d.pages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const runSetup = async () => {
    if (!selected) return;
    setStatus("creating");
    try {
      const res = await fetch("/api/setup-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: selected }),
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

      {status === "pick" && (
        <>
          <p style={{ fontSize: 13, color: "rgba(160,172,210,0.6)", marginBottom: 20 }}>
            בחר דף ב-Notion שבתוכו ייווצרו כל ה-databases:
          </p>

          {loading ? (
            <div style={{ color: "rgba(160,172,210,0.5)", fontSize: 14, textAlign: "center", padding: 20 }}>
              טוען דפים...
            </div>
          ) : pages.length === 0 ? (
            <div style={{
              padding: 16, borderRadius: 12,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", fontSize: 13,
            }}>
              לא נמצאו דפים. ודא שה-oslife integration מחובר לדף כלשהו ב-Notion.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    style={{
                      padding: "14px 16px", borderRadius: 12, border: "none",
                      background: selected === p.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                      outline: selected === p.id ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                      color: "#e8eeff", fontSize: 14, fontWeight: 500,
                      textAlign: "right", cursor: "pointer",
                    }}
                  >
                    📄 {p.title}
                  </button>
                ))}
              </div>

              <button
                onClick={runSetup}
                disabled={!selected}
                style={{
                  width: "100%", padding: 16, borderRadius: 12, border: "none",
                  background: selected
                    ? "linear-gradient(135deg, #6366f1, #a855f7)"
                    : "rgba(255,255,255,0.1)",
                  color: selected ? "white" : "rgba(160,172,210,0.4)",
                  fontSize: 16, fontWeight: 700, cursor: selected ? "pointer" : "default",
                  boxShadow: selected ? "0 0 20px rgba(99,102,241,0.4)" : "none",
                }}
              >
                צור databases בדף שנבחר
              </button>
            </>
          )}
        </>
      )}

      {status === "creating" && (
        <div style={{
          padding: 20, borderRadius: 12, textAlign: "center",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
          color: "#6366f1", fontSize: 15, fontWeight: 600,
        }}>
          ⏳ יוצר 6 databases... חכה רגע
        </div>
      )}

      {status === "success" && (
        <div style={{
          padding: 20, borderRadius: 12,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981", fontSize: 15, fontWeight: 600, marginBottom: 16,
        }}>
          ✅ כל ה-databases נוצרו בהצלחה! שלח לי את המידע למטה.
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
