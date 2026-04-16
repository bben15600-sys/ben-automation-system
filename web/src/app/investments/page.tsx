"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InvestItem { name: string; value: number; change: number; type: string; }

const TYPE_COLORS: Record<string, string> = {
  "מניות": "#6366f1", "קריפטו": "#f59e0b", "חיסכון": "#10b981", "אחר": "#3b82f6",
};

export default function InvestmentsPage() {
  const [items, setItems] = useState<InvestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investments").then(r => r.json()).then(d => {
      setItems(d.items || []); setTotal(d.total || 0); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div style={{ fontSize: 11, color: "rgba(168,85,247,0.8)", letterSpacing: 1.5, marginBottom: 4 }}>INVESTMENTS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e8eeff", letterSpacing: -0.5 }}>תיק השקעות</h1>
      </motion.div>

      {/* Total */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card p-5 mb-5" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), transparent)", border: "1px solid rgba(168,85,247,0.15)" }}>
        <div style={{ fontSize: 11, color: "rgba(160,172,210,0.5)", marginBottom: 4 }}>שווי התיק</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#a855f7", letterSpacing: -1 }}>₪{total.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: "rgba(160,172,210,0.45)", marginTop: 4 }}>
          ≈ ${Math.round(total / 3.65).toLocaleString()}
        </div>
      </motion.div>

      {/* Allocation donut */}
      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-5 mb-5">
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)", marginBottom: 16 }}>הקצאה</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item, i) => {
              const color = TYPE_COLORS[item.type] || "#6366f1";
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}66` }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#e8eeff" }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
                      <span style={{ fontSize: 11, color: "rgba(160,172,210,0.4)", marginRight: 6 }}> ₪{item.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}44` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Monthly deposit info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card p-5">
        <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)", marginBottom: 12 }}>הפקדה חודשית</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <div style={{ fontSize: 10, color: "rgba(160,172,210,0.5)", marginBottom: 3 }}>סה"כ חודשי</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#6366f1" }}>₪1,500</div>
          </div>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <div style={{ fontSize: 10, color: "rgba(160,172,210,0.5)", marginBottom: 3 }}>S&P 500</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>60%</div>
          </div>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <div style={{ fontSize: 10, color: "rgba(160,172,210,0.5)", marginBottom: 3 }}>NVDA</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#a855f7" }}>30%</div>
          </div>
        </div>
      </motion.div>

      {loading && <div style={{ textAlign: "center", padding: 40, color: "rgba(160,172,210,0.5)" }}>טוען...</div>}
    </div>
  );
}
