"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",            label: "דשבורד",   icon: "home" },
  { href: "/chat",        label: "צ׳אט AI",  icon: "chat" },
  { href: "/schedule",    label: "לוז",      icon: "calendar" },
  { href: "/budget",      label: "תקציב",    icon: "wallet" },
  { href: "/investments", label: "השקעות",   icon: "trending" },
  { href: "/vr",          label: "VR",       icon: "vr" },
  { href: "/videos",      label: "וידאו",    icon: "video" },
];

const MOBILE_NAV = NAV_ITEMS.slice(0, 5);

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const s = `${size}`;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactNode> = {
    home: <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    chat: <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    calendar: <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    wallet: <svg {...props}><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" /></svg>,
    trending: <svg {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    vr: <svg {...props}><path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" /></svg>,
    video: <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: top bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-bg-nav border-b border-border-subtle z-50 items-center px-6">
        <div className="flex items-center gap-3 ml-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white text-xs font-bold">
            OS
          </div>
          <span className="text-base font-bold text-text-primary">oslife</span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-accent-indigo/10 text-accent-indigo"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover"
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Mobile: top bar (logo only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-bg-nav border-b border-border-subtle z-50 flex items-center px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-white text-[10px] font-bold">
            OS
          </div>
          <span className="text-sm font-bold text-text-primary">oslife</span>
        </div>
      </header>

      {/* Mobile: bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-nav border-t border-border-subtle z-50">
        <div className="flex justify-around items-center py-2 px-1">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  active ? "text-accent-indigo" : "text-text-muted"
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
