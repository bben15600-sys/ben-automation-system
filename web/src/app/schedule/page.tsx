"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScheduleItem { name: string; date: string; category: string; done: boolean; }

const CAT_COLORS: Record<string, string> = {
  "עבודה": "#3b82f6", "אישי": "#10b981", "בריאות": "#ef4444",
  "חברתי": "#ec4899", "למידה": "#a855f7",
};

const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule").then(r => r.json()).then(d => { setItems(d.items || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const grouped: Record<string, ScheduleItem[]> = {};
  for (const item of items) {
    const day = item.date.split("T")[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div style={{ fontSize: 11, color: "rgba(99,102,241,0.8)", letterSpacing: 1.5, marginBottom: 4 }}>SCHEDULE</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e8eeff", letterSpacing: -0.5 }}>לוז שבועי</h1>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(160,172,210,0.5)" }}>טוען...</div>
      ) : items.length === 0 ? (
        <div className="card p-10" style={{ textAlign: "center", color: "rgba(160,172,210,0.5)" }}>אין אירועים השבוע</div>
      ) : (
        Object.entries(grouped).map(([day, events], di) => {
          const d = new Date(day);
          const isToday = day === today;
          const dayName = DAYS_HE[d.getDay()];
          const dateLabel = `${d.getDate()}/${d.getMonth() + 1}`;

          return (
            <motion.div key={day} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.06 }} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isToday ? "#6366f1" : "rgba(200,210,240,0.7)",
                }}>{dayName}</span>
                <span style={{ fontSize: 11, color: "rgba(160,172,210,0.4)" }}>{dateLabel}</span>
                {isToday && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                    background: "rgba(99,102,241,0.15)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.3)",
                  }}>היום</span>
                )}
              </div>

              <div className="card" style={{ overflow: "hidden" }}>
                {events.map((ev, i) => {
                  const color = CAT_COLORS[ev.category] || "#6366f1";
                  const time = ev.date.split("T")[1]?.slice(0, 5) || "";
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px",
                      borderBottom: i < events.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ width: 3, height: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e8eeff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</div>
                        <div style={{ fontSize: 10, color: "rgba(160,172,210,0.45)", marginTop: 2 }}>
                          {time && <span>{time}</span>}
                          {ev.category && <span> · {ev.category}</span>}
                        </div>
                      </div>
                      {ev.done && (
                        <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#10b981", fontSize: 12 }}>✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
