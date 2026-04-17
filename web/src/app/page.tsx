"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DashboardData, TimelineEvent } from "@/lib/notion";

const MOCK: DashboardData = {
  budget:      { total: 0, trend: [] },
  investments: { total: 0, change: "+0%", trend: [] },
  todayEvents: { count: 0, items: [] },
  vrEvents:    { count: 0 },
  goals:       [],
  weekActivity: { tasks: [4,6,3,7,5,2,1], events: [2,3,1,4,2,1,0] },
};

const enter = (i: number) => ({
  initial: { opacity: 0, y: 12 },
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
  const goalsTotal = d.goals.length || 1;
  const goalsDone = d.goals.filter(g => g.done >= g.target).length;

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div {...enter(0)} className="mb-8">
        <p className="label-caps mb-1" style={{ color: "oklch(0.72 0.18 250)" }}>
          {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="text-3xl font-extrabold text-text-primary" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          {greeting}, בן
        </h1>
      </motion.div>

      {mock && (
        <motion.div {...enter(1)} className="card px-4 py-3 mb-5 text-center" style={{ borderColor: "oklch(0.78 0.15 80 / 0.3)", color: "oklch(0.78 0.15 80)" }}>
          <span className="text-xs">נתוני דמה — הגדר NOTION_API_TOKEN לחיבור</span>
        </motion.div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" style={{ gridAutoRows: "minmax(0, auto)" }}>

        {/* Large — Events today (spans 2 cols on mobile) */}
        <motion.div {...enter(2)} className="col-span-2 card p-5">
          <span className="label-caps">אירועים היום</span>
          <div className="metric text-4xl mt-2" style={{ color: "oklch(0.72 0.18 250)" }}>
            {d.todayEvents.count}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {d.todayEvents.items.slice(0, 2).map(e => e.label).join(" · ") || "אין אירועים"}
          </div>
        </motion.div>

        {/* Small — Budget */}
        <motion.div {...enter(3)} className="card p-4">
          <span className="label-caps">הוצאות</span>
          <div className="metric text-xl mt-2 text-text-primary">
            ₪{d.budget.total.toLocaleString()}
          </div>
        </motion.div>

        {/* Small — VR */}
        <motion.div {...enter(4)} className="card p-4">
          <span className="label-caps">VR</span>
          <div className="metric text-xl mt-2 text-text-primary">
            {d.vrEvents.count}
          </div>
          <span className="text-xs text-text-muted">אירועים</span>
        </motion.div>

        {/* Medium — Investments (spans 2) */}
        <motion.div {...enter(5)} className="col-span-2 card p-5">
          <div className="flex items-baseline justify-between">
            <span className="label-caps">תיק השקעות</span>
            <span className="text-xs text-text-muted">{d.investments.change}</span>
          </div>
          <div className="metric text-3xl mt-2" style={{ color: "oklch(0.70 0.12 280)" }}>
            ₪{d.investments.total.toLocaleString()}
          </div>
        </motion.div>

        {/* Goals — spans 2 */}
        <motion.div {...enter(6)} className="col-span-2 card p-5">
          <div className="flex items-baseline justify-between mb-4">
            <span className="label-caps">יעדים שבועיים</span>
            <span className="metric text-sm text-text-secondary">{goalsDone}/{goalsTotal}</span>
          </div>
          <div className="flex flex-col gap-3">
            {(d.goals.length > 0 ? d.goals : [
              { label: "כדורסל", done: 2, target: 3, color: "#6b8aed" },
              { label: "ליהי", done: 1, target: 3, color: "#c084fc" },
              { label: "קורס", done: 2, target: 4, color: "#fbbf24" },
            ]).map((g, i) => (
              <GoalBar key={i} label={g.label} done={g.done} target={g.target} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Timeline + Quick */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">

        {/* Timeline — 3 cols */}
        <motion.div {...enter(7)} className="md:col-span-3 card p-5">
          <span className="label-caps mb-4 block">לוז היום</span>
          {(d.todayEvents.items.length > 0 ? d.todayEvents.items : MOCK_TIMELINE).map((ev, i, arr) => (
            <TLine key={i} ev={ev} first={i === 0} last={i === arr.length - 1} />
          ))}
        </motion.div>

        {/* Quick actions — 2 cols */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <motion.div {...enter(8)}>
            <Link href="/chat" className="block">
              <div className="card p-5 btn-press cursor-pointer" style={{ borderColor: "oklch(0.72 0.18 250 / 0.2)" }}>
                <span className="label-caps" style={{ color: "oklch(0.72 0.18 250)" }}>AI</span>
                <p className="text-sm font-semibold text-text-primary mt-2">שאל את oslife</p>
                <p className="text-xs text-text-muted mt-1">Claude · Gemini · ניתוב חכם</p>
              </div>
            </Link>
          </motion.div>

          <motion.div {...enter(9)} className="card p-4 grid grid-cols-2 gap-2">
            <QLink href="/schedule" label="לוז" val={`${d.todayEvents.count}`} />
            <QLink href="/budget" label="תקציב" val={`₪${d.budget.total.toLocaleString()}`} />
            <QLink href="/investments" label="השקעות" val={`₪${Math.round(d.investments.total / 1000)}K`} />
            <QLink href="/vr" label="VR" val={`${d.vrEvents.count}`} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const MOCK_TIMELINE: TimelineEvent[] = [
  { time: "08:00", label: "אימון בוקר", color: "#6b8aed" },
  { time: "10:00", label: "עבודה על פרויקט", color: "#fbbf24" },
  { time: "14:00", label: "פגישה", color: "#c084fc" },
  { time: "19:00", label: "ערב חופשי", color: "#4ade80" },
];

function GoalBar({ label, done, target }: { label: string; done: number; target: number }) {
  const pct = Math.min((done / target) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="metric text-xs text-text-muted">{done}/{target}</span>
      </div>
      <div className="h-[3px] rounded-sm" style={{ background: "oklch(0.20 0.01 260)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="h-full rounded-sm" style={{ background: "oklch(0.72 0.18 250)" }} />
      </div>
    </div>
  );
}

function TLine({ ev, first, last }: { ev: TimelineEvent; first: boolean; last: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center" style={{ width: 12 }}>
        <div className="w-[6px] h-[6px] rounded-full mt-1.5 shrink-0" style={{
          background: first ? "oklch(0.72 0.18 250)" : "oklch(0.35 0.01 260)",
        }} />
        {!last && <div className="w-px flex-1 mt-1" style={{ background: "oklch(0.20 0.01 260)" }} />}
      </div>
      <div className={`pb-4 ${last ? "pb-0" : ""}`}>
        <span className="metric text-[11px] text-text-muted">{ev.time}</span>
        <p className={`text-sm ${first ? "text-text-primary font-medium" : "text-text-secondary"}`}>{ev.label}</p>
      </div>
    </div>
  );
}

function QLink({ href, label, val }: { href: string; label: string; val: string }) {
  return (
    <Link href={href} className="block p-3 rounded-lg btn-press transition-colors duration-[120ms] hover:bg-bg-card-hover" style={{ background: "oklch(0.10 0.01 260)" }}>
      <span className="text-[10px] text-text-muted block">{label}</span>
      <span className="metric text-sm text-text-primary">{val}</span>
    </Link>
  );
}
