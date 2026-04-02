"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { FAQ } from "@/components/FAQ";
import { caseStudies } from "@/content/caseStudies";

/* ─── Capabilities data matching Framer ─── */
const capabilities = [
  {
    number: "1",
    title: "AI-Integrated Workflows",
    items: [
      "Architected agentic AI workflows that fundamentally redefined how design teams synchronize with front-end development.",
      "Pioneered the use of \"vibe coding\" to translate natural language intent into production-ready UI components, radically compressing sprint cycles.",
      "Integrated LLM-based prompt engineering into the core of the design process to automate user research synthesis and documentation.",
      "Operationalized AI at scale by embedding real-time synchronization pipelines directly into high-stakes, enterprise product workstreams.",
    ],
  },
  {
    number: "2",
    title: "Strategic Design Leadership",
    items: [
      "Orchestrated design strategy for mission-critical enterprise platforms across diverse sectors, including aviation, healthcare, and government.",
      "Aligned design outcomes with business OKRs to ensure that every creative decision directly drives measurable operational efficiency.",
      "Advocated for design-as-strategy at the executive level, successfully shifting product roadmaps through data-backed research and usability insights.",
      "Led cross-functional teams through complex delivery cycles, ensuring seamless alignment between stakeholders, researchers, and developers.",
    ],
  },
  {
    number: "3",
    title: "Scalable Systems Architecture",
    items: [
      "Spearheaded the development of unified design systems that standardize UI patterns and significantly reduce inconsistency across large-scale applications.",
      "Engineered high-performance component libraries utilizing advanced Figma architecture, tokens, and variables to ensure maintainability at enterprise scale.",
      "Modernized legacy technical environments by leading large-scale platform migrations from outdated desktop frameworks to modern React and Angular architectures.",
      "Institutionalized design standards and governance models that have been adopted by agencies and teams beyond the immediate product scope.",
    ],
  },
  {
    number: "4",
    title: "Evidence-Based UX Mastery",
    items: [
      "Institutionalized a culture of research by running comprehensive, mixed-methods studies that turn user friction points into actionable design improvements.",
      "Championed universal accessibility by embedding WCAG 2.1 AA compliance into the foundation of all front-end development and design workflows.",
      "Optimized the end-to-end user experience through rigorous application of the HEART framework and continuous A/B testing cycles.",
      "Delivered proven, quantifiable results—consistently achieving double-digit improvements in user satisfaction, error reduction, and operational efficiency.",
    ],
  },
];

interface TrailParticle {
  x: number; y: number;
  radius: number; maxRadius: number;
  opacity: number;
  type: "drop" | "ring";
  vx: number; vy: number;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const moveCountRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // Only trail while mouse is inside the hero
      if (e.clientY > rect.bottom || e.clientY < rect.top) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Droplet
      particlesRef.current.push({
        x, y,
        radius: 1.5 + Math.random() * 2,
        maxRadius: 3 + Math.random() * 3,
        opacity: 0.45 + Math.random() * 0.2,
        type: "drop",
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7 - 0.4,
      });

