"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">שלום, בן</h1>
          <p className="text-text-muted text-sm mt-0.5">הנה הסיכום שלך להיום</p>
        </div>
        <div className="text-xs text-text-muted bg-bg-card border border-border-subtle rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Metric Cards with Sparklines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <MetricCard label="אירועים היום" value={3} suffix="" color="#3b82f6" bg="#eff6ff" trend={[1,3,2,4,3,5,3]} change="+2" />
        <MetricCard label="הוצאות החודש" value={4250} suffix="₪" color="#10b981" bg="#ecfdf5" trend={[8,6,7,5,4,6,4]} change="-12%" />
        <MetricCard label="תיק השקעות" value={52300} suffix="₪" color="#8b5cf6" bg="#f5f3ff" trend={[3,4,3,5,6,5,7]} change="+3.2%" />
        <MetricCard label="אירועי VR" value={2} suffix="" color="#ec4899" bg="#fdf2f8" trend={[1,2,1,3,2,2,2]} change="השבוע" />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Weekly Goals - Donut */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold">יעדים שבועיים</h3>
            <span className="text-xs text-accent-indigo font-semibold">3/5</span>
          </div>
          <div className="flex justify-center mb-5">
            <DonutChart percentage={60} color="#6366f1" />
          </div>
          <div className="space-y-3">
            <GoalRow label="כדורסל" done={2} target={3} color="#3b82f6" />
            <GoalRow label="זמן עם ליהי" done={3} target={4} color="#ec4899" />
            <GoalRow label="קורס למידה" done={3} target={5} color="#f59e0b" unit="שעות" />
            <GoalRow label="אירועי VR" done={2} target={2} color="#10b981" />
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold">פעילות שבועית</h3>
            <div className="flex gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent-indigo" />משימות</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent-blue/30" />אירועים</span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* AI Chat CTA */}
        <div className="flex flex-col gap-4">
          <Link href="/chat" className="flex-1">
            <div className="card card-interactive p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold mb-1">שאל את oslife AI</h3>
                <p className="text-text-muted text-xs leading-relaxed">ניתוב חכם בין מודלים — Gemini, Claude, Llama ועוד</p>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-accent-indigo text-xs font-medium">
                <span>התחל שיחה</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>
          </Link>

          {/* System Status Mini */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-text-muted mb-3">סטטוס</h3>
            <div className="space-y-2">
              <StatusDot label="AI צ׳אט" ok />
              <StatusDot label="Notion" ok={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Timeline */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">לוז היום</h3>
          <div className="space-y-0">
            <TimelineItem time="08:00" label="אימון בוקר" color="#3b82f6" active />
            <TimelineItem time="10:00" label="עבודה על פרויקט וידאו" color="#f59e0b" />
            <TimelineItem time="13:00" label="פגישה עם לקוח VR" color="#ec4899" />
            <TimelineItem time="16:00" label="למידת קורס" color="#8b5cf6" />
            <TimelineItem time="19:00" label="ערב עם ליהי" color="#10b981" last />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">גישה מהירה</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickAction href="/schedule" label="לוז שבועי" desc="3 אירועים היום" color="#3b82f6" bg="#eff6ff" />
            <QuickAction href="/budget" label="תקציב" desc="₪4,250 הוצאות" color="#10b981" bg="#ecfdf5" />
            <QuickAction href="/investments" label="השקעות" desc="+3.2% החודש" color="#8b5cf6" bg="#f5f3ff" />
            <QuickAction href="/vr" label="Enjoy VR" desc="2 אירועים" color="#ec4899" bg="#fdf2f8" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Animated Metric Card ── */
function MetricCard({ label, value, suffix, color, bg, trend, change }: {
  label: string; value: number; suffix: string; color: string; bg: string; trend: number[]; change: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  const h = 30;
  const w = 80;
  const points = trend.map((v, i) => `${(i / (trend.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-[10px] font-medium" style={{ color }}>{change}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {suffix === "₪" ? `₪${display.toLocaleString()}` : display}{suffix && suffix !== "₪" ? suffix : ""}
      </div>
      <svg width={w} height={h} className="absolute bottom-2 left-3 opacity-30">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Donut Chart ── */
function DonutChart({ percentage, color }: { percentage: number; color: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="relative w-28 h-28">
      <svg width="112" height="112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
}

/* ── Goal Row ── */
function GoalRow({ label, done, target, color, unit }: {
  label: string; done: number; target: number; color: string; unit?: string;
}) {
  const pct = Math.min((done / target) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-[10px] text-text-muted">{done}/{target} {unit || ""}</span>
      </div>
      <div className="w-full h-1.5 bg-bg-input rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function BarChart() {
  const days = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const tasks = [4, 6, 3, 7, 5, 2, 1];
  const events = [2, 3, 1, 4, 2, 1, 0];
  const maxVal = Math.max(...tasks);

  return (
    <div className="flex items-end gap-2 h-36">
      {days.map((day, i) => (
        <div key={day} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "110px" }}>
            <div className="w-full flex flex-col justify-end h-full gap-0.5">
              <div className="w-full rounded-t-sm bg-accent-indigo transition-all duration-700 ease-out"
                style={{ height: `${(tasks[i] / maxVal) * 100}%`, animationDelay: `${i * 80}ms` }} />
              <div className="w-full rounded-b-sm bg-accent-blue/30 transition-all duration-700 ease-out"
                style={{ height: `${(events[i] / maxVal) * 100}%`, animationDelay: `${i * 80}ms` }} />
            </div>
          </div>
          <span className="text-[10px] text-text-muted">{day}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Timeline ── */
function TimelineItem({ time, label, color, active, last }: {
  time: string; label: string; color: string; active?: boolean; last?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${active ? "" : ""}`}
          style={{ borderColor: color, background: active ? color : "transparent" }} />
        {!last && <div className="w-px flex-1 bg-border-subtle my-1" />}
      </div>
      <div className={`pb-4 ${last ? "pb-0" : ""}`}>
        <div className="text-[11px] text-text-muted mb-0.5">{time}</div>
        <div className={`text-sm ${active ? "font-semibold text-text-primary" : "text-text-secondary"}`}>{label}</div>
      </div>
    </div>
  );
}

/* ── Status Dot ── */
function StatusDot({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${ok ? "bg-accent-green" : "bg-border-subtle"}`} />
        <span className="text-[10px] text-text-muted">{ok ? "פעיל" : "ממתין"}</span>
      </div>
    </div>
  );
}

/* ── Quick Action ── */
function QuickAction({ href, label, desc, color, bg }: {
  href: string; label: string; desc: string; color: string; bg: string;
}) {
  return (
    <Link href={href}>
      <div className="card card-interactive p-3.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: bg }}>
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        </div>
        <div className="text-sm font-semibold text-text-primary">{label}</div>
        <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>
      </div>
    </Link>
  );
}
