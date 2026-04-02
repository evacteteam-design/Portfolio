"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { caseStudies } from "@/content/caseStudies";

const skills = [
  { category: "Design", items: ["Figma", "Prototyping", "Design Systems", "Wireframing", "User Flows", "Interaction Design"] },
  { category: "Research", items: ["User Interviews", "Usability Testing", "Heuristic Evaluation", "Journey Mapping", "A/B Testing"] },
  { category: "Tools", items: ["Figma", "FigJam", "Miro", "Jira", "Confluence", "Notion", "VS Code"] },
  { category: "Technical", items: ["HTML/CSS", "React", "TypeScript", "Accessibility (WCAG)", "Responsive Design"] },
];

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-14 pt-24 pb-32 overflow-hidden"
      >
        {/* Hero background image with parallax */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.35}px) scale(1.1)`,
            transition: "transform 0.05s linear",
          }}
        >
          <Image
            src="/images/hero-bg.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Dark overlay — fades on scroll */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom, rgba(10,10,20,${0.52 + scrollY * 0.0004}) 0%, rgba(10,10,20,${0.38 + scrollY * 0.0004}) 60%, rgba(10,10,20,${0.7 + scrollY * 0.0004}) 100%)`,
          }}
        />

        {/* Subtle mouse-follow light spot */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-[1800ms] ease-out"
          style={{
            background: `radial-gradient(ellipse 55% 45% at ${mounted ? mousePos.x * 100 : 50}% ${mounted ? mousePos.y * 100 : 50}%, rgba(75,163,227,0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        <div className="relative z-10 max-w-[var(--max-w)] mx-auto w-full">
          <div className="hero-anim-1 mb-6">
            <span className="inline-block text-[11px] font-medium tracking-[0.14em] uppercase text-white/60 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm bg-white/5">
              UX/UI Designer · AI-First Product Thinker
            </span>
          </div>

          <h1 className="hero-anim-2 font-[family-name:var(--font-instrument-serif)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em] text-white mb-8 max-w-4xl">
            I design enterprise
            <br />
            experiences that users{" "}
            <em className="italic text-[#4BA3E3]">trust.</em>
          </h1>

          <p className="hero-anim-3 text-lg md:text-xl text-white/55 font-light leading-relaxed max-w-xl mb-12">
            Product designer specializing in complex internal tools, scheduling systems, and high-stakes enterprise interfaces where clarity directly impacts outcomes.
          </p>

          <div className="hero-anim-4 flex flex-wrap gap-4">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[var(--black)] text-[13px] font-medium tracking-[0.04em] rounded-full hover:bg-white/90 transition-colors duration-300"
            >
              View work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="mailto:akhil.vang@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white/80 text-[13px] font-medium tracking-[0.04em] rounded-full hover:border-white/50 hover:text-white backdrop-blur-sm bg-white/5 transition-all duration-300"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-anim-5 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED WORK
          ═══════════════════════════════════════ */}
      <section id="work" className="py-24 md:py-32 px-6 md:px-14 bg-[var(--surface)]">
        <div className="max-w-[var(--max-w)] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--accent)] tracking-[0.14em]">
                SELECTED WORK
              </span>
              <span className="block w-8 h-px bg-[var(--accent)]/30" />
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-16">
              Case studies in{" "}
              <em className="italic text-[var(--accent)]">enterprise UX.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}

            {/* Coming soon placeholder */}
            <Reveal delay={2}>
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-white/50 flex items-center justify-center min-h-[500px]">
                <div className="text-center px-8">
                  <p className="font-[family-name:var(--font-instrument-serif)] text-2xl text-[var(--ink3)]/40 italic mb-3">
                    More coming soon
                  </p>
                  <p className="text-[13px] text-[var(--ink3)]/60">
                    Additional case studies are being prepared.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT
          ═══════════════════════════════════════ */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-14 border-t border-[var(--border)]">
        <div className="max-w-[var(--max-w)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <Reveal>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--accent)] tracking-[0.14em]">
                    ABOUT
                  </span>
                  <span className="block w-8 h-px bg-[var(--accent)]/30" />
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-8">
                  Designing for systems
                  <br />
                  people <em className="italic text-[var(--accent)]">depend on.</em>
                </h2>
              </Reveal>

              <Reveal delay={2}>
                <div className="space-y-5 text-[16px] text-[var(--ink2)] leading-[1.85]">
                  <p>
                    I&apos;m Akhil Vanga — an AI-first product designer who specializes in enterprise UX for
                    high-stakes internal tools. My work at United Airlines involved designing scheduling
                    systems used by 10,000+ pilots daily, where every interface decision has real operational
                    and financial consequences.
                  </p>
                  <p>
                    I believe the best enterprise design isn&apos;t about visual flair — it&apos;s about building
                    <strong className="text-[var(--ink)] font-semibold"> systems that earn trust</strong> through
                    clarity, consistency, and respect for expert users&apos; workflows.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Skills column */}
            <div className="lg:col-span-2">
              <Reveal delay={3}>
                <div className="space-y-8">
                  {skills.map((group) => (
                    <div key={group.category}>
                      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--ink3)] mb-3">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="text-[12px] px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink2)] hover:bg-white hover:border-[var(--ink3)] transition-all duration-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT
          ═══════════════════════════════════════ */}
      <section
        id="contact"
        className="relative py-24 md:py-32 px-6 md:px-14 overflow-hidden"
        style={{ background: "var(--accent-dark)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-[var(--max-w)] mx-auto text-center">
          <Reveal>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-white mb-6">
              Let&apos;s build something
              <br />
              <em className="italic text-[var(--accent-light)]">people trust.</em>
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <p className="text-lg text-white/50 font-light max-w-lg mx-auto mb-10 leading-relaxed">
              Currently open to senior product design roles and consulting engagements
              in enterprise UX, AI-driven tools, and complex system design.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:akhil.vang@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--accent-dark)] text-[13px] font-semibold tracking-[0.04em] rounded-full hover:bg-white/90 transition-colors duration-300"
              >
                akhil.vang@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/akvanga/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/70 text-[13px] font-medium tracking-[0.04em] rounded-full hover:border-white/40 hover:text-white transition-all duration-300"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


