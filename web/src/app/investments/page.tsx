"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InvestItem { name: string; value: number; change: number; type: string; }

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
        <p className="label-caps mb-1" style={{ color: "#2dd4bf" }}>INVESTMENTS</p>
        <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em" }}>תיק השקעות</h1>
      </motion.div>

      {/* Total */}
      <motion.div {...fade(1)} className="neu-raised p-6 mb-6 text-center">
        <span className="label-caps">שווי התיק</span>
        <div className="metric text-4xl mt-3 text-white"><span className="currency">₪{total.toLocaleString()}</span></div>
        <div className="metric text-sm text-text-secondary mt-1"><span className="currency">${Math.round(total / 3.65).toLocaleString()}</span></div>
      </motion.div>

      {/* Holdings list */}
      {items.length > 0 && (
        <motion.div {...fade(2)} className="neu-flat p-5 mb-6">
          <span className="label-caps block mb-4">החזקות</span>
          <div className="flex flex-col gap-5">
            {items.map((item, i) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={i}>
                  {/* Row: name right, amount left */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="metric text-sm text-white"><span className="currency">₪{item.value.toLocaleString()}</span></span>
                  </div>
                  {/* Progress bar with percentage */}
                  <div className="flex items-center gap-3">
                    <div className="track-inset h-[5px] flex-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" as const }}
                        className="h-full rounded-full" style={{ background: "#2dd4bf" }} />
                    </div>
                    <span className="metric text-xs text-white w-8 text-left">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Monthly deposit */}
      <motion.div {...fade(3)} className="grid grid-cols-3 gap-3">
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">חודשי</span>
          <span className="metric text-lg text-white"><span className="currency">₪1,500</span></span>
        </div>
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">S&P 500</span>
          <span className="metric text-lg text-white">60%</span>
        </div>
        <div className="neu-raised-sm p-4 text-center">
          <span className="label-caps block mb-2">NVDA</span>
          <span className="metric text-lg text-white">30%</span>
        </div>
      </motion.div>

      {loading && <div className="text-center py-12 text-text-muted">טוען...</div>}
    </div>
  );
}
