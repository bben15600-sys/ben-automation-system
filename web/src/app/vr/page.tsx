export default function VRPage() {
  return (
    <div className="p-5 pb-24 md:pb-6 max-w-3xl mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-xl font-bold mb-1">Enjoy VR</h1>
        <p className="text-text-muted text-sm">אירועים, הכנסות, וחשבוניות</p>
      </header>
      <div className="glass rounded-2xl p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-pink/10 text-accent-pink flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
          </svg>
        </div>
        <h3 className="text-sm font-bold mb-1">ניהול VR בקרוב</h3>
        <p className="text-text-muted text-xs max-w-xs">כשנחבר ל-Notion, תוכל לנהל אירועי VR, הכנסות, ולהפיק חשבוניות</p>
      </div>
    </div>
  );
}
