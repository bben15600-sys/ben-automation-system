"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",            label: "דשבורד",  emoji: "⌂" },
  { href: "/schedule",    label: "לוז",     emoji: "▦" },
  { href: "/chat",        label: "AI",      emoji: "◆", special: true },
  { href: "/budget",      label: "תקציב",   emoji: "◉" },
  { href: "/investments", label: "השקעות",  emoji: "△" },
];

export default function Navigation() {
  const path = usePathname();

  return (
    <>
      {/* Desktop: floating glass pill */}
      <header className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-0.5 px-2 py-1.5 glass-pill">
        <span className="text-sm font-bold text-white tracking-tight mx-3"
          style={{ textShadow: "0 0 16px rgba(45,212,191,0.3)" }}>
          oslife
        </span>
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200"
            style={{
              color: path === n.href ? "#fff" : "rgba(255,255,255,0.4)",
              background: path === n.href ? "rgba(45,212,191,0.15)" : "transparent",
            }}>
            {n.label}
          </Link>
        ))}
      </header>

      {/* Mobile top: floating glass bar */}
      <header className="md:hidden fixed top-3 left-4 right-4 z-50 glass-pill px-4 py-2.5 flex items-center">
        <span className="text-sm font-bold text-white"
          style={{ textShadow: "0 0 16px rgba(45,212,191,0.3)" }}>
          oslife
        </span>
      </header>

      {/* Mobile bottom: floating glass dock */}
      <nav className="md:hidden fixed bottom-3 left-5 right-5 z-50">
        <div className="glass-pill flex justify-around items-center py-2 px-2 mx-auto max-w-sm">
          {NAV.map(n => {
            const active = path === n.href;
            if (n.special) {
              return (
                <Link key={n.href} href={n.href}
                  className="w-11 h-11 -mt-5 rounded-full flex items-center justify-center btn-press"
                  style={{
                    background: "linear-gradient(135deg, #0f766e, #2dd4bf)",
                    boxShadow: "0 4px 20px rgba(45,212,191,0.4)",
                    border: "2px solid rgba(255,255,255,0.15)",
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </Link>
              );
            }
            return (
              <Link key={n.href} href={n.href}
                className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all duration-200"
                style={{
                  color: active ? "#2dd4bf" : "rgba(255,255,255,0.3)",
                  background: active ? "rgba(45,212,191,0.08)" : "transparent",
                }}>
                <span className="text-sm leading-none">{n.emoji}</span>
                <span className="text-[9px] font-medium">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
