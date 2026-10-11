/**
 * Placeholders for facts that haven't been supplied yet. They render (highlighted) in
 * `next dev`, and are stripped from production builds unless NEXT_PUBLIC_SHOW_TODOS=1.
 * `npm run todos` lists every remaining one.
 */
export type Todo = `[TODO: ${string}]`;

export const todo = (note: string): Todo => `[TODO: ${note}]`;

export const isTodo = (value: unknown): value is Todo =>
  typeof value === "string" && value.startsWith("[TODO:");

export const SHOW_TODOS =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_TODOS === "1";

/** Drop TODO entries from a list when placeholders are hidden. */
export function visible<T>(items: readonly T[]): T[] {
  return items.filter((item) => SHOW_TODOS || !isTodo(item));
}

/** Returns the value, or undefined if it's a TODO that should be hidden. */
export function shown<T>(value: T | Todo | undefined | null): T | Todo | undefined {
  if (value == null) return undefined;
  if (isTodo(value) && !SHOW_TODOS) return undefined;
  return value;
}
