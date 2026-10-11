"use client";

import { ui, useUI } from "@/lib/store";
import { Magnetic } from "@/components/effects/Magnetic";
import { Spark } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function ChatLauncher() {
  const open = useUI((s) => s.overlay === "chat");
  return (
    <div
      className={cn(
        "no-print fixed right-5 bottom-5 z-[75] transition-all duration-500 md:right-7 md:bottom-7",
        open && "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Magnetic strength={0.25}>
        <button
          type="button"
          onClick={() => ui.askChat()}
          className="group border-line-strong bg-elevated/85 text-fg hover:border-accent flex items-center gap-2.5 rounded-full border py-2.5 pr-4 pl-3.5 text-sm shadow-(--shadow) backdrop-blur-xl transition-colors"
          aria-haspopup="dialog"
        >
          <span className="bg-accent text-accent-ink grid size-6 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-90">
            <Spark width={14} height={14} />
          </span>
          <span className="sm:hidden">Ask</span>
          <span className="hidden sm:inline">Ask about Utkarsh</span>
        </button>
      </Magnetic>
    </div>
  );
}
