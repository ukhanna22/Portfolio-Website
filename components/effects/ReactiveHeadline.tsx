"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/utils";

/** Letters lean away from the cursor and pick up the accent as it passes. */
export function ReactiveHeadline({
  text,
  className,
  id,
}: {
  text: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !isFinePointer() || prefersReducedMotion()) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));
    let centers: { x: number; y: number }[] = [];
    let mx = -9999,
      my = -9999;
    let raf = 0;
    let active = false;

    const measure = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
      });
    };
    const frame = () => {
      raf = 0;
      const sy = window.scrollY;
      const radius = Math.max(140, window.innerWidth * 0.12);
      letters.forEach((l, i) => {
        const c = centers[i];
        const dx = c.x - mx;
        const dy = c.y - sy - my;
        const d = Math.hypot(dx, dy);
        const f = active ? Math.max(0, 1 - d / radius) : 0;
        const e = f * f * (3 - 2 * f);
        l.style.transform = e
          ? `translate3d(${((dx / (d || 1)) * e * 14).toFixed(1)}px, ${(-e * 18).toFixed(1)}px, 0) rotate(${((dx / radius) * e * -8).toFixed(1)}deg)`
          : "";
        l.style.color = e > 0.35 ? "var(--accent)" : "";
        l.style.fontStyle = e > 0.6 ? "italic" : "";
      });
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      active = false;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = text.split(" ");
  return (
    <h2 ref={ref} id={id} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(w).map((c, ci) => (
            <span
              key={ci}
              data-l
              className="inline-block transition-[color,transform] duration-300 ease-out"
            >
              {c}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </h2>
  );
}
