"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const heroEl = document.querySelector('[data-hero]');
      setIsHero(heroEl !== null && window.scrollY < heroEl.getBoundingClientRect().height - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const showLight = !scrolled || isHero;
  const links = [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Design System", href: "/design-system" },
    { label: "AI Lab", href: "/ai-lab" },
    { label: "Contact", href: "/#contact" },
  ];

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

      <div className="relative hidden items-center gap-4 sm:flex sm:gap-6 md:gap-8">
        {links.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 sm:text-[11px] sm:tracking-[0.1em] ${
              showLight
                ? "text-white/75 hover:text-white"
                : "text-[var(--ink3)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        className={`relative grid h-10 w-10 place-items-center rounded-lg transition-colors sm:hidden ${
          showLight ? "text-white hover:bg-white/10" : "text-[var(--ink)] hover:bg-black/5"
        }`}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className={`fixed inset-x-0 top-14 z-50 grid gap-1 border-b p-3 shadow-xl sm:hidden ${
            showLight
              ? "border-white/10 bg-[#0B1929]/95 text-white backdrop-blur-xl"
              : "border-[var(--border)] bg-[var(--white)]/98 text-[var(--ink)] backdrop-blur-xl"
          }`}
        >
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
