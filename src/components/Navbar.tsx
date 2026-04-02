"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Check if we're still in the dark hero area
      const heroEl = document.querySelector('[data-hero]');
      if (heroEl) {
        setIsHero(window.scrollY < heroEl.getBoundingClientRect().height - 80);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showLight = !scrolled || isHero;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 px-4 sm:px-6 md:px-14 flex items-center justify-between transition-all duration-500 ${
        scrolled && !isHero
          ? "bg-[var(--white)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm shadow-[var(--accent-light)]/5"
          : "bg-transparent"
      }`}
    >
      {/* Gradient behind nav — full top strip + stronger top-right corner */}
      {!scrolled && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(5,8,18,0.72) 0%, rgba(5,8,18,0.30) 70%, transparent 100%)",
            }}
          />
          {/* Extra darkening on the right side where sky is bright */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to left, rgba(5,8,18,0.55) 0%, transparent 50%)",
            }}
          />
        </>
      )}

      <Link
        href="/"
        className={`relative text-sm font-medium tracking-tight transition-all duration-300 hover:opacity-60 ${
          showLight ? "text-white/90" : "text-[var(--ink)]"
        }`}
      >
        Akhil Vanga
      </Link>

      <div className="relative flex items-center gap-4 sm:gap-8">
        {["Work", "About", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/#${item.toLowerCase()}`}
            className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] sm:tracking-[0.1em] uppercase transition-colors duration-300 ${
              showLight
                ? "text-white/75 hover:text-white"
                : "text-[var(--ink3)] hover:text-[var(--ink)]"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}
