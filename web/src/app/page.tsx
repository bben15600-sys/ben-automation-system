"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DashboardData, TimelineEvent } from "@/lib/notion";

const C = {
  indigo: "#6366f1", blue: "#3b82f6", cyan: "#00d4ff",
  green: "#10b981", orange: "#f59e0b", pink: "#ec4899",
  purple: "#a855f7", teal: "#14b8a6",
};

const MOCK: DashboardData = {
  budget:      { total: 4250, trend: [8,6,7,5,4,6,4] },
  investments: { total: 52300, change: "+3.2%", trend: [3,4,3,5,6,5,7] },
  todayEvents: { count: 3, items: [
    { time: "08:00", label: "אימון בוקר",           color: C.blue },
    { time: "10:00", label: "עבודה על פרויקט וידאו", color: C.orange },
    { time: "13:00", label: "פגישה עם לקוח VR",     color: C.pink },
    { time: "16:00", label: "למידת קורס",            color: C.purple },
    { time: "19:00", label: "ערב עם ליהי",           color: C.green },
  ]},
  vrEvents:    { count: 2 },
  goals: [
    { label: "כדורסל",      done: 2, target: 3, color: C.blue },
    { label: "זמן עם ליהי", done: 3, target: 4, color: C.pink },
    { label: "קורס למידה",  done: 3, target: 5, color: C.orange },
    { label: "אירועי VR",   done: 2, target: 2, color: C.green },
  ],
  weekActivity: { tasks: [4,6,3,7,5,2,1], events: [2,3,1,4,2,1,0] },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(MOCK);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(res => {
        if (res.data && !res.mock) {
          setData(res.data);
          setIsMock(false);
        }
      })
      .catch(() => {});
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "שלום" : "ערב טוב";
  const goalsCompleted = data.goals.filter(g => g.done >= g.target).length;
  const goalsTotal = data.goals.length || 5;
  const goalsPct = Math.round((goalsCompleted / goalsTotal) * 100);

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto relative z-10">

      {/* Header */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}
        className="flex items-start justify-between mb-7">
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(99,102,241,0.8)", letterSpacing: 1.5, marginBottom: 4 }}>
            {dateStr.toUpperCase()}
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 800, letterSpacing: -1,
            background: "linear-gradient(135deg, #e8eeff 0%, rgba(180,190,255,0.6) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {greeting}, בן
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <SystemBadge label="AI" ok />
          <SystemBadge label="Notion" ok={!isMock} />
        </div>
      </motion.div>

      {isMock && (
        <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeUp}
          style={{
            padding: "10px 14px", borderRadius: 10, marginBottom: 16,
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
            fontSize: 12, color: "rgba(245,158,11,0.8)", textAlign: "center",
          }}>
          נתוני דמה — הגדר NOTION_API_TOKEN ב-Vercel לחיבור אמיתי
        </motion.div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MCard i={1} label="אירועים היום" value={data.todayEvents.count} suffix="" color={C.blue}  trend={[1,3,2,4,3,5,data.todayEvents.count]} change={`+${data.todayEvents.count}`} />
        <MCard i={2} label="הוצאות"       value={data.budget.total}       suffix="₪" color={C.green} trend={data.budget.trend} change="-12%" />
        <MCard i={3} label="תיק השקעות"   value={data.investments.total}  suffix="₪" color={C.purple} trend={data.investments.trend} change={data.investments.change} />
        <MCard i={4} label="אירועי VR"    value={data.vrEvents.count}     suffix="" color={C.pink}  trend={[1,2,1,3,2,2,data.vrEvents.count]} change="קרובים" />
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">

        {/* Donut goals */}
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp} className="card p-5">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)" }}>יעדים שבועיים</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo }}>{goalsCompleted} / {goalsTotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <DonutChart percentage={goalsPct || 60} color={C.indigo} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(data.goals.length > 0 ? data.goals : MOCK.goals).map((g, i) => (
              <GoalRow key={i} {...g} />
            ))}
          </div>
        </motion.div>

        {/* Bar chart */}
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp} className="card p-5">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)" }}>פעילות שבועית</span>
            <div style={{ display: "flex", gap: 12, fontSize: 10, color: "rgba(160,172,210,0.5)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: C.indigo, display: "inline-block" }} />משימות
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: `${C.blue}44`, display: "inline-block" }} />אירועים
              </span>
            </div>
          </div>
          <BarChart tasks={data.weekActivity.tasks} events={data.weekActivity.events} />
        </motion.div>

        {/* Side column */}
        <div className="flex flex-col gap-4">
          <motion.div initial="hidden" animate="visible" custom={7} variants={fadeUp} style={{ flex: 1 }}>
            <Link href="/chat" style={{ textDecoration: "none", display: "block", height: "100%" }}>
              <div className="card card-interactive p-5 h-full flex flex-col justify-between"
                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.06) 100%)", border: `1px solid ${C.indigo}22`, boxShadow: `0 0 24px ${C.indigo}18` }}>
                <div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, marginBottom: 12,
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eeff", marginBottom: 4 }}>oslife AI</div>
                  <div style={{ fontSize: 12, color: "rgba(160,172,210,0.55)", lineHeight: 1.5 }}>
                    ניתוב חכם — Claude · Gemini · Llama
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, fontSize: 12, color: C.indigo, fontWeight: 600 }}>
                  <span>התחל שיחה</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp} className="card p-4 grid grid-cols-2 gap-3">
            <MiniStat label="הכנסות" value="₪18K" color={C.green} />
            <MiniStat label="חיסכון" value="34%" color={C.cyan} />
          </motion.div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp} className="card p-5">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)" }}>לוז היום</span>
            <span style={{ fontSize: 11, color: "rgba(160,172,210,0.45)" }}>
              {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div>
            {(data.todayEvents.items.length > 0 ? data.todayEvents.items : MOCK.todayEvents.items).map((ev, i, arr) => (
              <TimelineItem key={i} {...ev} active={i === 0} last={i === arr.length - 1} />
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp} className="card p-5">
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,238,255,0.9)", marginBottom: 16 }}>גישה מהירה</div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/schedule"    label="לוז שבועי" desc={`${data.todayEvents.count} אירועים`} color={C.blue} />
            <QuickAction href="/budget"      label="תקציב"     desc={`₪${data.budget.total.toLocaleString()}`} color={C.green} />
            <QuickAction href="/investments" label="השקעות"    desc={data.investments.change + " החודש"} color={C.purple} />
            <QuickAction href="/vr"          label="Enjoy VR"  desc={`${data.vrEvents.count} אירועים`} color={C.pink} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SystemBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 99,
      background: ok ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${ok ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
      fontSize: 11, color: ok ? "rgba(16,185,129,0.9)" : "rgba(160,172,210,0.4)",
    }}>
      <span className={ok ? "live-dot" : ""} style={{ width: 5, height: 5, borderRadius: "50%", background: ok ? "#10b981" : "rgba(160,172,210,0.3)", display: "inline-block" }} />
      {label}
    </div>
  );
}

