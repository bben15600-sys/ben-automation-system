"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",            icon: "home",        label: "ראשי" },
  { href: "/chat",        icon: "chat",        label: "צ׳אט" },
  { href: "/schedule",    icon: "calendar",    label: "לוז" },
  { href: "/budget",      icon: "wallet",      label: "תקציב" },
  { href: "/investments", icon: "trending",    label: "השקעות" },
  { href: "/vr",          icon: "vr",          label: "VR" },
  { href: "/videos",      icon: "video",       label: "וידאו" },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#8b5cf6" : "currentColor";
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    chat: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    wallet: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    trending: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    vr: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
      </svg>
    ),
    video: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" />
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed right-0 top-0 h-full w-[72px] flex-col items-center py-5 gap-1 glass-strong z-50">
        <Link href="/" className="mb-4 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-sm font-black transition-transform group-hover:scale-110">
            OS
          </div>
        </Link>

        <div className="w-8 h-px bg-border-subtle mb-2" />

        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all duration-200 w-14 group ${
                active
                  ? "bg-accent-purple/10 text-accent-purple"
                  : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
              }`}
            >
              {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full bg-accent-purple" />
              )}
              <NavIcon name={item.icon} active={active} />
              <span className="text-[9px] font-medium leading-tight opacity-70">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-1.5 px-1">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all ${
                  active ? "text-accent-purple" : "text-text-muted"
                }`}
              >
                <NavIcon name={item.icon} active={active} />
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
