export default function InvestmentsPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">השקעות</h1>
        <p className="text-text-muted text-sm">תיק השקעות, מניות, והקצאה</p>
      </header>
      <EmptyState
        icon={<TrendingIcon />}
        title="תיק ההשקעות בקרוב"
        description="כשנחבר ל-Notion, תוכל לראות את התיק שלך, שינויים יומיים, והקצאה"
      />
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      <p className="text-text-muted text-xs max-w-xs">{description}</p>
    </div>
  );
}

function TrendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
