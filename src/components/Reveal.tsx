"use client";

import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const { ref, inView } = useReveal();

  const dirClass = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  }[direction];

  const delayClass = delay > 0 ? `delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`${dirClass} ${delayClass} ${inView ? "in-view" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
