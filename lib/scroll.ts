"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

/** Scrolls to a section id (or the top), through Lenis when it's running. */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: reduce ? 0 : 1.4 });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  if (id !== "top") history.replaceState(null, "", `#${id}`);
  else history.replaceState(null, "", window.location.pathname);
}
