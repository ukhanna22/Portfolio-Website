"use client";

import { useEffect } from "react";
import { ui, useUI } from "@/lib/store";
import { Moon, Sun } from "@/components/ui/icons";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useUI((s) => s.theme);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    if (current !== ui.get().theme) ui.set({ theme: current });
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => ui.setTheme(next)}
      className={
        className ??
        "border-line text-muted hover:border-line-strong hover:text-fg grid size-9 place-items-center rounded-full border transition-colors"
      }
      aria-label={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
