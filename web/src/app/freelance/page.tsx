export default function FreelancePage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">פרילנס</h1>
        <p className="text-text-muted text-sm mt-0.5">לקוחות, פרויקטים, תשלומים, וחשבוניות</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fefce8", color: "#ca8a04" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">ניהול פרילנס בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לנהל לקוחות, פרויקטים, ולהפיק חשבוניות</p>
      </div>
    </div>
  );
}
