export default function BudgetPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">תקציב</h1>
        <p className="text-text-muted text-sm mt-0.5">הכנסות, הוצאות, ומעקב חיסכון</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#ecfdf5", color: "#10b981" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">מעקב תקציב בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לעקוב אחרי הכנסות, הוצאות ולראות גרפים חודשיים</p>
      </div>
    </div>
  );
}
