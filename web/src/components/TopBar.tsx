"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HoloLogo from "./HoloLogo";

const TABS = [
  { href: "/", label: "דשבורד" },
  { href: "/schedule", label: "לוז" },
  { href: "/budget", label: "תקציב" },
  { href: "/investments", label: "השקעות" },
  { href: "/chat", label: "AI" },
];

export default function TopBar({ onOpenChat }: { onOpenChat?: () => void }) {
  const path = usePathname();

  return (
    <header className="topbar hidden md:flex">
      {/* Right cluster (RTL start): wordmark + logo */}
      <div className="flex items-center gap-2">
        <span
          className="font-semibold"
          style={{ fontSize: 14, color: "#F5F6FF", letterSpacing: "-0.01em" }}
        >
          oslife
        </span>
        <HoloLogo size={22} />
      </div>

      {/* Center cluster: segmented tabs */}
      <nav
        className="segtabs"
        style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        aria-label="ניווט"
      >
        {TABS.map((t) => {
          const active = path === t.href || (t.href !== "/" && path.startsWith(t.href));
          return (
            <Link key={t.href} href={t.href} className="segtab" aria-selected={active}>
              {t.label}
            </Link>
          );
        })}
      </nav>

      {/* Left cluster (RTL end): notification bell + avatar */}
      <div className="flex items-center gap-3">
        <button
          aria-label="התראות"
          className="text-[#B4B8D4] hover:text-white transition-colors"
          onClick={onOpenChat}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>
        <div
          className="rounded-full"
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.14)",
          }}
          aria-label="פרופיל"
        />
      </div>
    </header>
  );
}
