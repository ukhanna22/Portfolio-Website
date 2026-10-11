"use client";

import { Download } from "@/components/ui/icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print bg-accent text-accent-ink inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium"
    >
      <Download /> Save as PDF
    </button>
  );
}
