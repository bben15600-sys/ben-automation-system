export default function InvestmentsPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">השקעות</h1>
        <p className="text-text-muted text-sm mt-0.5">תיק השקעות, מניות, והקצאה</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">תיק ההשקעות בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לראות את התיק שלך, שינויים יומיים, והקצאה</p>
      </div>
    </div>
  );
}
