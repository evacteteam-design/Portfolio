"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { CaseStudy, StudyTabId } from "@/content/caseStudies";

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const [progress, setProgress] = useState(0);
  const [navMode, setNavMode] = useState<"hero" | "page">("hero");
  const [activeTab, setActiveTab] = useState<StudyTabId>("problem");

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      setProgress(Math.min(pct, 100));

      const heroEl = document.getElementById("cs-hero");
      if (heroEl) {
        setNavMode(window.scrollY > heroEl.offsetHeight - 80 ? "page" : "hero");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const contextSection = study.sections.find((s) => s.id === "context");
  const researchSection = study.sections.find((s) => s.id === "research");
  const processSection = study.sections.find((s) => s.id === "process");
  const decisionsSection = study.sections.find((s) => s.id === "decisions");
  const constraintsSection = study.sections.find((s) => s.id === "constraints");
  const tabOrder: StudyTabId[] = ["problem", "solution", "challenge", "summary"];
  const activeTabData = study.tabs?.find((tab) => tab.id === activeTab);
  const navItems = ["context", "research", "decisions", "impact"];
  if (study.beforeAfter && study.beforeAfter.length > 0) {
    navItems.splice(1, 0, "before-after");
  }

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[9999] pointer-events-none transition-[width] duration-100"
        style={{ width: `${progress}%`, background: study.accentDark }}
      />

      {/* Case study nav overlay */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] h-14 sm:h-16 px-4 sm:px-6 md:px-14 flex items-center justify-between transition-all duration-400 ${
          navMode === "hero"
            ? "bg-[var(--accent-dark)]/95 backdrop-blur-xl"
            : "bg-[var(--white)]/96 backdrop-blur-xl border-b border-[var(--border)] shadow-sm shadow-[var(--accent-light)]/5"
        }`}
      >
        <Link
          href="/"
          className={`text-[13px] flex items-center gap-2 transition-opacity hover:opacity-55 ${
            navMode === "hero" ? "text-white/75" : "text-[var(--ink3)]"
          }`}
        >
          ← Akhil Vanga
        </Link>
        <div className="hidden md:flex gap-8">
          {navItems.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-[11px] font-medium tracking-[0.1em] uppercase transition-opacity hover:opacity-50 ${
                navMode === "hero" ? "text-white/55" : "text-[var(--ink3)]"
              }`}
            >
              {id === "before-after" ? "Before & After" : id}
            </a>
          ))}
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        id="cs-hero"
        className="relative min-h-screen flex flex-col pt-14 sm:pt-16 overflow-hidden"
        style={{ background: study.accentDark }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-14 py-10 sm:py-16 max-w-[var(--max-w)] w-full mx-auto relative z-10">
          {/* Tags */}
          <div className="hero-anim-1 flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-9">
            {study.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[11px] font-medium tracking-[0.08em] uppercase px-3.5 py-1 rounded-full border ${
                  i === 0
                    ? "bg-white/10 border-white/25 text-white"
                    : "border-white/18 text-white/60"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="hero-anim-2 font-[family-name:var(--font-instrument-serif)] text-[clamp(2.2rem,8vw,7.25rem)] leading-[0.96] tracking-[-0.03em] text-white mb-6 sm:mb-10">
            {study.title.split(" ").map((word, i) => (
              <span key={i}>
                {i === 1 ? (
                  <em className="italic" style={{ color: study.accentColor }}>
                    {word}
                  </em>
                ) : (
                  word
                )}
                {i < study.title.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {/* Meta grid */}
          <div className="hero-anim-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l border-white/12 mb-8 sm:mb-11">
            {[
              { label: "Role", value: study.role },
              { label: "Platform", value: study.platform },
              { label: "Users", value: study.users },
              { label: "Duration", value: study.duration },
              { label: "Impact", value: study.impactHeadline },
            ].map((m) => (
              <div key={m.label} className="px-3 sm:px-5 py-3 sm:py-4 border-r border-b border-white/12">
                <p className="text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-white/35 mb-1">{m.label}</p>
                <p className="text-[11px] sm:text-[13px] text-white/82">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Lede */}
          <p className="hero-anim-4 text-base sm:text-lg font-light text-white/52 max-w-[620px] leading-[1.75] border-l-2 pl-4 sm:pl-5" style={{ borderColor: `${study.accentColor}80` }}>
            {study.lede}
          </p>
        </div>

        {/* Screenshot shelf */}
        <div className="hero-anim-5 relative z-10 px-4 sm:px-6 md:px-14 max-w-[var(--max-w)] w-full mx-auto">
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-white/12 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.3)] mb-10 sm:mb-16">
            <div className="bg-[rgba(12,18,40,0.97)] px-4 py-2.5 flex items-center gap-2.5 border-b border-white/6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 bg-white/5 rounded px-3 py-1 text-[11px] font-[family-name:var(--font-dm-mono)] text-white/28">
                {study.heroScreenCaption}
              </div>
            </div>
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src={study.heroScreenUrl}
                alt={study.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 01 CONTEXT ═══ */}
      {contextSection && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)]" id="context">
          <div className="max-w-[var(--max-w-narrow)] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                {contextSection.number} — {contextSection.label}
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                {contextSection.title}{" "}
                {contextSection.titleAccent && (
                  <em className="italic text-[var(--accent)]">{contextSection.titleAccent}</em>
                )}
                <br />{study.contextTail ?? "Every scheduling decision they make."}
              </h2>
            </Reveal>

            {contextSection.body.map((p, i) => (
              <Reveal key={i} delay={i + 2}>
                <p
                  className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5 [&_strong]:text-[var(--ink)] [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              </Reveal>
            ))}

            {contextSection.quote && (
              <Reveal>
                <div className="my-8 sm:my-12 p-5 sm:p-8 md:p-10 rounded-xl relative overflow-hidden" style={{ background: study.accentDark }}>
                  <span className="absolute top-2 left-7 font-[family-name:var(--font-instrument-serif)] text-[96px] text-white/5 leading-none pointer-events-none">&ldquo;</span>
                  <p className="font-[family-name:var(--font-instrument-serif)] text-[17px] sm:text-[21px] italic text-white leading-relaxed mb-3 relative z-10">
                    &ldquo;{contextSection.quote.text}&rdquo;
                  </p>
                  <cite className="text-[11px] tracking-[0.08em] uppercase text-white/40 relative z-10">
                    — {contextSection.quote.cite}
                  </cite>
                </div>
              </Reveal>
            )}
          </div>

          {/* Stats */}
          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14 mt-10 sm:mt-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
              {study.stats.map((stat, i) => (
                <Reveal key={i} delay={i + 1} className="h-full">
                  <div className="h-full bg-[var(--white)] p-4 sm:p-8 md:p-9 relative group hover:bg-[var(--surface)] transition-colors">
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] transition-[transform] duration-700 [transform:scaleX(0)] [transform-origin:left] group-hover:[transform:scaleX(1)]"
                      style={{ background: stat.barColor }}
                    />
                    <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.8rem,4vw,3.25rem)] leading-none text-[var(--black)] mb-2">
                      {stat.value}
                      {stat.suffix && <sup className="text-[16px] sm:text-[22px] align-super">{stat.suffix}</sup>}
                    </p>
                    <p className="text-[11px] sm:text-[13px] text-[var(--ink3)] leading-snug">{stat.description}</p>
                    {stat.caveat && (
                      <p className="text-[11px] text-[#ccc] italic mt-1">* {stat.caveat}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 02 RESEARCH ═══ */}

      {/* ═══ BEFORE & AFTER ═══ */}
      {study.beforeAfter && study.beforeAfter.length > 0 && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)] relative" id="before-after" style={{ background: 'linear-gradient(160deg, #E3F0FC 0%, #F0F7FD 40%, #EAF2FB 100%)' }}>
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                03 — Before / After
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-4">
                From legacy chaos<br />to <em className="italic text-[var(--accent)]">structured clarity.</em>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5">
                The three core screens from the legacy tools, paired with the CCS+ redesigns. The contrast makes the scope of the problem impossible to miss.
              </p>
            </Reveal>
          </div>

          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14">
            {study.beforeAfter.map((pair, i) => (
              <div key={i} className="py-12 sm:py-20 border-b last:border-b-0 border-[var(--border)]">
                {/* Section eye */}
                <Reveal>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--ink3)] mb-9 flex items-center gap-2.5">
                    <span className="block w-5 h-px bg-[var(--ink3)]" />
                    {pair.label}
                  </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Before column */}
                  <Reveal>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded mb-3 bg-[#FEF0F0] text-[#8B2020] border border-[#F0C0C0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D94F4F] shrink-0" />
                        {pair.beforeLabel}
                      </span>
                      <div className="rounded-lg overflow-hidden border border-[var(--border)] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                          <Image
                            src={pair.beforeImage}
                            alt={pair.beforeAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </div>
                        <div className="px-4 py-3 bg-[var(--white)] border-t border-[var(--border)]">
                          <p className="text-[12px] text-[var(--ink3)] leading-relaxed" dangerouslySetInnerHTML={{ __html: pair.beforeCaption.replace(/^(Legacy|Before):/, '<strong>$1:</strong>') }} />
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* What changed + After */}
                  <Reveal delay={1}>
                    <div>
                      <p className="font-[family-name:var(--font-instrument-serif)] text-[24px] tracking-[-0.01em] text-[var(--black)] mb-3">What changed</p>
                      <p className="text-[14px] text-[var(--ink2)] leading-[1.8] mb-4">{pair.desc}</p>

                      {/* Delta before */}
                      <div className="border-t border-[var(--border)] mb-4">
                        {pair.deltaBefore.map((d, j) => (
                          <div key={j} className="flex items-start gap-2.5 text-[14px] text-[var(--ink2)] leading-[1.6] py-2 border-b border-[var(--border)]">
                            <span className="shrink-0 mt-px w-[18px] text-[15px]" style={{ color: "#C0392B" }}>×</span>
                            {d.text}
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-[var(--border)] my-5" />

                      {/* After image */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded mb-3 bg-[#EBF5FF] text-[#003380] border border-[#B8D4F5]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] shrink-0" />
                        {pair.afterLabel}
                      </span>
                      <div className="rounded-lg overflow-hidden border border-[var(--border)] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        {pair.afterUrl && (
                          <div className="bg-[#F0F0F0] px-3.5 py-2 flex items-center gap-2 border-b border-[var(--border)]">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                              <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                              <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                            </div>
                            <span className="text-[11px] font-[family-name:var(--font-dm-mono)] text-[var(--ink3)] bg-black/6 rounded px-2 py-1">{pair.afterUrl}</span>
                          </div>
                        )}
                        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                          <Image
                            src={pair.afterImage}
                            alt={pair.afterAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </div>
                        <div className="px-4 py-3 bg-[var(--white)] border-t border-[var(--border)]">
                          <p className="text-[12px] text-[var(--ink3)] leading-relaxed" dangerouslySetInnerHTML={{ __html: pair.afterCaption.replace(/^(CCS\+|After):/, '<strong>$1:</strong>') }} />
                        </div>
                      </div>

                      {/* Delta after */}
                      <div className="border-t border-[var(--border)] mt-4">
                        {pair.deltaAfter.map((d, j) => (
                          <div key={j} className="flex items-start gap-2.5 text-[14px] text-[var(--ink2)] leading-[1.6] py-2 border-b border-[var(--border)]">
                            <span className="shrink-0 mt-px w-[18px] text-[15px]" style={{ color: "#1A6B35" }}>✓</span>
                            {d.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 02 RESEARCH ═══ */}
      {researchSection && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)]" id="research">
          <div className="max-w-[var(--max-w-narrow)] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                {researchSection.number} — {researchSection.label}
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                {researchSection.title}{" "}
                {researchSection.titleAccent && (
                  <em className="italic text-[var(--accent)]">{researchSection.titleAccent}</em>
                )}
                <br />{study.researchTail ?? "It was dread."}
              </h2>
            </Reveal>

            {researchSection.body.map((p, i) => (
              <Reveal key={i} delay={i + 2}>
                <p
                  className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5 [&_strong]:text-[var(--ink)] [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              </Reveal>
            ))}
          </div>

          {/* Insight cards */}
          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14 mt-10 sm:mt-14">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
                {study.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="bg-[var(--white)] p-5 sm:p-8 md:p-9 relative overflow-hidden group hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ background: study.accentDark }} />
                    <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--ink3)] tracking-[0.1em] mb-4">
                      {insight.number}
                    </p>
                    <p className="text-[15px] font-semibold text-[var(--black)] mb-2.5 leading-snug">
                      {insight.title}
                    </p>
                    <p className="text-[14px] text-[var(--ink2)] leading-[1.75]">
                      {insight.body}
                    </p>
                    {insight.quote && (
                      <p className="text-[var(--ink3)] italic text-[14px] mt-3 pt-3 border-t border-[var(--border)]">
                        &ldquo;{insight.quote}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Tabs: Problem / Solution / Challenge / Summary */}
          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14 mt-12 sm:mt-20">
            <Reveal>
              <div className="flex flex-wrap border border-[var(--border)] rounded-lg overflow-hidden w-fit mb-0">
                {tabOrder.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[12px] font-medium tracking-[0.06em] uppercase border-r last:border-r-0 border-[var(--border)] transition-colors ${
                      activeTab === tab
                        ? "text-white"
                        : "bg-[var(--white)] text-[var(--ink3)] hover:bg-[var(--surface)]"
                    }`}
                    style={activeTab === tab ? { background: study.accentDark } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pt-8 sm:pt-12">
              <div>
                <p className="font-[family-name:var(--font-instrument-serif)] text-[40px] sm:text-[72px] leading-none text-[var(--accent-dark)]/5 mb-[-8px] sm:mb-[-12px] tracking-[-0.04em]">
                  {activeTab === "problem" ? "01" : activeTab === "solution" ? "02" : activeTab === "challenge" ? "03" : "04"}
                </p>
                <p className="font-[family-name:var(--font-instrument-serif)] text-[22px] sm:text-[28px] leading-snug tracking-[-0.02em] text-[var(--black)] mb-4">
                  {activeTabData?.title ?? (
                    <>
                      {activeTab === "problem" && "The problem was trust, not confusion"}
                      {activeTab === "solution" && "Persistent context, inline clarity, visual hierarchy"}
                      {activeTab === "challenge" && "Enterprise constraints shaped every decision"}
                      {activeTab === "summary" && "From dreaded tool to trusted daily driver"}
                    </>
                  )}
                </p>
                <p className="text-[15px] text-[var(--ink2)] leading-[1.85] mb-5">
                  {activeTabData?.body ?? (
                    <>
                      {activeTab === "problem" &&
                        "10,000+ pilots using a scheduling app they dreaded. Legacy tools forced daily context-switching between two completely siloed systems. The Trade Center had no information hierarchy, no filter memory, no deadhead clarity, and no bid-period context."}
                      {activeTab === "solution" &&
                        "Persistent filters eliminate daily setup ritual. Inline trip expansion removes navigation anxiety. Color-coded DH badges solve 18-month complaint. Bid-period context surfaces schedule conflicts before action."}
                      {activeTab === "challenge" &&
                        "Built on an established design system across 12+ apps. Complex FAA/union business rules enforced in real-time. Compressed 2-week sprint cycles. Zero downtime tolerance for 10,000+ daily users."}
                      {activeTab === "summary" &&
                        "CCS+ Trade Center went from the most-dreaded feature to the most-used. Every design decision was grounded in pilot research, validated through testing, and shipped within engineering constraints."}
                    </>
                  )}
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-[var(--border)] shadow-[0_6px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.14)] transition-all duration-300">
                {activeTabData ? (
                  <>
                    {activeTabData.imageUrl && (
                      <div className="bg-[#F0F0F0] px-3.5 py-2 flex items-center gap-2 border-b border-[var(--border)]">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                          <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                          <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="text-[11px] font-[family-name:var(--font-dm-mono)] text-[var(--ink3)] bg-black/6 rounded px-2 py-1">
                          {activeTabData.imageUrl}
                        </span>
                      </div>
                    )}
                    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={activeTabData.image}
                        alt={activeTabData.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>
                    <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
                      <p className="text-[12px] text-[var(--ink3)] leading-relaxed">
                        <strong>{activeTabData.captionTitle}:</strong> {activeTabData.captionBody}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-[#F0F0F0] px-3.5 py-2 flex items-center gap-2 border-b border-[var(--border)]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                        <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                      </div>
                      <span className="text-[11px] font-[family-name:var(--font-dm-mono)] text-[var(--ink3)] bg-black/6 rounded px-2 py-1">
                        {activeTab === "solution" ? "ccsplus.ual.com / trade-center / trips" : "Category Summary — March bid period"}
                      </span>
                    </div>
                    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={activeTab === "solution" ? "/images/trips tab.png" : "/images/category summary.png"}
                        alt={activeTab === "solution" ? "CCS+ Trade Board" : "Category Summary Gantt"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>
                    <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
                      <p className="text-[12px] text-[var(--ink3)] leading-relaxed">
                        {activeTab === "solution" && <><strong>CCS+ Trade Board:</strong> 217 trips, scannable in seconds. Block, TAFB, pay, layovers all visible per row. RT and DH badges immediately distinguish trip types.</>}
                        {activeTab === "summary" && <><strong>Category Summary Gantt:</strong> Full bid-period context. BLK 50:22 &middot; TAFB 163:32 &middot; LPV $35,919 — all live as pilots evaluate trades.</>}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 04 PROCESS ═══ */}
      {processSection && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)]" id="process">
          <div className="max-w-[var(--max-w-narrow)] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                {processSection.number} — {processSection.label}
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                {processSection.title}{" "}
                {processSection.titleAccent && (
                  <em className="italic text-[var(--accent)]">{processSection.titleAccent}</em>
                )}
              </h2>
            </Reveal>

            {processSection.body.map((p, i) => (
              <Reveal key={i} delay={i + 2}>
                <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14 mt-8 sm:mt-12">
            <Reveal>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                {study.process.map((step, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[36px_1fr] sm:grid-cols-[52px_1fr] gap-3 sm:gap-5 px-4 sm:px-8 py-5 sm:py-7 border-b last:border-b-0 border-[var(--border)] bg-[var(--white)] relative group hover:bg-[var(--surface)] transition-colors"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
                      style={{ background: study.accentDark }}
                    />
                    <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--ink3)] pt-0.5">
                      {step.number}
                    </p>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--black)] mb-2">{step.title}</p>
                      <p className="text-[14px] text-[var(--ink2)] leading-[1.8]">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══ 05 DECISIONS ═══ */}
      {decisionsSection && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)]" id="decisions">
          <div className="max-w-[var(--max-w-narrow)] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                {decisionsSection.number} — {decisionsSection.label}
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                {decisionsSection.title}{" "}
                {decisionsSection.titleAccent && (
                  <em className="italic text-[var(--accent)]">{decisionsSection.titleAccent}</em>
                )}
              </h2>
            </Reveal>

            {decisionsSection.body.map((p, i) => (
              <Reveal key={i} delay={i + 2}>
                <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14">
            {study.decisions.map((dec, i) => (
              <Reveal key={i}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-[72px] items-start py-10 sm:py-16 md:py-[72px] border-b last:border-b-0 border-[var(--border)] ${
                    dec.flip ? "md:[direction:rtl] md:[&>*]:[direction:ltr]" : ""
                  }`}
                >
                  <div>
                    <span className="inline-block text-[10px] font-semibold tracking-[0.1em] uppercase px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink3)] mb-5">
                      Decision {dec.number} · {dec.label}
                    </span>
                    <h3 className="font-[family-name:var(--font-instrument-serif)] text-[24px] sm:text-[30px] leading-[1.12] tracking-[-0.02em] text-[var(--black)] mb-4">
                      {dec.title}
                    </h3>
                    {dec.body.map((p, j) => (
                      <p key={j} className="text-[15px] text-[var(--ink2)] leading-[1.88] mb-5">
                        {p}
                      </p>
                    ))}
                    <div className="p-5 bg-[var(--surface)] rounded-lg border-l-[3px] border-[var(--success)]">
                      <p className="text-[14px] font-semibold text-[var(--ink)] mb-1">Impact</p>
                      <p className="text-[13px] text-[var(--ink2)] leading-relaxed">{dec.impact}</p>
                    </div>
                  </div>
                  <div>
                    <div className="rounded-lg overflow-hidden border border-[var(--border)] shadow-[0_6px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(0,0,0,0.14)] transition-all duration-300">
                      {dec.imageUrl && (
                        <div className="bg-[#F0F0F0] px-3.5 py-2 flex items-center gap-2 border-b border-[var(--border)]">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                            <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                          </div>
                          <span className="text-[11px] font-[family-name:var(--font-dm-mono)] text-[var(--ink3)] bg-black/6 rounded px-2 py-1 flex-1">{dec.imageUrl}</span>
                        </div>
                      )}
                      {dec.image ? (
                        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                          <Image
                            src={dec.image}
                            alt={dec.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </div>
                      ) : (
                        <div className="bg-[var(--surface)] aspect-[16/9] flex items-center justify-center">
                          <p className="text-[var(--ink3)] text-sm italic px-6 text-center">{dec.label}</p>
                        </div>
                      )}
                      {dec.imageCaption && (
                        <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
                          <p className="text-[12px] text-[var(--ink3)] leading-relaxed" dangerouslySetInnerHTML={{ __html: dec.imageCaption.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 06 CONSTRAINTS ═══ */}
      {constraintsSection && (
        <section className="py-16 sm:py-24 md:py-28 border-t border-[var(--border)]">
          <div className="max-w-[var(--max-w-narrow)] mx-auto px-4 sm:px-6 md:px-14">
            <Reveal>
              <div className="flex items-center gap-2.5 mb-5 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]" style={{ color: study.accentColor }}>
                {constraintsSection.number} — {constraintsSection.label}
                <span className="block w-8 h-px" style={{ background: `${study.accentColor}50` }} />
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                {constraintsSection.title}{" "}
                {constraintsSection.titleAccent && (
                  <em className="italic text-[var(--accent)]">{constraintsSection.titleAccent}</em>
                )}
              </h2>
            </Reveal>

            {constraintsSection.body.map((p, i) => (
              <Reveal key={i} delay={i + 2}>
                <p className="text-[16px] text-[var(--ink2)] leading-[1.85] mb-5">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="max-w-[var(--max-w)] mx-auto px-4 sm:px-6 md:px-14 mt-8 sm:mt-12">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {study.constraints.map((c, i) => (
                  <div
                    key={i}
                    className="p-5 sm:p-7 border border-[var(--border)] rounded-lg relative overflow-hidden group bg-[var(--white)] hover:bg-[var(--surface)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350"
                      style={{ background: `linear-gradient(90deg, ${study.accentDark}, ${study.accentColor})` }}
                    />
                    <p className="text-[15px] font-semibold text-[var(--black)] mb-2">{c.title}</p>
                    <p className="text-[14px] text-[var(--ink2)] leading-[1.75]">{c.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══ IMPACT STRIP ═══ */}
      <section
        id="impact"
        className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-14 overflow-hidden"
        style={{ background: study.accentDark }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 max-w-[var(--max-w)] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/7">
          {study.impact.map((m, i) => (
            <Reveal key={i} delay={i + 1} className="h-full">
              <div className="h-full p-4 sm:p-8 md:p-10 hover:bg-white/4 transition-colors" style={{ background: study.accentDark }}>
                <p className="font-[family-name:var(--font-instrument-serif)] text-[clamp(1.8rem,4vw,3.375rem)] leading-none text-white mb-2.5">
                  {m.value}
                  {m.suffix && <sup className="text-[16px] sm:text-[24px] align-super">{m.suffix}</sup>}
                </p>
                <p className="text-[11px] sm:text-[13px] text-white/40 leading-snug">{m.label}</p>
                {m.caveat && <p className="text-[11px] text-white/20 italic mt-1">* {m.caveat}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
