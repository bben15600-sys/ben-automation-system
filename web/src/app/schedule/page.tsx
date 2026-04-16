export default function SchedulePage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">לוז שבועי</h1>
          <p className="text-text-muted text-sm mt-0.5">אירועים, משימות, ותזכורות</p>
        </div>
      </div>
      <EmptyState
        color="#3b82f6"
        bg="#eff6ff"
        title="הלוז השבועי בקרוב כאן"
        description="כשנחבר ל-Notion, הלוז יוצג כאן עם כל האירועים, המשימות והתזכורות שלך"
      />
    </div>
  );
}

function EmptyState({ color, bg, title, description }: { color: string; bg: string; title: string; description: string }) {
  return (
    <div className="card p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg, color }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-text-muted text-sm max-w-sm">{description}</p>
    </div>
  );
}
