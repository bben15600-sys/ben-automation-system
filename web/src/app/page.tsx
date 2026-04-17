"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { DashboardData } from "@/lib/notion";

const MOCK: DashboardData = {
  budget: { total: 0, trend: [] },
  investments: { total: 0, change: "+0%", trend: [] },
  todayEvents: { count: 0, items: [
    { time: "08:00", label: "אימון בוקר", color: "" },
    { time: "10:00", label: "עבודה", color: "" },
    { time: "14:00", label: "פגישה", color: "" },
    { time: "19:00", label: "ערב חופשי", color: "" },
  ] },
  vrEvents: { count: 0 },
  goals: [
    { label: "כדורסל", done: 2, target: 3, color: "" },
    { label: "ליהי", done: 1, target: 3, color: "" },
    { label: "קורס", done: 2, target: 4, color: "" },
    { label: "טניס", done: 1, target: 2, color: "" },
  ],
  weekActivity: { tasks: [], events: [] },
};

export default function DashboardPage() {
  const [d, setD] = useState<DashboardData>(MOCK);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(res => {
      if (res.data && !res.mock) setD(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActivePage(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  const goalsDone = d.goals.filter(g => g.done >= g.target).length;
  const goalsTotal = d.goals.length || 1;
  const goalsPct = Math.round((goalsDone / goalsTotal) * 100);

  const pages = [
    { id: "overview", label: "סקירה" },
    { id: "schedule", label: "לוז" },
    { id: "goals", label: "יעדים" },
    { id: "money", label: "כספים" },
  ];

  return (
    <div className="h-[calc(100vh-2.75rem)] md:h-[calc(100vh-3rem)] flex flex-col overflow-hidden -mb-20 md:mb-0">

      {/* Page dots */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0">
        {pages.map((p, i) => (
          <button key={p.id} onClick={() => {
            scrollRef.current?.scrollTo({ left: i * (scrollRef.current?.clientWidth || 0), behavior: "smooth" });
          }}
            className="transition-all duration-200"
            style={{
              width: activePage === i ? 24 : 6,
              height: 6,
              borderRadius: 99,
              background: activePage === i ? "#2dd4bf" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      {/* Swipeable pages */}
      <div ref={scrollRef} dir="ltr"
        className="flex-1 flex overflow-x-auto overflow-y-hidden"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>

        {/* PAGE 1: Overview */}
        <section dir="rtl" className="min-w-full shrink-0 px-6 flex flex-col justify-center items-center text-center"
          style={{ scrollSnapAlign: "start" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-sm text-text-secondary mb-2">
              {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-4xl font-extrabold text-white mb-8" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {greeting}, בן
            </h1>

            <div className="flex gap-8 justify-center mb-10">
              <div>
                <div className="metric text-5xl glow-teal">{d.todayEvents.count}</div>
                <p className="text-xs text-text-muted mt-1">אירועים</p>
              </div>
              <div className="w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div>
                <div className="metric text-5xl text-white">{goalsDone}/{goalsTotal}</div>
                <p className="text-xs text-text-muted mt-1">יעדים</p>
              </div>
            </div>

            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <div className="metric text-2xl text-white"><span className="currency">₪{d.investments.total.toLocaleString()}</span></div>
                <p className="text-[10px] text-text-muted mt-0.5">השקעות</p>
              </div>
              <div className="text-center">
                <div className="metric text-2xl text-white"><span className="currency">₪{d.budget.total.toLocaleString()}</span></div>
                <p className="text-[10px] text-text-muted mt-0.5">הוצאות</p>
              </div>
            </div>

            <p className="text-xs text-text-muted mt-10">החלק הצידה ←</p>
          </motion.div>
        </section>

        {/* PAGE 2: Schedule */}
        <section dir="rtl" className="min-w-full shrink-0 px-6 py-4 overflow-y-auto"
          style={{ scrollSnapAlign: "start" }}>
          <h2 className="text-2xl font-bold text-white mb-1">לוז היום</h2>
          <p className="text-xs text-text-muted mb-6">{d.todayEvents.count} אירועים</p>

          <div className="flex flex-col gap-0">
            {(d.todayEvents.items.length > 0 ? d.todayEvents.items : MOCK.todayEvents.items).map((ev, i, arr) => (
              <div key={i} className="flex items-stretch gap-4">
                {/* Time column */}
                <div className="flex flex-col items-center" style={{ width: 48 }}>
                  <span className="metric text-xs text-text-secondary">{ev.time}</span>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 my-2" style={{ background: "rgba(45,212,191,0.12)" }} />
                  )}
                </div>
                {/* Event */}
                <div className="flex-1 pb-6">
                  <div className="rounded-xl px-4 py-3" style={{
                    background: i === 0 ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.04)"}`,
                  }}>
                    <span className={`text-sm ${i === 0 ? "text-white font-semibold" : "text-text-secondary"}`}>
                      {ev.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAGE 3: Goals */}
        <section dir="rtl" className="min-w-full shrink-0 px-6 py-4 overflow-y-auto"
          style={{ scrollSnapAlign: "start" }}>
          <h2 className="text-2xl font-bold text-white mb-1">יעדים שבועיים</h2>
          <p className="text-xs text-text-muted mb-2">{goalsDone} מתוך {goalsTotal} הושלמו</p>

          {/* Big circle */}
          <div className="flex justify-center my-8">
            <GoalCircle pct={goalsPct} />
          </div>

          <div className="flex flex-col gap-4">
            {(d.goals.length > 0 ? d.goals : MOCK.goals).map((g, i) => {
              const pct = Math.min((g.done / g.target) * 100, 100);
              const complete = g.done >= g.target;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: complete ? "rgba(45,212,191,0.12)" : "transparent",
                      border: `1.5px solid ${complete ? "#2dd4bf" : "rgba(255,255,255,0.1)"}`,
                    }}>
                    {complete && <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-white">{g.label}</span>
                      <span className="metric text-xs text-text-muted">{g.done}/{g.target}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                        className="h-full rounded-full" style={{ background: "#2dd4bf" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PAGE 4: Money */}
        <section dir="rtl" className="min-w-full shrink-0 px-6 flex flex-col justify-center items-center text-center"
          style={{ scrollSnapAlign: "start" }}>
          <p className="text-xs text-text-muted mb-4">תיק השקעות</p>
          <div className="glow-teal metric text-6xl mb-2">
            <span className="currency">₪{d.investments.total.toLocaleString()}</span>
          </div>
          <div className="metric text-lg text-text-secondary mb-10">
            <span className="currency">≈ ${Math.round(d.investments.total / 3.65).toLocaleString()}</span>
          </div>

          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-text-muted mb-6">
              <span>הוצאות החודש</span>
              <span className="metric text-white"><span className="currency">₪{d.budget.total.toLocaleString()}</span></span>
            </div>

            <div className="flex justify-between text-xs text-text-muted mb-6">
              <span>הפקדה חודשית</span>
              <span className="metric text-white"><span className="currency">₪1,500</span></span>
            </div>

            <div className="flex justify-between text-xs text-text-muted mb-6">
              <span>VR אירועים</span>
              <span className="metric text-white">{d.vrEvents.count}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Link href="/budget" className="px-5 py-2.5 rounded-xl text-xs font-medium text-white btn-press"
              style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
              תקציב
            </Link>
            <Link href="/investments" className="px-5 py-2.5 rounded-xl text-xs font-medium text-white btn-press"
              style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
              השקעות
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom dock */}
      <div className="shrink-0 flex items-center justify-center gap-6 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/schedule" className="flex flex-col items-center gap-0.5 text-text-muted">
          <span className="text-lg">📅</span>
          <span className="text-[9px]">לוז</span>
        </Link>
        <Link href="/chat"
          className="w-14 h-14 rounded-full flex items-center justify-center btn-press -mt-6"
          style={{
            background: "linear-gradient(135deg, #0f766e, #2dd4bf)",
            boxShadow: "0 4px 20px rgba(45,212,191,0.3)",
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </Link>
        <Link href="/investments" className="flex flex-col items-center gap-0.5 text-text-muted">
          <span className="text-lg">📈</span>
          <span className="text-[9px]">השקעות</span>
        </Link>
      </div>
    </div>
  );
}

function GoalCircle({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => { setTimeout(() => setProgress(pct), 200); }, [pct]);

  return (
    <div className="relative" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="#2dd4bf" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ - (progress / 100) * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out", filter: "drop-shadow(0 0 6px rgba(45,212,191,0.4))" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="metric text-3xl text-white">{pct}%</span>
      </div>
    </div>
  );
}
