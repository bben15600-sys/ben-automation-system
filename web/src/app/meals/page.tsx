export default function MealsPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">תכנון ארוחות</h1>
        <p className="text-text-muted text-sm mt-0.5">תפריט שבועי ורשימת קניות</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#ecfdf5", color: "#14b8a6" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">תכנון ארוחות בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לתכנן תפריט שבועי ולהפיק רשימת קניות אוטומטית</p>
      </div>
    </div>
  );
}
