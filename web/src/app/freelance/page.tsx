export default function FreelancePage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">פרילנס</h1>
        <p className="text-text-muted text-sm">לקוחות, פרויקטים, תשלומים, וחשבוניות</p>
      </header>
      <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        </div>
        <h3 className="text-sm font-bold mb-1">ניהול פרילנס בקרוב</h3>
        <p className="text-text-muted text-xs max-w-xs">כשנחבר ל-Notion, תוכל לנהל לקוחות, פרויקטים, ולהפיק חשבוניות</p>
      </div>
    </div>
  );
}
