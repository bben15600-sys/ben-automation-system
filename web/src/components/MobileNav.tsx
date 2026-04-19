"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HOME_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-6h-4v6a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V10z" />
  </svg>
);
const CAL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);
const AI_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const BUDGET_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M16 12h3" />
    <path d="M3 9c0-1.5 1-3 3-3h11" />
  </svg>
);
const INV_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </svg>
);

const ITEMS = [
  { href: "/", label: "דשבורד", icon: HOME_ICON },
  { href: "/schedule", label: "לוז", icon: CAL_ICON },
  { href: "/chat", label: "AI", icon: AI_ICON, raised: true },
  { href: "/budget", label: "תקציב", icon: BUDGET_ICON },
  { href: "/investments", label: "השקעות", icon: INV_ICON },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav className="mobile-nav md:hidden" aria-label="ניווט ראשי">
      {ITEMS.map((it) => {
        const active = path === it.href || (it.href !== "/" && path.startsWith(it.href));
        if (it.raised) {
          return (
            <Link
              key={it.href}
              href={it.href}
              className="mobile-nav-ai"
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
            >
              {it.icon}
            </Link>
          );
        }
        return (
          <Link
            key={it.href}
            href={it.href}
            className="mobile-nav-item"
            aria-current={active ? "page" : undefined}
          >
            {it.icon}
            <span className="mobile-nav-item-label">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
