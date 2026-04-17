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
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const } },
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
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div {...fade(0)} className="mb-8">
        <p className="label-caps mb-1" style={{ color: "#64ffda" }}>
          {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="text-3xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {greeting}, בן
        </h1>
      </motion.div>

      {mock && (
        <motion.div {...fade(1)} className="neu-pressed p-3 mb-6 text-center">
          <span className="text-xs" style={{ color: "#ffd93d" }}>נתוני דמה — הגדר NOTION_API_TOKEN לחיבור</span>
        </motion.div>
      )}

      {/* Metrics — neumorphic raised cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <motion.div {...fade(2)} className="neu-raised p-5">
          <span className="label-caps">אירועים</span>
          <div className="metric text-3xl mt-3" style={{ color: "#64ffda" }}>{d.todayEvents.count}</div>
          <span className="text-xs text-text-muted mt-1 block">היום</span>
        </motion.div>

        <motion.div {...fade(3)} className="neu-raised p-5">
          <span className="label-caps">הוצאות</span>
          <div className="metric text-2xl mt-3 text-text-primary">₪{d.budget.total.toLocaleString()}</div>
          <span className="text-xs text-text-muted mt-1 block">החודש</span>
        </motion.div>

        <motion.div {...fade(4)} className="neu-raised p-5">
          <span className="label-caps">השקעות</span>
          <div className="metric text-2xl mt-3" style={{ color: "#8b8aff" }}>₪{d.investments.total.toLocaleString()}</div>
          <span className="text-xs text-text-muted mt-1 block">{d.investments.change}</span>
        </motion.div>

        <motion.div {...fade(5)} className="neu-raised p-5">
          <span className="label-caps">VR</span>
          <div className="metric text-3xl mt-3 text-text-primary">{d.vrEvents.count}</div>
          <span className="text-xs text-text-muted mt-1 block">אירועים</span>
        </motion.div>
      </div>

      {/* Goals + Timeline row */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">

        {/* Goals — interactive neumorphic items */}
        <motion.div {...fade(6)} className="neu-flat p-6">
          <div className="flex justify-between items-baseline mb-5">
            <span className="label-caps">יעדים שבועיים</span>
            <span className="metric text-sm text-text-secondary">{goalsDone}/{goalsTotal}</span>
          </div>
          <div className="flex flex-col gap-4">
            {(d.goals.length > 0 ? d.goals : [
              { label: "כדורסל", done: 2, target: 3, color: "#64b5f6" },
              { label: "ליהי", done: 1, target: 3, color: "#ff6b8a" },
              { label: "קורס", done: 2, target: 4, color: "#ffd93d" },
              { label: "טניס", done: 1, target: 2, color: "#64ffda" },
            ]).map((g, i) => (
              <GoalItem key={i} label={g.label} done={g.done} target={g.target} complete={g.done >= g.target} />
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div {...fade(7)} className="neu-flat p-6">
          <div className="flex justify-between items-baseline mb-5">
            <span className="label-caps">לוז היום</span>
            <span className="metric text-xs text-text-muted">
              {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex flex-col">
            {(d.todayEvents.items.length > 0 ? d.todayEvents.items : MOCK_TIMELINE).map((ev, i, arr) => (
              <TimelineRow key={i} ev={ev} first={i === 0} last={i === arr.length - 1} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row — AI button + quick links */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* AI Chat — big neumorphic button */}
        <motion.div {...fade(8)}>
          <Link href="/chat" className="block">
            <div className="neu-raised neu-interactive p-6 cursor-pointer text-center">
              <div className="neu-raised-sm w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ boxShadow: "4px 4px 8px #161624, -4px -4px 8px #282840, 0 0 20px rgba(100,255,218,0.15)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-text-primary">שאל את oslife AI</p>
              <p className="text-xs text-text-muted mt-1">Claude · Gemini · ניתוב חכם</p>
            </div>
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div {...fade(9)} className="md:col-span-2 grid grid-cols-2 gap-4">
          <QuickLink href="/schedule" label="לוז שבועי" value={`${d.todayEvents.count} אירועים`} icon="📅" />
          <QuickLink href="/budget" label="תקציב" value={`₪${d.budget.total.toLocaleString()}`} icon="💰" />
          <QuickLink href="/investments" label="השקעות" value={`₪${Math.round(d.investments.total / 1000)}K`} icon="📈" />
          <QuickLink href="/vr" label="Enjoy VR" value={`${d.vrEvents.count} אירועים`} icon="🥽" />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

const MOCK_TIMELINE: TimelineEvent[] = [
  { time: "08:00", label: "אימון בוקר", color: "#64ffda" },
  { time: "10:00", label: "עבודה על פרויקט", color: "#ffd93d" },
  { time: "14:00", label: "פגישה", color: "#8b8aff" },
  { time: "19:00", label: "ערב חופשי", color: "#64ffda" },
];

function GoalItem({ label, done, target, complete }: { label: string; done: number; target: number; complete: boolean }) {
  const pct = Math.min((done / target) * 100, 100);
  return (
    <div className={complete ? "neu-pressed-sm p-3" : "neu-raised-sm p-3"}>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-text-secondary">{complete ? "✓ " : ""}{label}</span>
        <span className="metric text-xs text-text-muted">{done}/{target}</span>
      </div>
      <div className="track-inset h-[5px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: complete ? "#64ffda" : "#8b8aff" }}
        />
      </div>
    </div>
  );
}

function TimelineRow({ ev, first, last }: { ev: TimelineEvent; first: boolean; last: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center" style={{ width: 14 }}>
        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{
          background: first ? "#64ffda" : "#2a2a40",
          boxShadow: first ? "0 0 8px rgba(100,255,218,0.4)" : "none",
        }} />
        {!last && <div className="w-px flex-1 mt-1" style={{ background: "#2a2a40" }} />}
      </div>
      <div className={last ? "pb-0" : "pb-5"}>
        <span className="metric text-[11px] text-text-muted block">{ev.time}</span>
        <span className={`text-sm ${first ? "text-text-primary font-medium" : "text-text-secondary"}`}>{ev.label}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, label, value, icon }: { href: string; label: string; value: string; icon: string }) {
  return (
    <Link href={href} className="block">
      <div className="neu-raised-sm neu-interactive p-4 cursor-pointer">
        <span className="text-lg mb-2 block">{icon}</span>
        <span className="text-xs text-text-muted block">{label}</span>
        <span className="metric text-sm text-text-primary mt-1 block">{value}</span>
      </div>
    </Link>
  );
}
