"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useUI } from "@/lib/store";

const CommandPalette = dynamic(() => import("@/components/palette/CommandPalette"), { ssr: false });
const Terminal = dynamic(() => import("@/components/terminal/Terminal"), { ssr: false });
const ChatPanel = dynamic(() => import("@/components/chat/ChatPanel"), { ssr: false });

/** Heavy widgets load on first use only, then stay mounted so they can animate out. */
export function Overlays() {
  const overlay = useUI((s) => s.overlay);
  const [loaded, setLoaded] = useState({ palette: false, terminal: false, chat: false });

  if (overlay && overlay !== "menu" && !loaded[overlay])
    setLoaded((l) => ({ ...l, [overlay]: true }));

  return (
    <>
      {loaded.palette && <CommandPalette />}
      {loaded.terminal && <Terminal />}
      {loaded.chat && <ChatPanel />}
    </>
  );
}
