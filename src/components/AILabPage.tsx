"use client";

import Link from "next/link";
import { blogPosts } from "@/content/blogPosts";
import { Reveal } from "@/components/Reveal";

export function AILabPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--white)" }}
    >
      {/* ── Hero header ─────────────────────────────── */}
      <section
        className="relative flex flex-col justify-end overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--black) 0%, var(--ink) 55%, var(--accent-dark) 100%)",
          minHeight: "clamp(240px, 32vw, 380px)",
          paddingTop: "calc(var(--space-2xl) + 3.5rem)",
          paddingBottom: "var(--space-xl)",
        }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--accent-light) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        {/* Glow orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "clamp(300px, 40vw, 560px)",
            height: "clamp(300px, 40vw, 560px)",
            top: "-20%",
            right: "-8%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(75,163,227,0.16) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div
          className="relative mx-auto w-full px-5 sm:px-10 md:px-20"
          style={{ maxWidth: "var(--max-w)" }}
        >
          {/* Eyebrow */}
          <p
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "var(--accent-light)" }}
          >
            Akhil Vanga · AI Lab
          </p>

          <h1
            className="font-serif font-bold leading-[1.1] mb-4"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
              color: "var(--white)",
            }}
          >
            AI Lab
          </h1>

          <p
            className="max-w-xl text-base sm:text-lg leading-relaxed"
            style={{ color: "rgba(246,250,255,0.65)" }}
          >
            Real workflows, honest breakdowns, and things worth knowing — at the
            intersection of AI tools, design systems, and the future of
            product work.
          </p>
        </div>
      </section>

      {/* ── Post grid ──────────────────────────────── */}
      <section
        className="mx-auto px-5 sm:px-10 md:px-20 py-16 sm:py-20"
        style={{ maxWidth: "var(--max-w)" }}
      >
        {/* Section label */}
        <Reveal>
          <p
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-10"
            style={{ color: "var(--accent)" }}
          >
            Latest Posts
          </p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i + 1} className="h-full">
              <Link
                href={`/ai-lab/${post.slug}`}
                className="group flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-500
                  hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--border)",
                  boxShadow: "0 2px 16px rgba(26,125,212,0.06)",
                }}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 40%, rgba(11,25,41,0.45) 100%)",
                    }}
                    aria-hidden
                  />
                  {/* Top tag */}
                  {post.tags[0] && (
                    <span
                      className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(26,125,212,0.85)",
                        backdropFilter: "blur(6px)",
                        color: "white",
                      }}
                    >
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  {/* Meta */}
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--ink3)" }}
                  >
                    <span>{post.publishedAt}</span>
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "var(--border)" }}
                      aria-hidden
                    />
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-serif font-bold leading-snug transition-colors duration-300 group-hover:text-[var(--accent)]"
                    style={{
                      fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                      color: "var(--ink)",
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-sm leading-relaxed line-clamp-3 flex-1"
                    style={{ color: "var(--ink2)" }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(1, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--surface)",
                          color: "var(--ink3)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read CTA */}
                  <div
                    className="flex items-center gap-2 pt-3 mt-auto text-sm font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]"
                    style={{ color: "var(--ink3)" }}
                  >
                    Read article
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      <path
                        d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* Coming soon placeholders — fill row to 3 */}
          {Array.from({ length: Math.max(0, 3 - blogPosts.length) }).map((_, i) => (
            <Reveal key={`placeholder-${i}`} delay={blogPosts.length + i + 1} className="h-full">
              <div
                className="flex flex-col justify-center items-center text-center rounded-2xl border-2 border-dashed px-8 py-14 gap-3 h-full"
                style={{ borderColor: "var(--border)", minHeight: "320px" }}
              >
                <span
                  className="text-2xl opacity-30"
                  style={{ color: "var(--ink3)" }}
                  aria-hidden
                >
                  ✦
                </span>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--ink3)" }}
                >
                  More coming soon
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--border)" }}
                >
                  I write when I have something worth saying.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
