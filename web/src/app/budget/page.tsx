"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BudgetItem { name: string; amount: number; category: string; date: string; }

const CAT_COLORS: Record<string, string> = {
  "אוכל": "#64ffda", "תחבורה": "#64b5f6", "בילויים": "#ff6b8a",
  "חשבונות": "#ffd93d", "קניות": "#8b8aff", "אחר": "#9090a8",
};

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const } },
});

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
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <motion.div {...fade(0)} className="mb-8">
        <p className="label-caps mb-1" style={{ color: "#64ffda" }}>BUDGET</p>
        <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em" }}>תקציב — {month}</h1>
      </motion.div>

      {/* Total */}
      <motion.div {...fade(1)} className="neu-raised p-6 mb-6 text-center">
        <span className="label-caps">סה"כ הוצאות</span>
        <div className="metric text-4xl mt-3" style={{ color: "#64ffda" }}><span className="currency">₪{total.toLocaleString()}</span></div>
        <span className="text-xs text-text-muted mt-1 block">{items.length} רשומות</span>
      </motion.div>

      {/* Categories */}
      {Object.keys(byCategory).length > 0 && (
        <motion.div {...fade(2)} className="neu-flat p-5 mb-6">
          <span className="label-caps block mb-4">לפי קטגוריה</span>
          <div className="flex flex-col gap-3">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
              const color = CAT_COLORS[cat] || "#9090a8";
              const pct = (amount / maxCat) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-text-secondary">{cat}</span>
                    <span className="metric text-sm" style={{ color }}><span className="currency">₪{amount.toLocaleString()}</span></span>
                  </div>
                  <div className="track-inset h-[5px]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" as const }}
                      className="h-full rounded-full" style={{ background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Items */}
      {loading ? (
        <div className="text-center py-12 text-text-muted">טוען...</div>
      ) : items.length === 0 ? (
        <div className="neu-pressed p-10 text-center text-text-muted">אין הוצאות החודש</div>
      ) : (
        <motion.div {...fade(3)} className="neu-flat overflow-hidden">
          {items.map((item, i) => {
            const color = CAT_COLORS[item.category] || "#9090a8";
            const d = item.date ? new Date(item.date) : null;
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-primary">{item.name}</span>
                  <span className="text-[10px] text-text-muted block">{d && `${d.getDate()}/${d.getMonth() + 1}`} · {item.category}</span>
                </div>
                <span className="metric text-sm shrink-0" style={{ color }}><span className="currency">₪{item.amount}</span></span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
