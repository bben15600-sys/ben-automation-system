"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import ChatDrawer from "./ChatDrawer";
import Fab from "./Fab";
import AITooltip from "./AITooltip";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const open = () => setChatOpen(true);
  const close = () => setChatOpen(false);

  return (
    <>
      <TopBar onOpenChat={open} />
      <main
        className="mx-auto w-full"
        style={{ maxWidth: 1280, padding: "20px 24px 96px" }}
      >
        {children}
      </main>
      <MobileNav />
      {!chatOpen && <AITooltip onOpen={open} />}
      <Fab onClick={open} />
      <ChatDrawer open={chatOpen} onClose={close} />
    </>
  );
}
