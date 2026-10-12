import { section, type SectionId } from "@/content/sections";
import { cn } from "@/lib/utils";

export function SectionLabel({ id, className }: { id: SectionId; className?: string }) {
  const s = section(id);
  return (
    <p className={cn("label text-muted flex items-center gap-3", className)} data-reveal>
      <span className="text-accent">{s.number}</span>
      <span aria-hidden className="bg-line-strong h-px w-8" />
      <span>{s.label}</span>
    </p>
  );
}
