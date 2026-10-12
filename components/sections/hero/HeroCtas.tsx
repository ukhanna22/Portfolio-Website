"use client";

import { Magnetic } from "@/components/effects/Magnetic";
import { ArrowRight } from "@/components/ui/icons";
import { scrollToId } from "@/lib/scroll";
import { ui } from "@/lib/store";
import { useModKey } from "@/lib/platform";

export function HeroCtas() {
  const mod = useModKey();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic>
        <a
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("work");
          }}
          className="group bg-accent text-accent-ink inline-flex h-12 items-center gap-3 rounded-full pr-5 pl-6 text-[0.95rem] font-medium transition-[gap] duration-500 ease-out hover:gap-4"
        >
          Explore my work
          <ArrowRight className="transition-transform duration-500 group-hover:translate-x-0.5" />
        </a>
      </Magnetic>
      <Magnetic>
        <button
          type="button"
          onClick={() => ui.askChat()}
          className="border-line-strong text-fg hover:border-accent inline-flex h-12 items-center gap-3 rounded-full border px-5 text-[0.95rem] backdrop-blur-sm transition-colors"
        >
          Ask my portfolio
          <kbd className="label border-line text-muted rounded-md border px-1.5 py-0.5">
            {mod} K
          </kbd>
        </button>
      </Magnetic>
    </div>
  );
}
