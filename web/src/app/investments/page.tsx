"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InvestItem { name: string; value: number; change: number; type: string; }

const TYPE_COLORS: Record<string, string> = {
  "מניות": "#8b8aff", "קריפטו": "#ffd93d", "חיסכון": "#64ffda",
};

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const } },
});

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
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <motion.div {...fade(0)} className="mb-8">
        <p className="label-caps mb-1" style={{ color: "#8b8aff" }}>INVESTMENTS</p>
        <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em" }}>תיק השקעות</h1>
      </motion.div>

      {/* Total */}
      <motion.div {...fade(1)} className="neu-raised p-6 mb-6 text-center">
        <span className="label-caps">שווי התיק</span>
        <div className="metric text-4xl mt-3" style={{ color: "#8b8aff" }}><span className="currency">₪{total.toLocaleString()}</span></div>
        <div className="metric text-sm text-text-muted mt-1">≈ ${Math.round(total / 3.65).toLocaleString()}</div>
      </motion.div>

      {/* Allocation */}
      {items.length > 0 && (
        <motion.div {...fade(2)} className="neu-flat p-5 mb-6">
          <span className="label-caps block mb-4">הקצאה</span>
          <div className="flex flex-col gap-4">
            {items.map((item, i) => {
              const color = TYPE_COLORS[item.type] || "#8b8aff";
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-primary">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="metric text-xs text-text-muted"><span className="currency">₪{item.value.toLocaleString()}</span></span>
                      <span className="metric text-sm font-bold" style={{ color }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="track-inset h-[5px]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" as const }}
                      className="h-full rounded-full" style={{ background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Monthly deposit */}
      <motion.div {...fade(3)} className="grid grid-cols-3 gap-4">
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">חודשי</span>
          <span className="metric text-xl" style={{ color: "#64ffda" }}>₪1,500</span>
        </div>
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">S&P 500</span>
          <span className="metric text-xl text-text-primary">60%</span>
        </div>
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">NVDA</span>
          <span className="metric text-xl" style={{ color: "#8b8aff" }}>30%</span>
        </div>
      </motion.div>

      {loading && <div className="text-center py-12 text-text-muted">טוען...</div>}
    </div>
  );
}
