"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DashboardData } from "@/lib/notion";
import Donut from "@/components/Donut";

const MOCK: DashboardData = {
  budget: { total: 8_420, trend: [1200, 1800, 2300, 3200, 4100, 5600, 8420] },
  investments: { total: 182_500, change: "+1.2%", trend: [178000, 179500, 180200, 181500, 181800, 182100, 182500] },
  todayEvents: {
    count: 4,
    items: [
      { time: "08:30", label: "פגישה עם הצוות",    color: "#60A5FA" },
      { time: "11:00", label: "יום טיפול",           color: "#FB7185" },
      { time: "17:30", label: "אימון טניס",          color: "#34D399" },
      { time: "20:00", label: "שיעור בקורס",         color: "#A78BFA" },
    ],
  },
  vrEvents: { count: 3 },
  goals: [
    { label: "כדורסל", done: 2, target: 3, color: "#34D399" },
    { label: "ליהי",   done: 1, target: 3, color: "#FB7185" },
    { label: "קורס",   done: 2, target: 4, color: "#A78BFA" },
    { label: "טניס",   done: 1, target: 2, color: "#FBBF24" },
  ],
  weekActivity: { tasks: [4, 6, 3, 7, 5, 2, 1], events: [2, 3, 1, 4, 2, 1, 0] },
};

const PAGES = [
  { id: "overview", label: "סקירה" },
  { id: "schedule", label: "לוז" },
  { id: "goals",    label: "יעדים" },
  { id: "finance",  label: "כספים" },
];

