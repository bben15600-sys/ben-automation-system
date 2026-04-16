"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ─── palette helpers ─── */
const C = {
  indigo:  "#6366f1",
  blue:    "#3b82f6",
  cyan:    "#00d4ff",
  green:   "#10b981",
  orange:  "#f59e0b",
  pink:    "#ec4899",
  purple:  "#a855f7",
  teal:    "#14b8a6",
};

function glowBorder(color: string) {
  return {
    border: `1px solid ${color}22`,
    boxShadow: `0 0 0 1px ${color}11, 0 0 24px ${color}18`,
  };
}

export default function DashboardPage() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "שלום" : "ערב טוב";

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto relative z-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: "rgba(99,102,241,0.8)", letterSpacing: 1.5 }}>
            {dateStr.toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold" style={{
            background: "linear-gradient(135deg, #e8eeff 0%, rgba(180,190,255,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: -1,
          }}>
            {greeting}, בן
          </h1>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <SystemBadge label="AI" ok />
          <SystemBadge label="Notion" ok={false} />
        </div>
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard label="אירועים היום" value={3}     suffix=""   color={C.blue}   trend={[1,3,2,4,3,5,3]} change="+2" />
        <MetricCard label="הוצאות"       value={4250}  suffix="₪"  color={C.green}  trend={[8,6,7,5,4,6,4]} change="-12%" />
        <MetricCard label="תיק השקעות"   value={52300} suffix="₪"  color={C.purple} trend={[3,4,3,5,6,5,7]} change="+3.2%" />
        <MetricCard label="אירועי VR"    value={2}     suffix=""   color={C.pink}   trend={[1,2,1,3,2,2,2]} change="השבוע" />
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">

        {/* Donut goals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: "rgba(232,238,255,0.9)" }}>יעדים שבועיים</span>
            <span className="text-xs font-bold" style={{ color: C.indigo }}>3 / 5</span>
          </div>
          <div className="flex justify-center mb-5">
            <DonutChart percentage={60} color={C.indigo} />
          </div>
          <div className="space-y-3">
            <GoalRow label="כדורסל"        done={2} target={3} color={C.blue} />
            <GoalRow label="זמן עם ליהי"   done={3} target={4} color={C.pink} />
            <GoalRow label="קורס למידה"    done={3} target={5} color={C.orange} unit="שעות" />
            <GoalRow label="אירועי VR"     done={2} target={2} color={C.green} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: "rgba(232,238,255,0.9)" }}>פעילות שבועית</span>
            <div className="flex gap-3" style={{ fontSize: 10, color: "rgba(160,172,210,0.5)" }}>
              <span className="flex items-center gap-1">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: C.indigo, display: "inline-block" }} />משימות
              </span>
              <span className="flex items-center gap-1">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: `${C.blue}44`, display: "inline-block" }} />אירועים
              </span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-4">
          {/* AI chat CTA */}
          <Link href="/chat" style={{ flex: 1 }}>
            <div className="card card-interactive p-5 h-full flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.06) 100%)", ...glowBorder(C.indigo) }}>
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
                <div className="text-sm font-bold mb-1" style={{ color: "#e8eeff" }}>oslife AI</div>
                <div style={{ fontSize: 12, color: "rgba(160,172,210,0.55)", lineHeight: 1.5 }}>
                  ניתוב חכם — Claude · Gemini · Llama
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4" style={{ fontSize: 12, color: C.indigo, fontWeight: 600 }}>
                <span>התחל שיחה</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Quick stats */}
          <div className="card p-4 grid grid-cols-2 gap-3">
            <MiniStat label="הכנסות" value="₪18K" color={C.green} />
            <MiniStat label="חיסכון" value="34%" color={C.cyan} />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        {/* Timeline */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: "rgba(232,238,255,0.9)" }}>לוז היום</span>
            <span style={{ fontSize: 11, color: "rgba(160,172,210,0.45)" }}>
              {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="space-y-0">
            <TimelineItem time="08:00" label="אימון בוקר"           color={C.blue}   active />
            <TimelineItem time="10:00" label="עבודה על פרויקט וידאו" color={C.orange} />
            <TimelineItem time="13:00" label="פגישה עם לקוח VR"     color={C.pink} />
            <TimelineItem time="16:00" label="למידת קורס"            color={C.purple} />
            <TimelineItem time="19:00" label="ערב עם ליהי"           color={C.green} last />
          </div>
        </div>

        {/* Quick access grid */}
        <div className="card p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: "rgba(232,238,255,0.9)" }}>גישה מהירה</div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/schedule"    label="לוז שבועי" desc="3 אירועים"    color={C.blue}   />
            <QuickAction href="/budget"      label="תקציב"     desc="₪4,250"       color={C.green}  />
            <QuickAction href="/investments" label="השקעות"    desc="+3.2% החודש"  color={C.purple} />
            <QuickAction href="/vr"          label="Enjoy VR"  desc="2 אירועים"    color={C.pink}   />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── System Badge ─── */
function SystemBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 99,
      background: ok ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${ok ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
      fontSize: 11, color: ok ? "rgba(16,185,129,0.9)" : "rgba(160,172,210,0.4)",
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: ok ? "#10b981" : "rgba(160,172,210,0.3)",
        display: "inline-block",
      }} className={ok ? "live-dot" : ""} />
      {label}
    </div>
  );
}

