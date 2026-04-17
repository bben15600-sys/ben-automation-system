"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",            label: "דשבורד",  icon: "⌂" },
  { href: "/chat",        label: "AI",      icon: "◆" },
  { href: "/schedule",    label: "לוז",     icon: "▦" },
  { href: "/budget",      label: "תקציב",   icon: "◉" },
  { href: "/investments", label: "השקעות",  icon: "△" },
];

export default function Navigation() {
  const path = usePathname();

  return (
    <>
      {/* Desktop */}
      <header className="hidden md:flex fixed top-0 inset-x-0 h-14 z-50 items-center px-6"
        style={{ background: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-sm font-bold text-text-primary tracking-tight ml-6">oslife</span>
        <nav className="flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`px-3 py-1.5 rounded-lg text-[13px] transition-colors duration-[120ms] ${
                path === n.href
                  ? "text-text-primary font-medium"
                  : "text-text-muted hover:text-text-secondary"
              }`}
              style={path === n.href ? { color: "#64ffda" } : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile top */}
      <header className="md:hidden fixed top-0 inset-x-0 h-12 z-50 flex items-center px-4"
        style={{ background: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-sm font-bold text-text-primary tracking-tight">oslife</span>
      </header>

      {/* Mobile bottom */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 py-1"
        style={{ background: "#1a1a2e", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex justify-around items-center">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="flex flex-col items-center gap-0.5 py-2 px-3"
              style={{ color: path === n.href ? "#64ffda" : "#5a5a72", transition: "color 120ms" }}>
              <span className="text-base leading-none">{n.icon}</span>
              <span className="text-[9px] font-medium">{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
