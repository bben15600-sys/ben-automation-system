import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6 pb-24 md:pb-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-4">
          ☀️ בוקר טוב, בן
        </div>
        <h1 className="text-4xl font-black bg-gradient-to-l from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          oslife
        </h1>
        <p className="text-text-muted text-sm mt-2">מערכת ההפעלה של החיים שלך</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon="📅" value="—" label="אירועים היום" color="#7c3aed" />
        <StatCard icon="💰" value="—" label="מצב תקציב" color="#22c55e" />
        <StatCard icon="📈" value="—" label="תיק השקעות" color="#60a5fa" />
        <StatCard icon="🏀" value="—" label="אימונים השבוע" color="#fb923c" />
      </div>

      <div className="bg-bg-card rounded-2xl p-4 border border-border-subtle mb-6">
        <h2 className="text-sm font-bold mb-3">⚡ פעולות מהירות</h2>
        <div className="grid grid-cols-2 gap-2">
          <QuickAction href="/chat" icon="💬" label="שאל את הבוט" />
          <QuickAction href="/schedule" icon="📅" label="הלוז שלי" />
          <QuickAction href="/budget" icon="💰" label="תקציב" />
          <QuickAction href="/investments" icon="📈" label="השקעות" />
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl p-4 border border-border-subtle">
        <h2 className="text-sm font-bold mb-3">🎯 יעדים שבועיים</h2>
        <p className="text-text-muted text-xs">יתחבר לנתונים מ-Notion בקרוב...</p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-border-subtle text-center">
      <div className="text-3xl font-black" style={{ color }}>{value}</div>
      <div className="text-lg my-1">{icon}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-bg-hover/50 hover:bg-bg-hover transition-colors text-sm"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