export default function DashboardPage() {
  const [d, setD] = useState<DashboardData>(MOCK);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && !res.mock) setD(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goToPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  const goalsDone = d.goals.filter((g) => g.done >= g.target).length;
  const goalsTotal = d.goals.length || 1;
  const goalsPct = Math.round((goalsDone / goalsTotal) * 100);

  return (
    <div className="stage" style={{ minHeight: "calc(100vh - 180px)" }}>
      <div className="swipe-dots" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goToPage(i)}
            className={`swipe-dot${active === i ? " swipe-dot-active" : ""}`}
            aria-label={p.label}
          />
        ))}
      </div>

      <div
        ref={trackRef}
        dir="ltr"
        className="swipe-track"
        style={{ ["--i" as string]: 1 } as React.CSSProperties}
      >
        {/* ── Page 1: Overview ───────────────────────────────────── */}
        <section dir="rtl" className="swipe-page flex flex-col items-center justify-center text-center">
          <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="display" style={{ fontSize: 44, color: "#fff", marginTop: 4, marginBottom: 28 }}>
            {greeting}, בן
          </h1>

          <div className="flex items-center gap-8" style={{ marginBottom: 32 }}>
            <div>
              <div className="metric glow-lavender" style={{ fontSize: 52 }}>{d.todayEvents.count}</div>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)", marginTop: 4 }}>אירועים היום</p>
            </div>
            <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.08)" }} />
            <div>
              <div className="metric" style={{ fontSize: 52, color: "#fff" }}>{goalsDone}<span style={{ color: "var(--color-ink-muted)" }}>/{goalsTotal}</span></div>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)", marginTop: 4 }}>יעדים השבוע</p>
            </div>
          </div>

          <div className="flex gap-8" style={{ maxWidth: 480, width: "100%", justifyContent: "center" }}>
            <div className="text-center">
              <div className="metric" style={{ fontSize: 22, color: "#fff" }}>
                <span className="currency">₪{d.investments.total.toLocaleString()}</span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--color-ink-muted)", marginTop: 2 }}>תיק השקעות</p>
            </div>
            <div className="text-center">
              <div className="metric" style={{ fontSize: 22, color: "#fff" }}>
                <span className="currency">₪{d.budget.total.toLocaleString()}</span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--color-ink-muted)", marginTop: 2 }}>הוצאות החודש</p>
            </div>
          </div>

          <p className="text-xs" style={{ color: "var(--color-ink-muted)", marginTop: 40 }}>החלק הצידה ←</p>
        </section>

        {/* ── Page 2: Schedule ──────────────────────────────────── */}
        <section dir="rtl" className="swipe-page overflow-y-auto">
          <h2 className="display" style={{ fontSize: 28, marginTop: 8 }}>לוז היום</h2>
          <p className="text-xs" style={{ color: "var(--color-ink-muted)", marginBottom: 24 }}>
            {d.todayEvents.count} אירועים
          </p>
          <div className="flex flex-col">
            {d.todayEvents.items.map((ev, i, arr) => (
              <div key={i} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center" style={{ width: 48 }}>
                  <span className="metric" style={{ fontSize: 12, color: "var(--color-ink-soft)" }}>{ev.time}</span>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 my-2" style={{ background: "rgba(167,139,250,0.18)" }} />
                  )}
                </div>
                <div className="flex-1 pb-5">
                  <div
                    className="glass"
                    style={{
                      padding: "12px 16px",
                      borderInlineStart: `3px solid ${ev.color || "#A78BFA"}`,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{ev.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Page 3: Goals ──────────────────────────────────────── */}
        <section dir="rtl" className="swipe-page overflow-y-auto">
          <h2 className="display" style={{ fontSize: 28, marginTop: 8 }}>יעדים שבועיים</h2>
          <p className="text-xs" style={{ color: "var(--color-ink-muted)", marginBottom: 28 }}>
            {goalsDone} מתוך {goalsTotal} הושלמו
          </p>
          <div className="flex justify-center" style={{ marginBottom: 32 }}>
            <Donut percent={goalsPct} color="#A78BFA" centerText={`${goalsPct}%`} size={140} stroke={10} />
          </div>
          <div className="flex flex-col gap-4">
            {d.goals.map((g, i) => {
              const pct = Math.min((g.done / g.target) * 100, 100);
              const complete = g.done >= g.target;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: complete ? `${g.color}22` : "transparent",
                      border: `1.5px solid ${complete ? g.color : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {complete && <span style={{ color: g.color, fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{g.label}</span>
                      <span className="metric" style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>{g.done}/{g.target}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: g.color,
                          boxShadow: `0 0 8px ${g.color}`,
                          borderRadius: 999,
                          transition: "width 800ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Page 4: Finance ──────────────────────────────────── */}
        <section dir="rtl" className="swipe-page flex flex-col justify-center items-center text-center">
          <p className="label-caps" style={{ marginBottom: 12 }}>תיק השקעות</p>
          <div className="metric glow-mint" style={{ fontSize: 60, marginBottom: 6 }}>
            <span className="currency">₪{d.investments.total.toLocaleString()}</span>
          </div>
          <div className="metric" style={{ fontSize: 18, color: "var(--color-ink-soft)", marginBottom: 40 }}>
            <span className="currency">≈ ${Math.round(d.investments.total / 3.65).toLocaleString()}</span>
          </div>

          <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="flex justify-between" style={{ fontSize: 13 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>הוצאות החודש</span>
              <span className="metric" style={{ color: "#fff" }}>
                <span className="currency">₪{d.budget.total.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>הפקדה חודשית</span>
              <span className="metric" style={{ color: "#fff" }}>
                <span className="currency">₪1,500</span>
              </span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>VR אירועים</span>
              <span className="metric" style={{ color: "#fff" }}>{d.vrEvents.count}</span>
            </div>
          </div>

          <div className="flex gap-3" style={{ marginTop: 32 }}>
            <Link
              href="/budget"
              className="press"
              style={{
                padding: "10px 22px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: "rgba(167,139,250,0.10)",
                border: "1px solid rgba(167,139,250,0.22)",
                color: "#F5F6FF",
                textDecoration: "none",
              }}
            >
              תקציב
            </Link>
            <Link
              href="/investments"
              className="press"
              style={{
                padding: "10px 22px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: "rgba(52,211,153,0.10)",
                border: "1px solid rgba(52,211,153,0.22)",
                color: "#F5F6FF",
                textDecoration: "none",
              }}
            >
              השקעות
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
