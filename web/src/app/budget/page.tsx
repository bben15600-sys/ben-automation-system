export default function BudgetPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">תקציב</h1>
        <p className="text-text-muted text-sm">הכנסות, הוצאות, ומעקב חיסכון</p>
      </header>
      <EmptyState
        icon={<WalletIcon />}
        title="מעקב תקציב בקרוב"
        description="כשנחבר ל-Notion, תוכל לעקוב אחרי הכנסות, הוצאות ולראות גרפים חודשיים"
      />
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-accent-green/10 text-accent-green flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      <p className="text-text-muted text-xs max-w-xs">{description}</p>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}
