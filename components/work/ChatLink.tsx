"use client";

import { ui } from "@/lib/store";
import { ArrowUpRight } from "@/components/ui/icons";

export function ChatLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => ui.askChat()}
      className="text-accent inline-flex items-center gap-1.5 text-left underline-offset-4 hover:underline"
    >
      {label} <ArrowUpRight />
    </button>
  );
}
