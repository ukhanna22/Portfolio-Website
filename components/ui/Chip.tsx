import { cn } from "@/lib/utils";

export function Chip({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.7rem] leading-none tracking-wide transition-colors duration-300",
        active ? "border-accent bg-accent-soft text-fg" : "border-line text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
