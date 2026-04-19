"use client";

import Sparkline from "@/components/Sparkline";

const HOLDINGS = [
  {
    name: "S&P 500",
    symbol: "VOO",
    alloc: 60,
    value: 109_500,
    changePct: 0.85,
    changeColor: "#34D399",
    spark: "#34D399",
    data: [100, 102, 101, 104, 103, 106, 108, 107, 110, 112, 114, 118],
  },
  {
    name: "NVDA",
    symbol: "NVDA",
    alloc: 30,
    value: 54_750,
    changePct: -1.2,
    changeColor: "#FB7185",
    spark: "#FBBF24",
    data: [22, 20, 24, 23, 26, 25, 22, 20, 23, 21, 24, 22],
  },
  {
    name: "מזומן",
    symbol: "Cash",
    alloc: 10,
    value: 18_250,
    changePct: 0.1,
    changeColor: "#A78BFA",
    spark: "#A78BFA",
    data: [10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16],
  },
];

export default function InvestmentsPage() {
  const total = HOLDINGS.reduce((s, h) => s + h.value, 0);
  const usdRate = 3.65;

  return (
    <div className="stage flex flex-col gap-5">
      {/* Portfolio value */}
      <section className="glass" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        <div className="flex flex-col items-center gap-2 text-center" style={{ padding: "12px 0" }}>
          <span className="label-caps">שווי תיק כולל</span>
          <div className="metric glow-mint" style={{ fontSize: 56 }}>
            <span className="currency">₪{total.toLocaleString()}</span>
          </div>
          <div className="metric" style={{ fontSize: 16, color: "var(--color-ink-soft)" }}>
            <span className="currency">≈ ${Math.round(total / usdRate).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
            <span
              className="metric"
              style={{
                fontSize: 13,
                color: "#34D399",
                padding: "3px 10px",
                background: "rgba(52,211,153,0.12)",
                borderRadius: 999,
              }}
            >
              <span className="currency">+1.2%</span>
            </span>
            <span style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>מפתיחת המסחר</span>
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section className="glass" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
        <div className="card-header">
          <h2 className="card-title">החזקות</h2>
          <span className="label-caps">{HOLDINGS.length} נכסים</span>
        </div>

        <div className="flex flex-col gap-4">
          {HOLDINGS.map((h) => (
            <div key={h.symbol} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F6FF" }}>{h.name}</span>
                    <span
                      className="metric"
                      style={{
                        fontSize: 10,
                        color: "var(--color-ink-muted)",
                        padding: "1px 6px",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                      }}
                    >
                      {h.symbol}
                    </span>
                  </div>
                  <span
                    className="metric"
                    style={{ fontSize: 12, color: h.changeColor }}
                  >
                    <span className="currency">
                      {h.changePct > 0 ? "+" : ""}
                      {h.changePct}%
                    </span>
                  </span>
                </div>
                <Sparkline data={h.data} color={h.spark} width={100} height={32} />
                <div className="flex flex-col items-start" style={{ minWidth: 120 }}>
                  <span className="metric" style={{ fontSize: 14, color: "#F5F6FF" }}>
                    <span className="currency">₪{h.value.toLocaleString()}</span>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-ink-muted)" }}>
                    {h.alloc}% מהתיק
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${h.alloc}%`,
                    height: "100%",
                    background: h.spark,
                    boxShadow: `0 0 6px ${h.spark}`,
                    borderRadius: 999,
                    transition: "width 800ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly deposit */}
      <section className="glass" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
        <div className="card-header">
          <h2 className="card-title">הפקדה חודשית</h2>
          <span className="label-caps">אוטומטי</span>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <div
            className="glass-inset"
            style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span className="label-caps">סכום</span>
            <span className="metric" style={{ fontSize: 22, color: "#F5F6FF" }}>
              <span className="currency">₪1,500</span>
            </span>
          </div>
          <div
            className="glass-inset"
            style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span className="label-caps">יעד</span>
            <span style={{ fontSize: 14, color: "#F5F6FF" }}>S&P 500 (70%) + NVDA (30%)</span>
          </div>
          <div
            className="glass-inset"
            style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span className="label-caps">הפקדה הבאה</span>
            <span className="metric" style={{ fontSize: 14, color: "#F5F6FF" }}>01.05.2025</span>
          </div>
        </div>
      </section>
    </div>
  );
}
