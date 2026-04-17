"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",            label: "דשבורד",  emoji: "⌂" },
  { href: "/chat",        label: "AI",      emoji: "◆" },
  { href: "/schedule",    label: "לוז",     emoji: "▦" },
  { href: "/budget",      label: "תקציב",   emoji: "◉" },
  { href: "/investments", label: "השקעות",  emoji: "△" },
];

export default function Navigation() {
  const path = usePathname();

  return (
    <>
      {/* Desktop */}
      <header className="hidden md:flex fixed top-0 inset-x-0 h-12 z-50 items-center px-5"
        style={{ background: "rgba(10,14,26,0.9)", borderBottom: "1px solid rgba(45,212,191,0.08)", backdropFilter: "blur(12px)" }}>
        <span className="text-sm font-bold text-white tracking-tight ml-5" style={{ textShadow: "0 0 12px rgba(45,212,191,0.3)" }}>oslife</span>
        <nav className="flex items-center gap-0.5">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="px-3 py-1.5 rounded-lg text-[13px] transition-colors duration-150"
              style={{ color: path === n.href ? "#2dd4bf" : "#475569" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile top */}
      <header className="md:hidden fixed top-0 inset-x-0 h-11 z-50 flex items-center px-4"
        style={{ background: "rgba(10,14,26,0.92)", borderBottom: "1px solid rgba(45,212,191,0.08)", backdropFilter: "blur(12px)" }}>
        <span className="text-sm font-bold text-white" style={{ textShadow: "0 0 12px rgba(45,212,191,0.3)" }}>oslife</span>
      </header>

      {/* Mobile bottom */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50"
        style={{ background: "rgba(10,14,26,0.95)", borderTop: "1px solid rgba(45,212,191,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="flex justify-around items-center py-1.5">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="flex flex-col items-center gap-0.5 py-1 px-2"
              style={{ color: path === n.href ? "#2dd4bf" : "#334155", transition: "color 150ms" }}>
              <span className="text-sm leading-none">{n.emoji}</span>
              <span className="text-[9px] font-medium">{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
