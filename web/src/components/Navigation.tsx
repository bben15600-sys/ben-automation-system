"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",            label: "דשבורד",  icon: "home" },
  { href: "/chat",        label: "AI",      icon: "chat" },
  { href: "/schedule",    label: "לוז",     icon: "calendar" },
  { href: "/budget",      label: "תקציב",   icon: "wallet" },
  { href: "/investments", label: "השקעות",  icon: "trending" },
];

function Ico({ name, size = 18 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const d: Record<string, React.ReactNode> = {
    home:     <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    chat:     <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    wallet:   <svg {...p}><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" /></svg>,
    trending: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  };
  return <>{d[name]}</>;
}

export default function Navigation() {
  const path = usePathname();

  return (
    <>
      {/* Desktop */}
      <header className="hidden md:flex fixed top-0 inset-x-0 h-14 z-50 items-center px-6 bg-bg-base border-b border-border">
        <div className="flex items-center gap-2.5 ml-8">
          <span className="text-sm font-bold text-text-primary tracking-tight">oslife</span>
        </div>
        <nav className="flex items-center gap-0.5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors duration-[120ms] ${
                path === n.href
                  ? "text-text-primary bg-bg-card font-medium"
                  : "text-text-muted hover:text-text-secondary"
              }`}>
              <Ico name={n.icon} size={15} />
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile top */}
      <header className="md:hidden fixed top-0 inset-x-0 h-12 z-50 flex items-center justify-between px-4 bg-bg-base border-b border-border">
        <span className="text-sm font-bold text-text-primary tracking-tight">oslife</span>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-base border-t border-border">
        <div className="flex justify-around items-center py-1.5 px-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors duration-[120ms] ${
                path === n.href ? "text-accent" : "text-text-muted"
              }`}>
              <Ico name={n.icon} size={20} />
              <span className="text-[9px] font-medium">{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
