"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BudgetItem { name: string; amount: number; category: string; date: string; }

const CAT_COLORS: Record<string, string> = {
  "אוכל": "#10b981", "תחבורה": "#3b82f6", "בילויים": "#ec4899",
  "חשבונות": "#f59e0b", "קניות": "#a855f7", "אחר": "#6366f1",
};

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/budget").then(r => r.json()).then(d => {
      setItems(d.items || []); setTotal(d.total || 0); setByCategory(d.byCategory || {}); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const maxCat = Math.max(...Object.values(byCategory), 1);
  const month = new Date().toLocaleDateString("he-IL", { month: "long", year: "numeric" });

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div style={{ fontSize: 11, color: "rgba(16,185,129,0.8)", letterSpacing: 1.5, marginBottom: 4 }}>BUDGET</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e8eeff", letterSpacing: -0.5 }}>תקציב — {month}</h1>
      </motion.div>

      {/* Total card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card p-5 mb-5" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), transparent)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div style={{ fontSize: 11, color: "rgba(160,172,210,0.5)", marginBottom: 4 }}>סה"כ הוצאות החודש</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", letterSpacing: -1 }}>₪{total.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: "rgba(160,172,210,0.4)", marginTop: 4 }}>{items.length} רשומות</div>
      </motion.div>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-5 mb-5">
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)", marginBottom: 14 }}>לפי קטגוריה</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
              const color = CAT_COLORS[cat] || "#6366f1";
              const pct = (amount / maxCat) * 100;
              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "rgba(200,210,240,0.7)" }}>{cat}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>₪{amount.toLocaleString()}</span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}44` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Items list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(160,172,210,0.5)" }}>טוען...</div>
      ) : items.length === 0 ? (
        <div className="card p-10" style={{ textAlign: "center", color: "rgba(160,172,210,0.5)" }}>אין הוצאות החודש</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ overflow: "hidden" }}>
          {items.map((item, i) => {
            const color = CAT_COLORS[item.category] || "#6366f1";
            const d = item.date ? new Date(item.date) : null;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}66`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e8eeff" }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(160,172,210,0.4)", marginTop: 1 }}>
                    {d && `${d.getDate()}/${d.getMonth() + 1}`} · {item.category}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color, flexShrink: 0 }}>₪{item.amount.toLocaleString()}</div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
