"use client";

import { useEffect } from "react";
import { fieldBus, ui } from "@/lib/store";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/** ⌘K / Ctrl+K palette, ` terminal, Esc to close, and the Konami code. */
export function KeyboardShortcuts() {
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ui.toggle("palette");
        return;
      }
      if (e.key === "Escape" && ui.get().overlay) {
        ui.close();
        return;
      }
      if (e.key === "`" && !isTyping(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        ui.toggle("terminal");
        return;
      }
      if (isTyping(e.target)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        fieldBus.emit({ type: "burst", shape: "uk" });
        ui.toast("↑↑↓↓←→←→BA · latent space unlocked");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
