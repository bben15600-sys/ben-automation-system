"use client";

import { useState } from "react";

type Evt = { title: string; time: string; bg: string; accent: string; cat?: string; done?: boolean };

const DAYS = [
  { letter: "א", name: "ראשון",  date: "13.04" },
  { letter: "ב", name: "שני",    date: "14.04" },
  { letter: "ג", name: "שלישי",  date: "15.04" },
  { letter: "ד", name: "רביעי",  date: "16.04", today: true },
  { letter: "ה", name: "חמישי",  date: "17.04" },
  { letter: "ו", name: "שישי",   date: "18.04" },
  { letter: "ש", name: "שבת",   date: "19.04" },
];

const WEEK: Evt[][] = [
  [
    { title: "ארוחת בוקר משפחתית", time: "09:00 – 10:00", bg: "#10B981", accent: "#34D399", cat: "משפחה", done: true },
    { title: "טיול בפארק",           time: "16:00 – 17:30", bg: "#8B5CF6", accent: "#A78BFA", cat: "בריאות" },
  ],
  [
    { title: "סטנד-אפ צוות",         time: "09:00 – 09:15", bg: "#3B82F6", accent: "#60A5FA", cat: "עבודה", done: true },
    { title: "1:1 עם המנהל",          time: "13:00 – 13:45", bg: "#3B82F6", accent: "#60A5FA", cat: "עבודה", done: true },
    { title: "אימון כושר",           time: "19:00 – 20:00", bg: "#10B981", accent: "#34D399", cat: "בריאות" },
  ],
  [
    { title: "פגישת לקוח",            time: "10:00 – 11:00", bg: "#9F3D4A", accent: "#FB7185", cat: "עבודה" },
    { title: "שיעור בקורס",           time: "20:00 – 21:30", bg: "#8B5CF6", accent: "#A78BFA", cat: "לימודים" },
  ],
  [
    { title: "פגישה עם הצוות",       time: "08:30 – 09:15", bg: "#3B82F6", accent: "#60A5FA", cat: "עבודה" },
    { title: "יום טיפול",              time: "11:00 – 12:00", bg: "#9F3D4A", accent: "#FB7185", cat: "בריאות" },
    { title: "אימון טניס",            time: "17:30 – 18:30", bg: "#10B981", accent: "#34D399", cat: "בריאות" },
    { title: "שיעור בקורס",           time: "20:00 – 21:30", bg: "#8B5CF6", accent: "#A78BFA", cat: "לימודים" },
  ],
  [
    { title: "סקירת ספרינט",          time: "10:00 – 11:30", bg: "#3B82F6", accent: "#60A5FA", cat: "עבודה" },
    { title: "ארוחת ערב עם חברים",   time: "20:00 – 22:00", bg: "#B68A1F", accent: "#FBBF24", cat: "חברתי" },
  ],
  [
    { title: "קבלת שבת",              time: "18:30 – 19:30", bg: "#8B5CF6", accent: "#A78BFA", cat: "משפחה" },
  ],
  [
    { title: "ארוחת צהריים משפחתית",  time: "13:00 – 15:00", bg: "#10B981", accent: "#34D399", cat: "משפחה" },
  ],
];

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <div className="stage">
      <section className="glass" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        <div className="card-header">
          <h2 className="card-title">לוח שבועי</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="chat-icon-btn"
              aria-label="שבוע קודם"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span style={{ fontSize: 12, color: "var(--color-ink-soft)" }}>
              13 – 19 אפריל 2025 {weekOffset !== 0 && `(${weekOffset > 0 ? "+" : ""}${weekOffset})`}
            </span>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="chat-icon-btn"
              aria-label="שבוע הבא"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        >
          {DAYS.map((d, i) => (
            <div key={d.letter} className="flex flex-col gap-3">
              <div
                className="flex flex-col items-center gap-1"
                style={{
                  padding: "8px 0",
                  borderRadius: 12,
                  background: d.today ? "rgba(167,139,250,0.12)" : "transparent",
                  border: d.today
                    ? "1px solid rgba(167,139,250,0.30)"
                    : "1px solid transparent",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--color-ink-muted)", letterSpacing: "0.08em" }}>
                  {d.name}
                </span>
                <span className="metric" style={{ fontSize: 16, color: d.today ? "#A78BFA" : "#F5F6FF" }}>
                  {d.date}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {WEEK[i].length === 0 ? (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-ink-muted)",
                      textAlign: "center",
                      padding: "12px 0",
                    }}
                  >
                    אין אירועים
                  </div>
                ) : (
                  WEEK[i].map((e, j) => (
                    <div
                      key={j}
                      className="evt-block"
                      style={
                        {
                          background: e.bg,
                          ["--evt-accent" as string]: e.accent,
                          opacity: e.done ? 0.55 : 1,
                        } as React.CSSProperties
                      }
                    >
                      <div className="flex flex-col items-end">
                        <span
                          className="evt-title-block"
                          style={e.done ? { textDecoration: "line-through" } : undefined}
                        >
                          {e.title}
                        </span>
                        <span className="evt-time-block">{e.time}</span>
                        {e.cat && (
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
                            {e.cat}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
