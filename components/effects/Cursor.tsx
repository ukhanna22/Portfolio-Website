"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/utils";

/**
 * Dot + lagging ring. Grows over links; shows a label over elements with
 * `data-cursor="View"` etc. Only on fine pointers; keyboard focus is untouched.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    const html = document.documentElement;
    const reduce = prefersReducedMotion();
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100;
    let raf = 0;
    let visible = false;

    const setState = (state: string) => {
      if (ring.current) ring.current.dataset.state = state;
    };

    const loop = () => {
      const k = reduce ? 1 : 0.16;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        html.classList.add("has-cursor");
        if (dot.current) dot.current.dataset.state = "";
        setState("");
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        if (label.current) label.current.textContent = labelled.dataset.cursor ?? "";
        setState("label");
        return;
      }
      if (t?.closest("a, button, [role='button'], label, summary")) setState("link");
      else setState("");
    };

    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.dataset.state = "hidden";
      setState("hidden");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      html.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="no-print">
      <div ref={dot} className="cursor-dot" data-state="hidden" />
      <div ref={ring} className="cursor-ring" data-state="hidden">
        <span ref={label} className="cursor-ring__label" />
      </div>
    </div>
  );
}
