"use client";

import { useUI } from "@/lib/store";

export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-[85] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="label border-line-strong bg-elevated text-fg rounded-full border px-4 py-2.5 shadow-(--shadow)"
          style={{ animation: "panel-in 0.4s var(--ease-out) both" }}
        >
          <span className="text-accent mr-2">●</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
