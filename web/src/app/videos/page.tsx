export default function VideosPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">פרויקטי וידאו</h1>
        <p className="text-text-muted text-sm mt-0.5">סטטוס פרויקטים, דדליינים, ומשימות</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fff7ed", color: "#f59e0b" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">פרויקטי וידאו בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לעקוב אחרי פרויקטים, דדליינים, ומשימות</p>
      </div>
    </div>
  );
}