/* ─── Metric Card ─── */
function MetricCard({ label, value, suffix, color, trend, change }: {
  label: string; value: number; suffix: string; color: string; trend: number[]; change: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const steps = 32;
    const inc = value / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(Math.floor(cur));
    }, 600 / steps);
    return () => clearInterval(t);
  }, [value]);

  const max = Math.max(...trend), min = Math.min(...trend), range = max - min || 1;
  const h = 28, w = 72;
  const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}0a 0%, transparent 100%)`,
      borderRadius: 16, padding: "16px",
      border: `1px solid ${color}18`,
      position: "relative", overflow: "hidden",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ fontSize: 11, color: "rgba(160,172,210,0.55)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: -1, lineHeight: 1 }}>
        {suffix === "₪" ? `₪${display.toLocaleString()}` : `${display}${suffix}`}
      </div>
      <div style={{ fontSize: 10, color, opacity: 0.7, marginTop: 4, fontWeight: 600 }}>{change}</div>
      <svg width={w} height={h} style={{ position: "absolute", bottom: 12, left: 12, opacity: 0.35 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Donut ─── */
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

/* ─── Goal Row ─── */
function GoalRow({ label, done, target, color, unit }: { label: string; done: number; target: number; color: string; unit?: string }) {
  const pct = Math.min((done / target) * 100, 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "rgba(200,210,240,0.7)" }}>{label}</span>
        <span style={{ fontSize: 10, color: "rgba(160,172,210,0.45)" }}>{done}/{target} {unit || ""}</span>
      </div>
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66`, transition: "width 1.1s ease-out" }} />
      </div>
    </div>
  );
}

/* ─── Bar Chart ─── */
function BarChart() {
  const days = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const tasks  = [4, 6, 3, 7, 5, 2, 1];
  const events = [2, 3, 1, 4, 2, 1, 0];
  const maxVal = Math.max(...tasks);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
      {days.map((day, i) => (
        <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: 110, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2 }}>
            <div style={{
              width: "100%", borderRadius: "3px 3px 0 0",
              height: `${(tasks[i] / maxVal) * 100}%`,
              background: `linear-gradient(0deg, ${C.indigo}, ${C.purple})`,
              boxShadow: `0 0 12px ${C.indigo}44`,
              transition: `height 0.7s ease-out ${i * 80}ms`,
            }} />
            <div style={{
              width: "100%", borderRadius: "0 0 3px 3px",
              height: `${(events[i] / maxVal) * 100}%`,
              background: `${C.blue}30`,
              transition: `height 0.7s ease-out ${i * 80}ms`,
            }} />
          </div>
          <span style={{ fontSize: 10, color: "rgba(160,172,210,0.4)" }}>{day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Timeline ─── */
function TimelineItem({ time, label, color, active, last }: { time: string; label: string; color: string; active?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${color}`,
          background: active ? color : "transparent",
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

/* ─── Mini Stat ─── */
function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: "10px 12px", borderRadius: 10, background: `${color}0a`, border: `1px solid ${color}15` }}>
      <div style={{ fontSize: 10, color: "rgba(160,172,210,0.5)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
}

/* ─── Quick Action ─── */
function QuickAction({ href, label, desc, color }: { href: string; label: string; desc: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "12px 14px", borderRadius: 12,
        background: `${color}08`,
        border: `1px solid ${color}18`,
        cursor: "pointer", transition: "all 0.2s",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${color}25`;
          (e.currentTarget as HTMLDivElement).style.borderColor = `${color}35`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.borderColor = `${color}18`;
        }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}88`, marginBottom: 8 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e8eeff", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(160,172,210,0.45)" }}>{desc}</div>
      </div>
    </Link>
  );
}