function MCard({ i, label, value, suffix, color, trend, change }: {
  i: number; label: string; value: number; suffix: string; color: string; trend: number[]; change: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const steps = 32, inc = value / steps;
    let cur = 0;
    const t = setInterval(() => { cur += inc; if (cur >= value) { setDisplay(value); clearInterval(t); } else setDisplay(Math.floor(cur)); }, 600 / steps);
    return () => clearInterval(t);
  }, [value]);

  const max = Math.max(...trend), min = Math.min(...trend), range = max - min || 1;
  const h = 28, w = 72;
  const pts = trend.map((v, j) => `${(j / (trend.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp}
      style={{
        background: `linear-gradient(135deg, ${color}0a 0%, transparent 100%)`,
        borderRadius: 16, padding: 16, border: `1px solid ${color}18`,
        position: "relative", overflow: "hidden", backdropFilter: "blur(12px)",
      }}>
      <div style={{ fontSize: 11, color: "rgba(160,172,210,0.55)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: -1, lineHeight: 1 }}>
        {suffix === "₪" ? `₪${display.toLocaleString()}` : `${display}${suffix}`}
      </div>
      <div style={{ fontSize: 10, color, opacity: 0.7, marginTop: 4, fontWeight: 600 }}>{change}</div>
      <svg width={w} height={h} style={{ position: "absolute", bottom: 12, left: 12, opacity: 0.35 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function DonutChart({ percentage, color }: { percentage: number; color: string }) {
  const [prog, setProg] = useState(0);
  useEffect(() => { const t = setTimeout(() => setProg(percentage), 150); return () => clearTimeout(t); }, [percentage]);
  const r = 44, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 112, height: 112 }}>
      <svg width="112" height="112" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - (prog / 100) * circ}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.1s ease-out", filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color }}>{percentage}%</span>
      </div>
    </div>
  );
}

function GoalRow({ label, done, target, color }: { label: string; done: number; target: number; color: string }) {
  const pct = Math.min((done / target) * 100, 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "rgba(200,210,240,0.7)" }}>{label}</span>
        <span style={{ fontSize: 10, color: "rgba(160,172,210,0.45)" }}>{done}/{target}</span>
      </div>
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
    </div>
  );
}

function BarChart({ tasks, events }: { tasks: number[]; events: number[] }) {
  const days = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const maxVal = Math.max(...tasks);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
      {days.map((day, i) => (
        <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: 110, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2 }}>
            <motion.div initial={{ height: 0 }} animate={{ height: `${(tasks[i] / maxVal) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
              style={{ width: "100%", borderRadius: "3px 3px 0 0", background: `linear-gradient(0deg, ${C.indigo}, ${C.purple})`, boxShadow: `0 0 12px ${C.indigo}44` }} />
            <motion.div initial={{ height: 0 }} animate={{ height: `${(events[i] / maxVal) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.08 + 0.1, ease: "easeOut" }}
              style={{ width: "100%", borderRadius: "0 0 3px 3px", background: `${C.blue}30` }} />
          </div>
          <span style={{ fontSize: 10, color: "rgba(160,172,210,0.4)" }}>{day}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ time, label, color, active, last }: TimelineEvent & { active?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${color}`, background: active ? color : "transparent",
          boxShadow: active ? `0 0 10px ${color}88` : "none",
        }} />
        {!last && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", margin: "3px 0" }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 16 }}>
        <div style={{ fontSize: 10, color: "rgba(160,172,210,0.4)", marginBottom: 2 }}>{time}</div>
        <div style={{ fontSize: 13, color: active ? "#e8eeff" : "rgba(200,210,240,0.6)", fontWeight: active ? 600 : 400 }}>{label}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: "10px 12px", borderRadius: 10, background: `${color}0a`, border: `1px solid ${color}15` }}>
      <div style={{ fontSize: 10, color: "rgba(160,172,210,0.5)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
}

function QuickAction({ href, label, desc, color }: { href: string; label: string; desc: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div whileHover={{ scale: 1.02, borderColor: `${color}35`, boxShadow: `0 0 16px ${color}25` }}
        style={{ padding: "12px 14px", borderRadius: 12, background: `${color}08`, border: `1px solid ${color}18`, cursor: "pointer" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}88`, marginBottom: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e8eeff", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(160,172,210,0.45)" }}>{desc}</div>
      </motion.div>
    </Link>
  );
}
