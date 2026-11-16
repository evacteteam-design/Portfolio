"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(end);
  const { ref, inView } = useReveal<HTMLSpanElement>(0.3);
  const hasAnimated = useRef(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || hasAnimated.current || reduceMotion) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    let frameId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = duration <= 0 ? 1 : Math.min(elapsed / duration, 1);
      // Ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * end));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frameId);
      hasAnimated.current = false;
    };
  }, [inView, end, duration, reduceMotion]);

  return (
    <span ref={ref}>
      <span className="sr-only">{prefix}{end}{suffix}</span>
      <span aria-hidden="true">{prefix}{reduceMotion ? end : count}{suffix}</span>
    </span>
  );
}
