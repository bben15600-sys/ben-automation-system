import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      {/* Hero */}
      <header className="pt-4 pb-8">
        <p className="text-text-muted text-sm mb-1">שלום, בן</p>
        <h1 className="text-3xl font-extrabold gradient-text inline-block">oslife</h1>
        <p className="text-text-secondary text-sm mt-1">מערכת ההפעלה של החיים שלך</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={<CalendarIcon />}
          value="0"
          label="אירועים היום"
          accent="var(--accent-blue)"
          href="/schedule"
        />
        <StatCard
          icon={<WalletIcon />}
          value="--"
          label="תקציב חודשי"
          accent="var(--accent-green)"
          href="/budget"
        />
        <StatCard
          icon={<TrendingIcon />}
          value="--"
          label="תיק השקעות"
          accent="var(--accent-purple)"
          href="/investments"
        />
        <StatCard
          icon={<TargetIcon />}
          value="0/5"
          label="יעדים השבוע"
          accent="var(--accent-orange)"
          href="/"
        />
      </div>

      {/* AI Assistant CTA */}
      <Link href="/chat" className="block mb-6">
        <div className="glow-card glass rounded-2xl p-5 transition-all hover:bg-bg-card-hover group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-0.5">שאל את oslife</h3>
              <p className="text-text-muted text-xs">שאל כל שאלה — AI חכם ינתב אותך למודל הטוב ביותר</p>
            </div>
            <span className="text-text-muted group-hover:text-text-secondary transition-colors text-lg">&#8592;</span>
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-text-muted mb-3 px-1">פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <QuickAction href="/schedule" icon={<CalendarIcon />} label="הלוז שלי" color="var(--accent-blue)" />
          <QuickAction href="/budget" icon={<WalletIcon />} label="מצב תקציב" color="var(--accent-green)" />
          <QuickAction href="/investments" icon={<TrendingIcon />} label="השקעות" color="var(--accent-purple)" />
          <QuickAction href="/vr" icon={<VrIcon />} label="אירועי VR" color="var(--accent-pink)" />
        </div>
      </div>

      {/* Status Section */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-xs font-semibold text-text-muted mb-4">סטטוס מערכות</h2>
        <div className="space-y-3">
          <SystemStatus label="צ׳אט AI" status="online" detail="OpenRouter" />
          <SystemStatus label="לוז שבועי" status="placeholder" detail="ממתין ל-Notion" />
          <SystemStatus label="תקציב" status="placeholder" detail="ממתין ל-Notion" />
          <SystemStatus label="השקעות" status="placeholder" detail="ממתין ל-Notion" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, accent, href }: {
  icon: React.ReactNode; value: string; label: string; accent: string; href: string;
}) {
  return (
    <Link href={href}>
      <div className="glass rounded-2xl p-4 transition-all hover:bg-bg-card-hover group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}>
            {icon}
          </div>
        </div>
        <div className="text-xl font-bold" style={{ color: accent }}>{value}</div>
        <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
      </div>
    </Link>
  );
}

function QuickAction({ href, icon, label, color }: {
  href: string; icon: React.ReactNode; label: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className="glass rounded-xl p-3.5 flex items-center gap-3 transition-all hover:bg-bg-card-hover group">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
          {icon}
        </div>
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
      </div>
    </Link>
  );
}

function SystemStatus({ label, status, detail }: {
  label: string; status: "online" | "placeholder"; detail: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`w-1.5 h-1.5 rounded-full ${
          status === "online" ? "bg-accent-green animate-pulse-soft" : "bg-text-muted"
        }`} />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <span className="text-xs text-text-muted">{detail}</span>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}
function TrendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function VrIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
    </svg>
  );
}
