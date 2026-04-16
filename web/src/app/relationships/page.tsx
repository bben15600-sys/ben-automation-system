export default function RelationshipsPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">מעקב קשרים</h1>
        <p className="text-text-muted text-sm">מתי בפעם האחרונה ראית אנשים חשובים</p>
      </header>
      <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-pink/10 text-accent-pink flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <h3 className="text-sm font-bold mb-1">מעקב קשרים בקרוב</h3>
        <p className="text-text-muted text-xs max-w-xs">כשנחבר ל-Notion, תוכל לראות מתי דיברת עם כל אדם חשוב ולקבל תזכורות</p>
      </div>
    </div>
  );
}
