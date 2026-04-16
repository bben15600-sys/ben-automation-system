export default function MealsPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">תכנון ארוחות</h1>
        <p className="text-text-muted text-sm">תפריט שבועי ורשימת קניות</p>
      </header>
      <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-green/10 text-accent-green flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <h3 className="text-sm font-bold mb-1">תכנון ארוחות בקרוב</h3>
        <p className="text-text-muted text-xs max-w-xs">כשנחבר ל-Notion, תוכל לתכנן תפריט שבועי ולהפיק רשימת קניות אוטומטית</p>
      </div>
    </div>
  );
}
