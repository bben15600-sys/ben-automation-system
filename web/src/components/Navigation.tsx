"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",            label: "דשבורד",  icon: "home" },
  { href: "/chat",        label: "AI",      icon: "chat" },
  { href: "/schedule",    label: "לוז",     icon: "calendar" },
  { href: "/budget",      label: "תקציב",   icon: "wallet" },
  { href: "/investments", label: "השקעות",  icon: "trending" },
  { href: "/vr",          label: "VR",      icon: "vr" },
  { href: "/videos",      label: "וידאו",   icon: "video" },
];

const MOBILE_NAV = NAV_ITEMS.slice(0, 5);

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactNode> = {
    home:     <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    chat:     <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    wallet:   <svg {...p}><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" /></svg>,
    trending: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    vr:       <svg {...p}><path d="M2 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-4l-2 2-2-2H4a2 2 0 01-2-2v-4z" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" /></svg>,
    video:    <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-14 z-50 items-center px-6"
        style={{
          background: "rgba(6,10,20,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 ml-8 flex-shrink-0">
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 0 16px rgba(99,102,241,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: -0.5 }}>OS</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e8eeff", letterSpacing: -0.3 }}>oslife</span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10,
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? "#e8eeff" : "rgba(160,172,210,0.55)",
                  background: active ? "rgba(99,102,241,0.15)" : "transparent",
                  border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}>
                <Icon name={item.icon} size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 mr-auto" style={{ fontSize: 11, color: "rgba(16,185,129,0.8)" }}>
          <div className="live-dot" style={{
            width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0
          }} />
          <span>live</span>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4"
        style={{
          background: "rgba(6,10,20,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 0 12px rgba(99,102,241,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>OS</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e8eeff" }}>oslife</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 10, color: "rgba(16,185,129,0.8)" }}>
          <div className="live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          <span>live</span>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(6,10,20,0.92)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
        <div className="flex justify-around items-center py-2 px-1">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 3, padding: "6px 12px", borderRadius: 10,
                  color: active ? "#6366f1" : "rgba(160,172,210,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}>
                <Icon name={item.icon} size={20} />
                <span style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
