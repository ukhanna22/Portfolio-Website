import { isTodo, SHOW_TODOS } from "@/content/todo";

/** Renders text, or a highlighted placeholder for unfinished content (dev only). */
export function Text({
  children,
  as: Tag = "span",
  className,
}: {
  children: string;
  as?: "span" | "p" | "li";
  className?: string;
}) {
  if (isTodo(children)) {
    if (!SHOW_TODOS) return null;
    return <Tag className={`todo ${className ?? ""}`}>{children}</Tag>;
  }
  return <Tag className={className}>{children}</Tag>;
}
