"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DashboardData, TimelineEvent } from "@/lib/notion";

const MOCK: DashboardData = {
  budget: { total: 0, trend: [] },
  investments: { total: 0, change: "+0%", trend: [] },
  todayEvents: { count: 0, items: [] },
  vrEvents: { count: 0 },
  goals: [],
  weekActivity: { tasks: [4,6,3,7,5,2,1], events: [2,3,1,4,2,1,0] },
};

const fade = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" as const } },
});

export default function DashboardPage() {
  const [d, setD] = useState<DashboardData>(MOCK);
  const [mock, setMock] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(res => {
      if (res.data && !res.mock) { setD(res.data); setMock(false); }
    }).catch(() => {});
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  const goalsDone = d.goals.filter(g => g.done >= g.target).length;
  const goalsTotal = d.goals.length || 1;

  return (
    <div className="px-3 md:px-6 py-5 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "#2dd4bf" }}>
            {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            {greeting}, בן
          </h1>
        </div>
        <Link href="/chat" className="btn-press">
          <div className="card px-4 py-2.5 flex items-center gap-2 cursor-pointer" style={{ borderColor: "rgba(45,212,191,0.25)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#2dd4bf", boxShadow: "0 0 8px rgba(45,212,191,0.5)" }} />
            <span className="text-xs font-medium text-white">AI צ׳אט</span>
          </div>
        </Link>
      </motion.div>

      {mock && (
        <motion.div {...fade(0.5)} className="card px-4 py-2.5 mb-4 text-center text-xs" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.2)" }}>
          נתוני דמה — הגדר NOTION_API_TOKEN
        </motion.div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Investment — large, spans 2 */}
        <motion.div {...fade(1)} className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label-caps">תיק השקעות</span>
            <span className="text-xs text-text-secondary">{d.investments.change}</span>
          </div>
          <div className="glow-teal metric text-4xl mb-1">
            <span className="currency">₪{d.investments.total.toLocaleString()}</span>
          </div>
          <span className="metric text-xs text-text-muted">
            <span className="currency">≈ ${Math.round(d.investments.total / 3.65).toLocaleString()}</span>
          </span>
        </motion.div>

        {/* Events today */}
        <motion.div {...fade(2)} className="card p-4">
          <span className="label-caps">אירועים</span>
          <div className="metric text-3xl mt-2">{d.todayEvents.count}</div>
          <span className="text-[10px] text-text-muted">היום</span>
        </motion.div>

        {/* Budget */}
        <motion.div {...fade(3)} className="card p-4">
          <span className="label-caps">הוצאות</span>
          <div className="metric text-2xl mt-2"><span className="currency">₪{d.budget.total.toLocaleString()}</span></div>
          <span className="text-[10px] text-text-muted">החודש</span>
        </motion.div>
      </div>

      {/* Second row — Goals + Timeline */}
      <div className="grid md:grid-cols-2 gap-3 mb-4">

        {/* Goals */}
        <motion.div {...fade(4)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps">יעדים שבועיים</span>
            <span className="metric text-xs text-text-secondary">{goalsDone}/{goalsTotal}</span>
          </div>
          <div className="flex flex-col gap-3">
            {(d.goals.length > 0 ? d.goals : [
              { label: "כדורסל", done: 2, target: 3, color: "" },
              { label: "ליהי", done: 1, target: 3, color: "" },
              { label: "קורס", done: 2, target: 4, color: "" },
              { label: "טניס", done: 1, target: 2, color: "" },
            ]).map((g, i) => {
              const pct = Math.min((g.done / g.target) * 100, 100);
              const complete = g.done >= g.target;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: complete ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${complete ? "rgba(45,212,191,0.3)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {complete && <span style={{ color: "#2dd4bf", fontSize: 11 }}>✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white">{g.label}</span>
                      <span className="metric text-[10px] text-text-muted">{g.done}/{g.target}</span>
                    </div>
                    <div className="track h-[3px]">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" as const }}
                        className="h-full rounded-full" style={{ background: "#2dd4bf" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div {...fade(5)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps">לוז היום</span>
            <span className="metric text-[10px] text-text-muted">
              {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {(d.todayEvents.items.length > 0 ? d.todayEvents.items : MOCK_TL).map((ev, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                  background: i === 0 ? "#2dd4bf" : "#1e293b",
                  boxShadow: i === 0 ? "0 0 6px rgba(45,212,191,0.4)" : "none",
                }} />
                <span className="metric text-[11px] text-text-muted w-10 shrink-0">{ev.time}</span>
                <span className={`text-sm flex-1 ${i === 0 ? "text-white font-medium" : "text-text-secondary"}`}>{ev.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row — Quick access */}
      <motion.div {...fade(6)} className="grid grid-cols-4 gap-3">
        <QLink href="/schedule" label="לוז" val={`${d.todayEvents.count}`} emoji="📅" />
        <QLink href="/budget" label="תקציב" val={d.budget.total > 0 ? `₪${Math.round(d.budget.total / 1000)}K` : "—"} emoji="💰" />
        <QLink href="/investments" label="השקעות" val={`₪${Math.round(d.investments.total / 1000)}K`} emoji="📈" />
        <QLink href="/vr" label="VR" val={`${d.vrEvents.count}`} emoji="🥽" />
      </motion.div>
    </div>
  );
}

const MOCK_TL: TimelineEvent[] = [
  { time: "08:00", label: "אימון בוקר", color: "" },
  { time: "10:00", label: "עבודה על פרויקט", color: "" },
  { time: "14:00", label: "פגישה", color: "" },
  { time: "19:00", label: "ערב חופשי", color: "" },
];

function QLink({ href, label, val, emoji }: { href: string; label: string; val: string; emoji: string }) {
  return (
    <Link href={href}>
      <div className="card p-3 text-center btn-press cursor-pointer">
        <span className="text-lg block mb-1">{emoji}</span>
        <span className="text-[10px] text-text-muted block">{label}</span>
        <span className="metric text-xs block mt-0.5">{val}</span>
      </div>
    </Link>
  );
}
