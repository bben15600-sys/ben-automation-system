"use client";

const CATEGORIES = [
  { label: "מזון וקניות", spent: 4200, budget: 5500, color: "#60A5FA", chip: "chip-sky" },
  { label: "תחבורה",      spent: 1800, budget: 2200, color: "#34D399", chip: "chip-mint" },
  { label: "בילויים",     spent: 2100, budget: 1800, color: "#FB7185", chip: "chip-coral" },
  { label: "חשבונות",     spent: 3600, budget: 4000, color: "#A78BFA", chip: "chip-lavender" },
  { label: "בריאות",      spent: 700,  budget: 1500, color: "#FBBF24", chip: "chip-amber" },
];

const TX = [
  { name: "סופר רמי לוי",    cat: "מזון",     amt: -384,   date: "היום, 14:22", color: "#60A5FA" },
  { name: "משכורת — חברה",  cat: "הכנסה",    amt: 18500,  date: "אתמול",       color: "#34D399" },
  { name: "Netflix",         cat: "מנויים",   amt: -56,    date: "אתמול",       color: "#FB7185" },
  { name: "תחנת דלק פז",    cat: "תחבורה",  amt: -290,   date: "12.04",        color: "#A78BFA" },
  { name: "רסטורנט מצדה",   cat: "בילויים", amt: -420,   date: "11.04",        color: "#FBBF24" },
  { name: "BuyMe — מתנה",   cat: "בילויים", amt: -200,   date: "10.04",        color: "#FBBF24" },
  { name: "שופרסל דיל",      cat: "מזון",     amt: -612,   date: "09.04",        color: "#60A5FA" },
];

export default function BudgetPage() {
  const total = CATEGORIES.reduce((s, c) => s + c.spent, 0);
  const budgetSum = CATEGORIES.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="stage flex flex-col gap-5">
      {/* Header card */}
      <section className="glass" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        <div className="flex flex-col items-center gap-2 text-center" style={{ padding: "12px 0" }}>
          <span className="label-caps">הוצאות החודש</span>
          <div className="metric glow-coral" style={{ fontSize: 56 }}>
            <span className="currency">₪{total.toLocaleString()}</span>
          </div>
          <span style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
            מתוך <span className="currency">₪{budgetSum.toLocaleString()}</span> תקציב חודשי
          </span>
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              height: 6,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 999,
              overflow: "hidden",
              marginTop: 12,
            }}
          >
            <div
              style={{
                width: `${Math.min((total / budgetSum) * 100, 100)}%`,
                height: "100%",
                background: total > budgetSum ? "#FB7185" : "#A78BFA",
                boxShadow: `0 0 10px ${total > budgetSum ? "#FB7185" : "#A78BFA"}`,
                transition: "width 800ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="glass" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
        <div className="card-header">
          <h2 className="card-title">קטגוריות</h2>
          <span className="label-caps">אפריל 2025</span>
        </div>
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((c) => {
            const pct = (c.spent / c.budget) * 100;
            const over = c.spent > c.budget;
            return (
              <div key={c.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>{c.label}</span>
                  <span
                    className="metric"
                    style={{ fontSize: 12, color: over ? "#FB7185" : "#F5F6FF" }}
                  >
                    <span className="currency">₪{c.spent.toLocaleString()}</span>
                    <span style={{ color: "var(--color-ink-muted)" }}>
                      {" / "}
                      <span className="currency">₪{c.budget.toLocaleString()}</span>
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      height: "100%",
                      background: c.color,
                      boxShadow: `0 0 8px ${c.color}`,
                      borderRadius: 999,
                      transition: "width 800ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transactions */}
      <section className="glass" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
        <div className="card-header">
          <h2 className="card-title">עסקאות אחרונות</h2>
          <span style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>{TX.length} עסקאות</span>
        </div>
        <div className="flex flex-col">
          {TX.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{
                padding: "12px 0",
                borderBottom: i === TX.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="chip"
                style={{
                  background: `${t.color}22`,
                  color: t.color,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {t.cat[0]}
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <span style={{ fontSize: 13, fontWeight: 600, color: "#F5F6FF" }}>{t.name}</span>
                <span style={{ fontSize: 11, color: "var(--color-ink-muted)" }}>
                  {t.cat} · {t.date}
                </span>
              </div>
              <span
                className="metric"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.amt > 0 ? "#34D399" : "#F5F6FF",
                }}
              >
                <span className="currency">
                  {t.amt > 0 ? "+" : "−"}₪{Math.abs(t.amt).toLocaleString()}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