      // Ring every 5 moves
      moveCountRef.current++;
      if (moveCountRef.current % 5 === 0) {
        particlesRef.current.push({
          x, y,
          radius: 3,
          maxRadius: 40,
          opacity: 0.28,
          type: "ring",
          vx: 0, vy: 0,
        });
      }

      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.01);
          for (const p of particlesRef.current) {
            if (p.type === "drop") {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(160, 220, 255, ${p.opacity})`;
              ctx.fill();
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.04; // gravity drip
              p.radius = Math.min(p.radius + 0.04, p.maxRadius);
              p.opacity *= 0.93;
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(160, 220, 255, ${p.opacity})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
              p.radius += (p.maxRadius - p.radius) * 0.07;
              p.opacity *= 0.91;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(drawCanvas);
    };

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(drawCanvas);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — Dark, dramatic, matching Framer
          ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        data-hero
        className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 pt-20 sm:pt-24 pb-20 sm:pb-32 overflow-hidden"
      >
        {/* Hero background image with parallax */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.35}px) scale(1.12)`,
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

        {/* Cinematic overlay: dark left where text lives, fades right so landscape shows */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.72) 38%, rgba(5,8,18,0.30) 62%, rgba(5,8,18,0.10) 100%)` }} />
        {/* Bottom vignette — taller so stats in mid-section are covered */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.60) 28%, rgba(5,8,18,0.20) 50%, transparent 65%)` }} />

        {/* Mouse-follow glow */}
        {/* Water trail canvas */}
        {mounted && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        <div className="relative z-10 max-w-6xl mx-auto w-full">

          {/* Top row: badge */}
          <div className="hero-anim-1 flex items-center mb-6 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase text-white/80 border border-white/25 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for work
            </span>
          </div>

          {/* Display headline */}
          <h1
            className="hero-anim-2 font-[family-name:var(--font-instrument-serif)] leading-[0.88] tracking-[-0.03em] text-white mb-6 sm:mb-10"
            style={{
              fontSize: "clamp(2.4rem, 10.5vw, 9.5rem)",
              textShadow: "0 2px 24px rgba(5,8,18,0.5)",
            }}
          >
            Enterprise UX,<br />
            <em className="italic hero-accent-glow" style={{ color: "var(--accent-light)" }}>Powered</em>{" "}
            by AI.
          </h1>

          {/* Animated horizontal rule */}
          <div className="hero-rule w-full h-px bg-white/25 mb-6 sm:mb-10" />

          {/* Two-column: identity+CTAs left / stats right */}
          <div className="hero-anim-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

            {/* Left — name, title, CTAs */}
            <div className="flex flex-col gap-7">
              <div>
                <p className="text-white text-[22px] sm:text-[28px] md:text-[32px] font-semibold leading-tight tracking-tight mb-1">
                  Akhil Vanga
                </p>
                <p className="text-[12px] sm:text-[15px] font-light tracking-[0.06em] sm:tracking-[0.08em] uppercase" style={{ color: "var(--accent-light)" }}>
                  AI-First Product Designer&nbsp;&nbsp;·&nbsp;&nbsp;US-Based
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-[var(--black)] text-[12px] sm:text-[13px] font-semibold tracking-[0.04em] rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]"
                >
                  View my work
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/20 text-white text-[12px] sm:text-[13px] font-medium tracking-[0.04em] rounded-full hover:bg-white/20 hover:border-white/35 transition-all duration-300 backdrop-blur-sm"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right — stat numbers */}
            <div className="flex gap-5 sm:gap-8 lg:gap-12 shrink-0">
              {[
                { end: 12, suffix: "+", label: "Years\nExperience" },
                { end: 82, suffix: "+", label: "Enterprise\nProjects" },
                { end: 3, suffix: "", label: "Industries\nServed" },
              ].map(({ end, suffix, label }) => (
                <div key={label} className="text-right">
                  <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.4rem,3vw,2.4rem)] leading-none text-white mb-1.5"
                    style={{ textShadow: "0 2px 12px rgba(5,8,18,0.8)" }}>
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-[9px] font-medium tracking-[0.12em] uppercase text-white/45 whitespace-pre-line leading-[1.6]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-anim-4 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT I CAN DO FOR YOU — Capability tabs
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-14 border-t border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30" style={{ background: 'radial-gradient(circle, rgba(75,163,227,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-[var(--max-w)] mx-auto relative z-10">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--accent-light)] mb-4">
              What I Can Do For You
            </p>
          </Reveal>

          <Reveal delay={1}>
            <p className="text-[14px] sm:text-[16px] text-[var(--ink2)] leading-[1.85] max-w-2xl mb-10 sm:mb-16">
              I am an AI-First Product Designer with over 12 years of experience. I specialize
              in building high-fidelity, high-impact digital products across aviation, healthcare,
              and government by merging strategic UX with agentic AI workflows and front-end development.
            </p>
          </Reveal>

          {/* Tabs + content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Tab selectors */}
            <div className="lg:col-span-4 space-y-0">
              {capabilities.map((cap, i) => (
                <Reveal key={i} delay={Math.min(i + 1, 4)}>
                  <button
                    onClick={() => setActiveCapability(i)}
                    className={`w-full text-left px-6 py-5 border-l-2 transition-all duration-300 group ${
                      activeCapability === i
                        ? "border-[var(--accent-light)] bg-[var(--accent-light)]/8"
                        : "border-transparent hover:border-[var(--border)] hover:bg-[var(--accent-light)]/5"
                    }`}
                  >
                    <span className={`block text-[15px] font-semibold transition-colors ${
                      activeCapability === i ? "text-[var(--black)]" : "text-[var(--ink2)] group-hover:text-[var(--black)]"
                    }`}>
                      {cap.title}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>

            {/* Active content */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                <h3 className="font-[family-name:var(--font-instrument-serif)] text-[22px] sm:text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.02em] text-[var(--black)] mb-6 sm:mb-8 uppercase">
                  {capabilities[activeCapability].title}
                </h3>
                <div className="space-y-5">
                  {capabilities[activeCapability].items.map((item, i) => (
                    <div
                      key={`${activeCapability}-${i}`}
                      className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-lg border border-[var(--border)] bg-[var(--white)] hover:bg-[var(--accent-light)]/5 hover:border-[var(--accent-light)]/30 hover:-translate-y-0.5 transition-all duration-300"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent-light)]/8 border border-[var(--accent-light)]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[var(--ink2)] leading-[1.75]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT ME — With animated counters
          ═══════════════════════════════════════════════════ */}
      <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-14 border-t border-[var(--border)] relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #E3F0FC 0%, #F0F7FD 40%, #EAF2FB 100%)' }}>
        <div className="max-w-[var(--max-w)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
            {/* Left — text */}
            <div>
              <Reveal>
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--accent-light)] mb-4">
                  About Me
                </p>
              </Reveal>

              <Reveal delay={1}>
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-8">
                  Hi, I&apos;m <em className="italic text-[var(--accent-light)]">Akhil.</em>
                </h2>
              </Reveal>

              <Reveal delay={2}>
                <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-6">
                  I don&apos;t just design interfaces — I build production-ready design systems.
                  Leveraging AI-first workflows, I help enterprise teams slash development cycles
                  and ship scalable, mission-critical products.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-10">
                  With over 12 years spanning aviation, healthcare, and government, I specialize in
                  transforming complex internal tools into experiences that users actually trust and
                  depend on daily.
                </p>
              </Reveal>

              {/* Contact info */}
              <Reveal delay={4}>
                <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-[var(--border)]">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--ink3)] mb-1.5">Call Today</p>
                    <a href="tel:+13413457337" className="text-[15px] text-[var(--ink)] font-medium hover:text-[var(--accent)] transition-colors">
                      +1 (341) 345-7337
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--ink3)] mb-1.5">Email</p>
                    <a href="mailto:akhil.vang@gmail.com" className="text-[15px] text-[var(--ink)] font-medium hover:text-[var(--accent)] transition-colors">
                      akhil.vang@gmail.com
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Stats */}
            <div className="flex flex-col justify-center">
              <Reveal delay={2}>
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  <div className="text-center p-3 sm:p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-light)]/10 hover:-translate-y-1 transition-all duration-300">
                    <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.8rem,5vw,4rem)] leading-none text-[var(--accent)] mb-1 sm:mb-2">
                      <AnimatedCounter end={12} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-[12px] text-[var(--ink3)] leading-snug">
                      Years of Experience
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-light)]/10 hover:-translate-y-1 transition-all duration-300">
                    <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.8rem,5vw,4rem)] leading-none text-[var(--accent)] mb-1 sm:mb-2">
                      <AnimatedCounter end={82} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-[12px] text-[var(--ink3)] leading-snug">
                      Completed Projects
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-light)]/10 hover:-translate-y-1 transition-all duration-300">
                    <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.8rem,5vw,4rem)] leading-none text-[var(--accent)] mb-1 sm:mb-2">
                      <AnimatedCounter end={20} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-[12px] text-[var(--ink3)] leading-snug">
                      Clients Worldwide
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Portrait photo — blob-clipped */}
              <Reveal delay={3}>
                <div className="mt-4 relative flex items-start justify-center md:justify-start md:-ml-4">
                  {/* Hidden SVG with clip-path definition */}
                  <svg className="absolute w-0 h-0" aria-hidden="true">
                    <defs>
                      <clipPath id="blobClip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.8798 0.4263 Q 0.9039 0.5000 0.9123 0.5871 Q 0.9208 0.6743 0.8785 0.7553 Q 0.8363 0.8363 0.7387 0.8385 Q 0.6411 0.8407 0.5706 0.8762 Q 0.5000 0.9117 0.4133 0.9150 Q 0.3267 0.9184 0.2393 0.8833 Q 0.1518 0.8482 0.1564 0.7443 Q 0.1610 0.6404 0.0830 0.5702 Q 0.0050 0.5000 0.0523 0.4171 Q 0.0997 0.3342 0.1757 0.2929 Q 0.2517 0.2517 0.3031 0.2003 Q 0.3546 0.1489 0.4273 0.1251 Q 0.5000 0.1014 0.5840 0.0979 Q 0.6680 0.0944 0.7397 0.1415 Q 0.8113 0.1887 0.8335 0.2707 Q 0.8558 0.3526 0.8798 0.4263 Z" />
                      </clipPath>
                    </defs>
                  </svg>
                  {/* Blob background (slightly larger, peeks out) */}
                  <div
                    className="absolute inset-[-16px] bg-gradient-to-br from-[#4BA3E3]/30 via-[#1A7DD4]/20 to-[#0C3A5E]/25"
                    style={{ clipPath: "url(#blobClip)" }}
                  />
                  {/* Image clipped to same blob shape */}
                  <div
                    className="relative z-10 aspect-square w-full"
                    style={{
                      clipPath: "url(#blobClip)",
                      backgroundImage: "url('/images/my-image.jpeg')",
                      backgroundSize: "120% auto",
                      backgroundPosition: "120% 35%",
                    }}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROJECTS
          ═══════════════════════════════════════════════════ */}
      <section id="work" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-14 border-t border-[var(--border)] relative overflow-hidden">
        <div className="max-w-[var(--max-w)] mx-auto">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--accent-light)] mb-4">
              Featured Projects
            </p>
          </Reveal>

          <Reveal delay={1}>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-5">
              Case studies in{" "}
              <em className="italic text-[var(--accent-light)]">enterprise UX.</em>
            </h2>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-[14px] sm:text-[16px] text-[var(--ink2)] leading-[1.85] max-w-2xl mb-10 sm:mb-16">
              These selected projects reflect my passion for solving real problems through thoughtful design,
              strategic research, and impactful storytelling.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
            {caseStudies.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}

            {/* Coming soon */}
            <Reveal delay={2}>
              <div className="rounded-xl border border-dashed border-[var(--accent-light)]/30 bg-[var(--accent-light)]/5 flex items-center justify-center min-h-[300px] sm:min-h-[500px] hover:bg-white/60 transition-colors duration-300">
                <div className="text-center px-8">
                  <p className="font-[family-name:var(--font-instrument-serif)] text-2xl text-[var(--ink3)] italic mb-3 opacity-40">
                    More coming soon
                  </p>
                  <p className="text-[13px] text-[var(--ink3)] opacity-50">
                    Additional case studies are being prepared.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════ */}
      <FAQ />

      {/* ═══════════════════════════════════════════════════
          LET'S WORK TOGETHER — Contact form
          ═══════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-14 overflow-hidden"
        style={{ background: "linear-gradient(165deg, #0B1929 0%, #0F2847 50%, #0C3A5E 100%)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(rgba(75,163,227,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Gradient accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 30% 70%, rgba(75,163,227,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 max-w-[var(--max-w)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
            <div>
              <Reveal>
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--accent-light)] mb-4">
                  Let&apos;s Work Together
                </p>
              </Reveal>
              <Reveal delay={1}>
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-white mb-6">
                  Let&apos;s build something{" "}
                  <em className="italic text-[var(--accent-light)]">impactful</em> together.
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="text-[16px] text-white/45 leading-relaxed mb-10">
                  Whether it&apos;s your next enterprise platform, a design system, or your product&apos;s
                  next big initiative — I&apos;m ready to bring strategic design thinking and AI-first
                  workflows to your team.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 mb-1.5">Email</p>
                    <a href="mailto:akhil.vang@gmail.com" className="text-[16px] text-white/80 hover:text-white transition-colors">
                      akhil.vang@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 mb-1.5">Call Today</p>
                    <a href="tel:+13413457337" className="text-[16px] text-white/80 hover:text-white transition-colors">
                      +1 (341) 345-7337
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — form */}
            <div>
              <Reveal delay={2}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                    const service = (form.elements.namedItem("service") as HTMLInputElement).value;
                    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                    window.location.href = `mailto:akhil.vang@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`)}`;
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-light)]/50 focus:bg-white/8 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-light)]/50 focus:bg-white/8 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-2">
                      Service Needed
                    </label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-light)]/50 focus:bg-white/8 transition-all"
                      placeholder="e.g. Product Design, Design System, UX Audit"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-light)]/50 focus:bg-white/8 transition-all resize-none"
                      placeholder="What can I help you with..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-[var(--black)] text-[13px] font-semibold tracking-[0.08em] uppercase rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-[1.01]"
                  >
                    Submit
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

