"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import type { CaseStudy } from "@/content/caseStudies";

export function ProjectCard({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <Reveal delay={index + 1} direction="up">
      <Link
        href={`/work/${project.slug}`}
        className="group block relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--white)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-light)]/10 hover:-translate-y-1"
      >
        {/* Preview image area */}
        <div
          className="relative h-[240px] sm:h-[340px] md:h-[420px] overflow-hidden"
          style={{ background: project.accentDark }}
        >
          {/* Dot grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Floating screenshot mock */}
          <div className="absolute inset-4 sm:inset-8 md:inset-12 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
            <div className="text-center px-4 sm:px-6">
              <p className="font-[family-name:var(--font-instrument-serif)] text-white text-2xl sm:text-3xl md:text-4xl italic opacity-90">
                {project.title}
              </p>
              <p className="text-white/40 text-sm mt-3">
                {project.client} · {project.year}
              </p>
            </div>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--white)] to-transparent" />
        </div>

        {/* Card content */}
        <div className="p-5 sm:p-8 md:p-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded-full border border-[var(--border)] text-[var(--ink3)]">
              {project.client}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1 rounded-full border border-[var(--border)] text-[var(--ink3)]">
              {project.role}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-instrument-serif)] text-xl sm:text-2xl md:text-3xl tracking-tight text-[var(--black)] mb-2 sm:mb-3 leading-tight">
            {project.subtitle}
          </h3>

          <p className="text-[13px] sm:text-[15px] text-[var(--ink2)] leading-relaxed mb-4 sm:mb-6 line-clamp-2">
            {project.lede}
          </p>

          {/* Impact strip */}
          <div className="flex gap-4 sm:gap-8 pt-4 sm:pt-5 border-t border-[var(--border)]">
            {project.stats.slice(0, 3).map((stat, i) => (
              <div key={i}>
                <p className="font-[family-name:var(--font-instrument-serif)] text-xl sm:text-2xl text-[var(--black)]">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm align-super">{stat.suffix}</span>
                  )}
                </p>
                <p className="text-[11px] text-[var(--ink3)] mt-1 leading-snug max-w-[120px]">
                  {stat.description.split("—")[0].trim()}
                </p>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="mt-6 flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] uppercase text-[var(--accent-light)] group-hover:gap-3 transition-all">
            Read case study
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
