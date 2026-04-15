"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",            icon: "🏠", label: "דשבורד" },
  { href: "/schedule",    icon: "📅", label: "לוז שבועי" },
  { href: "/budget",      icon: "💰", label: "תקציב" },
  { href: "/investments", icon: "📈", label: "השקעות" },
  { href: "/vr",          icon: "🥽", label: "VR" },
  { href: "/videos",      icon: "🎬", label: "וידאו" },
  { href: "/chat",        icon: "💬", label: "צ׳אט" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: fixed right sidebar */}
      <nav className="hidden md:flex fixed right-0 top-0 h-full w-20 flex-col items-center py-6 gap-2 bg-bg-card border-l border-border-subtle z-50">
        <div className="text-2xl font-black mb-4 bg-gradient-to-l from-accent-purple to-accent-pink bg-clip-text text-transparent">
          B
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-center transition-all duration-200 w-16 ${
                active
                  ? "bg-accent-purple/20 text-accent-purple"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile: bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 bg-bg-card border-t border-border-subtle z-50 backdrop-blur-lg">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
                active
                  ? "text-accent-purple"
                  : "text-text-muted"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
