"use client";

import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/scroll";
import { ArrowUp } from "@/components/ui/icons";
import { Magnetic } from "@/components/effects/Magnetic";

export function BackToTop() {
  const pathname = usePathname();
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() =>
          pathname === "/" ? scrollToId("top") : window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="label border-line text-fg hover:border-accent hover:text-accent flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors"
      >
        Back to top <ArrowUp />
      </button>
    </Magnetic>
  );
}
