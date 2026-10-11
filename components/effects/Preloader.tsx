"use client";

import { useEffect, useRef } from "react";

const DURATION = 1200;

/**
 * Once-per-session intro: counts 000 → 100 while the field assembles, then splits open.
 * Whether it shows is decided before paint by the inline script in the root layout
 * (`html.preload`), so the hero underneath is already painted for LCP.
 */
export function Preloader() {
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("preload")) return;
    let raf = 0;
    let done = false;
    const start = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem("uk-preloaded", "1");
      } catch {}
      if (count.current) count.current.textContent = "100";
      html.classList.add("preload-open", "reveal");
      window.setTimeout(() => html.classList.remove("preload", "preload-open"), 950);
      window.removeEventListener("keydown", finish);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      if (count.current)
        count.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 120);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("keydown", finish);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", finish);
    };
  }, []);

  const skip = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  return (
    <div className="preloader" aria-hidden onClick={skip}>
      <div className="preloader__half preloader__half--top" />
      <div className="preloader__half preloader__half--bottom" />
      <div className="preloader__inner">
        <div className="flex w-[min(20rem,70vw)] flex-col gap-4">
          <div className="flex items-end justify-between">
            <span className="label text-muted">Sampling latent space</span>
            <span ref={count} className="text-fg font-mono text-4xl tabular-nums">
              000
            </span>
          </div>
          <span className="bg-line block h-px w-full">
            <span
              ref={bar}
              className="bg-accent block h-full origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="label text-muted/70">Click or press any key to skip</span>
        </div>
      </div>
    </div>
  );
}
