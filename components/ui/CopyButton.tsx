"use client";

import type { ReactNode } from "react";
import { ui } from "@/lib/store";

export async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
    ui.toast(message);
  } catch {
    ui.toast("Couldn't reach the clipboard. Select and copy manually.");
  }
}

export function CopyButton({
  text,
  message,
  children,
  className,
  label,
}: {
  text: string;
  message: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => copyText(text, message)}
    >
      {children}
    </button>
  );
}
