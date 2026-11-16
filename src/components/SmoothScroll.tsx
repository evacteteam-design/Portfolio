"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();

  // Fires synchronously BEFORE the browser paints — guarantees scroll
  // is at 0 before the user ever sees the new page.
  useLayoutEffect(() => {
    if (window.location.hash) return;

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // Force Lenis to start at 0 in case it read a stale scroll position
    if (!window.location.hash) lenis.scrollTo(0, { immediate: true });

    // Intercept hash-anchor clicks and route through Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== pathname || url.search !== window.location.search) return;
      const hash = url.hash;

      if (!hash || hash === "#") return;

      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      lenis.scrollTo(target);
    };

    document.addEventListener("click", handleAnchorClick);

    let hashFrameId: number | undefined;
    const scrollToHash = () => {
      if (hashFrameId !== undefined) cancelAnimationFrame(hashFrameId);
      hashFrameId = requestAnimationFrame(() => {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) lenis.scrollTo(target, { immediate: true });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      if (hashFrameId !== undefined) cancelAnimationFrame(hashFrameId);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("hashchange", scrollToHash);
      lenis.destroy();
    };
  }, [pathname, reduceMotion]);

  return <>{children}</>;
}

