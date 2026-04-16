export default function VRPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Enjoy VR</h1>
        <p className="text-text-muted text-sm mt-0.5">אירועים, הכנסות, וחשבוניות</p>
      </div>
      <div className="card p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fdf2f8", color: "#ec4899" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">ניהול VR בקרוב</h3>
        <p className="text-text-muted text-sm max-w-sm">כשנחבר ל-Notion, תוכל לנהל אירועי VR, הכנסות, ולהפיק חשבוניות</p>
      </div>
    </div>
  );
}
