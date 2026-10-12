"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Desktop: pins the section and converts vertical scroll into horizontal travel (GSAP ScrollTrigger).
 * Without JS, on small screens, or with reduced motion it degrades to a native layout.
 */
export function HorizontalGallery({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let revert = () => {};
    let started = false;
    let cancelled = false;

    // GSAP is only fetched once the viewport is wide enough to pin.
    const start = async () => {
      if (started || !desktop.matches) return;
      started = true;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !pin.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        el.dataset.pinned = "true";
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(el, { clearProps: "transform" });
          delete el.dataset.pinned;
        };
      });
      // Fonts can change widths after first layout.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      revert = () => mm.revert();
    };

    void start();
    desktop.addEventListener("change", start);
    return () => {
      cancelled = true;
      desktop.removeEventListener("change", start);
      revert();
    };
  }, []);

  // Drag to travel: moves the page (when pinned) or the strip (when native).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let down = false;
    let lastX = 0;
    let moved = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = 0;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      if (moved < 4) return;
      el.dataset.dragging = "true";
      if (el.dataset.pinned) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(lenis.scroll - dx * 1.4, { immediate: true });
        else window.scrollBy(0, -dx * 1.4);
      } else {
        el.scrollLeft -= dx;
      }
    };
    const onUp = () => {
      down = false;
      setTimeout(() => delete el.dataset.dragging, 0);
    };
    // Swallow the click that ends a drag so cards don't open.
    const onClick = (e: MouseEvent) => {
      if (el.dataset.dragging || moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div
      ref={pin}
      className="relative lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden"
    >
      {header}
      <div
        ref={track}
        data-cursor="Drag"
        className="no-scrollbar container-x mt-12 grid gap-5 select-none sm:grid-cols-2 lg:mt-10 lg:flex lg:w-auto lg:max-w-none lg:gap-6 lg:overflow-x-auto lg:px-[max(var(--gutter),calc((100vw-80rem)/2+var(--gutter)))] lg:pr-[20vw] lg:data-pinned:overflow-visible"
      >
        {children}
      </div>
    </div>
  );
}
