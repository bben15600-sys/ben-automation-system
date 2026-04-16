import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">שלום, בן</h1>
        <p className="text-text-muted text-sm mt-0.5">הנה הסיכום שלך להיום</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <MetricCard
          label="אירועים היום"
          value="0"
          change="+2 מאתמול"
          color="#3b82f6"
          bg="#eff6ff"
          icon="calendar"
        />
        <MetricCard
          label="תקציב חודשי"
          value="--"
          change="ממתין לנתונים"
          color="#10b981"
          bg="#ecfdf5"
          icon="wallet"
        />
        <MetricCard
          label="תיק השקעות"
          value="--"
          change="ממתין לנתונים"
          color="#8b5cf6"
          bg="#f5f3ff"
          icon="trending"
        />
        <MetricCard
          label="יעדים שבועיים"
          value="0/5"
          change="60% הושלם"
          color="#f59e0b"
          bg="#fffbeb"
          icon="target"
        />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* AI Chat CTA - spans 2 cols */}
        <Link href="/chat" className="md:col-span-2">
          <div className="card card-interactive p-5 h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold mb-0.5">שאל את oslife AI</h3>
                <p className="text-text-muted text-sm">צ׳אט חכם עם ניתוב אוטומטי בין מודלים — DeepSeek, Claude, Gemini ועוד</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted flex-shrink-0 rotate-180">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </Link>

        {/* System Status */}
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-text-muted mb-4">סטטוס מערכות</h3>
          <div className="space-y-3">
            <StatusRow label="צ׳אט AI" status="active" />
            <StatusRow label="לוז שבועי" status="pending" />
            <StatusRow label="תקציב" status="pending" />
            <StatusRow label="השקעות" status="pending" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">גישה מהירה</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ActionCard href="/schedule" label="לוז שבועי" desc="אירועים ומשימות" color="#3b82f6" bg="#eff6ff" />
          <ActionCard href="/budget" label="תקציב" desc="הכנסות והוצאות" color="#10b981" bg="#ecfdf5" />
          <ActionCard href="/investments" label="השקעות" desc="תיק ומניות" color="#8b5cf6" bg="#f5f3ff" />
          <ActionCard href="/vr" label="Enjoy VR" desc="אירועים והכנסות" color="#ec4899" bg="#fdf2f8" />
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">פעילות אחרונה</h3>
            <span className="text-xs text-text-muted">היום</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-bg-input flex items-center justify-center mb-3 text-text-muted">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-text-muted text-sm">כשנחבר ל-Notion, תראה כאן פעילות</p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">יעדים שבועיים</h3>
            <span className="text-xs text-accent-indigo font-medium">0%</span>
          </div>
          <div className="space-y-3">
            <GoalRow label="אימוני כדורסל" progress={0} target="3 פעמים" />
            <GoalRow label="זמן עם ליהי" progress={0} target="4 ימים" />
            <GoalRow label="למידת קורס" progress={0} target="5 שעות" />
            <GoalRow label="אירועי VR" progress={0} target="2 אירועים" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, color, bg, icon }: {
  label: string; value: string; change: string; color: string; bg: string; icon: string;
}) {
  return (
    <div className="metric-card" style={{ background: bg, color }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <IconSmall name={icon} />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-70" style={{ color }}>{label}</div>
      <div className="text-[10px] mt-1.5 opacity-50" style={{ color }}>{change}</div>
    </div>
  );
}

function ActionCard({ href, label, desc, color, bg }: {
  href: string; label: string; desc: string; color: string; bg: string;
}) {
  return (
    <Link href={href}>
      <div className="card card-interactive p-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: bg, color }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="text-sm font-semibold text-text-primary">{label}</div>
        <div className="text-xs text-text-muted mt-0.5">{desc}</div>
      </div>
    </Link>
  );
}

function StatusRow({ label, status }: { label: string; status: "active" | "pending" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-accent-green" : "bg-border-subtle"}`} />
        <span className="text-xs text-text-muted">{status === "active" ? "פעיל" : "ממתין"}</span>
      </div>
    </div>
  );
}

function GoalRow({ label, progress, target }: { label: string; progress: number; target: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-xs text-text-muted">{target}</span>
      </div>
      <div className="w-full h-2 bg-bg-input rounded-full overflow-hidden">
        <div className="h-full bg-accent-indigo rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function IconSmall({ name }: { name: string }) {
  const props = { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactNode> = {
    calendar: <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    wallet: <svg {...props}><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /></svg>,
    trending: <svg {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    target: <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  };
  return <>{icons[name] || null}</>;
}
