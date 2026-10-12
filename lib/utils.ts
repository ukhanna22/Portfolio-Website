export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isFinePointer() {
  return (
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Splits a string into grapheme-ish characters, preserving spaces. */
export const chars = (text: string) => Array.from(text);

export const isExternal = (href: string) => /^https?:\/\//.test(href);

export const onIdle = (fn: () => void, timeout = 1500) => {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
};
