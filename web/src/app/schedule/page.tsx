"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScheduleItem { name: string; date: string; category: string; done: boolean; }

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

const fade = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const } },
});

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
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <motion.div {...fade(0)} className="mb-8">
        <p className="label-caps mb-1" style={{ color: "#2dd4bf" }}>SCHEDULE</p>
        <h1 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em" }}>לוז שבועי</h1>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">טוען...</div>
      ) : items.length === 0 ? (
        <div className="neu-pressed p-10 text-center text-text-muted">אין אירועים</div>
      ) : (
        Object.entries(grouped).map(([day, events], di) => {
          const d = new Date(day);
          const isToday = day === today;
          return (
            <motion.div key={day} {...fade(di + 1)} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: isToday ? "#64ffda" : "#9090a8" }}>
                  {DAYS[d.getDay()]}
                </span>
                <span className="text-xs text-text-muted">{d.getDate()}/{d.getMonth() + 1}</span>
                {isToday && <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(45,212,191,0.1)", color: "#2dd4bf" }}>היום</span>}
              </div>
              <div className="neu-flat overflow-hidden">
                {events.map((ev, i) => {
                  const time = ev.date.split("T")[1]?.slice(0, 5) || "";
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < events.length - 1 ? "border-b border-border" : ""}`}>
                      <div className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: ev.done ? "#2dd4bf" : "rgba(255,255,255,0.08)" }} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${ev.done ? "text-text-muted line-through" : "text-text-primary"}`}>{ev.name}</span>
                        <div className="text-[10px] text-text-muted mt-0.5">{time}{ev.category ? ` · ${ev.category}` : ""}</div>
                      </div>
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
