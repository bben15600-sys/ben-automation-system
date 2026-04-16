export default function VideosPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">פרויקטי וידאו</h1>
        <p className="text-text-muted text-sm">סטטוס פרויקטים, דדליינים, ומשימות</p>
      </header>
      <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold mb-1">פרויקטי וידאו בקרוב</h3>
        <p className="text-text-muted text-xs max-w-xs">כשנחבר ל-Notion, תוכל לעקוב אחרי פרויקטים, דדליינים, ומשימות</p>
      </div>
    </div>
  );
}
