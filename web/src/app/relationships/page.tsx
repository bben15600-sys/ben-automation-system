export default function RelationshipsPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">מעקב קשרים</h1>
        <p className="text-text-muted text-sm mt-0.5">מתי בפעם האחרונה ראית אנשים חשובים</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fdf2f8", color: "#ec4899" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">מעקב קשרים בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לראות מתי דיברת עם כל אדם חשוב ולקבל תזכורות</p>
      </div>
    </div>
  );
}
