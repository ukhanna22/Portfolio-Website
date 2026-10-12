"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setLenis } from "@/lib/scroll";
import { isFinePointer, onIdle, prefersReducedMotion } from "@/lib/utils";

/**
 * Global motion plumbing:
 *  - reveals `[data-reveal]` elements as they enter the viewport (cheap IntersectionObserver)
 *  - starts Lenis smooth scrolling, synced to the GSAP ticker, once the page is idle
 */
export function MotionRoot() {
  const pathname = usePathname();

  // Scroll reveals; re-run on route change so new pages get observed.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Lenis + GSAP ticker: wheel/trackpad devices only. Touch scrolling is already native-smooth,
  // so phones never download either library.
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    let destroyed = false;
    let cleanup = () => {};
    const cancel = onIdle(async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: false, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
      document.addEventListener("visibilitychange", onVis);
      function onVis() {
        if (document.hidden) gsap.ticker.sleep();
        else gsap.ticker.wake();
      }
      cleanup = () => {
        gsap.ticker.remove(tick);
        document.removeEventListener("visibilitychange", onVis);
        lenis.destroy();
        setLenis(null);
      };
    });
    return () => {
      destroyed = true;
      cancel();
      cleanup();
    };
  }, []);

  // Respect hash on first load / route change (e.g. /#work from a case study).
  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const t = setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }),
      60,
    );
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
