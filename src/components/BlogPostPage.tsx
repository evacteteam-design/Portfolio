"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogPost, BlogSection } from "@/content/blogPosts";

interface Props {
  post: BlogPost;
}

function renderSection(section: BlogSection, i: number) {
  switch (section.type) {
    case "heading":
      return section.level === 2 ? (
        <h2
          key={i}
          className="font-serif text-2xl sm:text-3xl font-bold mt-14 mb-4"
          style={{ color: "var(--ink)" }}
        >
          {section.text}
        </h2>
      ) : (
        <h3
          key={i}
          className="font-serif text-xl sm:text-2xl font-semibold mt-10 mb-3"
          style={{ color: "var(--ink)" }}
        >
          {section.text}
        </h3>
      );

    case "text":
      return (
        <div key={i} className="space-y-5">
          {section.body.map((para, j) => (
            <p
              key={j}
              className="text-base leading-relaxed"
              style={{ color: "var(--ink2)" }}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
      );

    case "list":
      return section.ordered ? (
        <ol
          key={i}
          className="list-decimal list-outside ml-6 space-y-2 text-base leading-relaxed"
          style={{ color: "var(--ink2)" }}
        >
          {section.items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ol>
      ) : (
        <ul
          key={i}
          className="list-disc list-outside ml-6 space-y-2 text-base leading-relaxed"
          style={{ color: "var(--ink2)" }}
        >
          {section.items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      );

    case "image":
      return (
        <figure key={i} className="my-10">
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: "var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.src}
              alt={section.alt}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          {section.caption && (
            <figcaption
              className="mt-3 text-sm text-center leading-snug"
              style={{ color: "var(--ink3)" }}
            >
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case "code": {
      const langLabel: Record<string, string> = {
        json: "JSON",
        text: "PROMPT",
        bash: "SHELL",
        ts: "TypeScript",
        tsx: "TSX",
        js: "JavaScript",
      };
      return (
        <div key={i} className="my-6 rounded-xl overflow-hidden" style={{ background: "var(--black)" }}>
          <div
            className="flex items-center justify-between px-5 py-2.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--accent-light)" }}
            >
              {langLabel[section.language] ?? section.language}
            </span>
          </div>
          <pre
            className="overflow-x-auto p-5 text-sm leading-relaxed font-mono"
            style={{ color: "rgba(246,250,255,0.88)" }}
          >
            <code>{section.code}</code>
          </pre>
        </div>
      );
    }

    case "callout": {
      const styles = {
        tip: {
          border: "var(--success)",
          bg: "rgba(26,107,53,0.06)",
          iconColor: "var(--success)",
          icon: "✦",
          labelColor: "var(--success)",
        },
        info: {
          border: "var(--accent)",
          bg: "rgba(26,125,212,0.06)",
          iconColor: "var(--accent)",
          icon: "◈",
          labelColor: "var(--accent)",
        },
        warning: {
          border: "var(--warning)",
          bg: "rgba(232,160,32,0.06)",
          iconColor: "var(--warning)",
          icon: "⚠",
          labelColor: "var(--warning)",
        },
      }[section.variant];

      return (
        <aside
          key={i}
          className="my-8 pl-5 pr-5 py-5 rounded-xl border-l-4 text-sm leading-relaxed whitespace-pre-line"
          style={{
            borderLeftColor: styles.border,
            background: styles.bg,
            color: "var(--ink2)",
          }}
        >
          {section.title && (
            <p
              className="font-semibold mb-2 flex items-center gap-2"
              style={{ color: styles.labelColor }}
            >
              <span>{styles.icon}</span>
              {section.title}
            </p>
          )}
          {section.body}
        </aside>
      );
    }

    default:
      return null;
  }
}

export function BlogPostPage({ post }: Props) {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--white)" }}
    >
      {/* Cover image hero */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(280px, 40vw, 500px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={post.coverImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,25,41,0.35) 0%, rgba(11,25,41,0.72) 100%)",
          }}
        />
        {/* Tag pills */}
        <div className="absolute bottom-6 left-0 right-0 px-5 sm:px-10 md:px-20 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(246,250,255,0.9)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Article container */}
      <div
        className="mx-auto px-5 sm:px-8"
        style={{ maxWidth: "var(--max-w-narrow)", paddingTop: "2.5rem", paddingBottom: "6rem" }}
      >
        {/* Back link */}
        <Link
          href="/ai-lab"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-60"
          style={{ color: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AI Lab
        </Link>

        {/* Title */}
        <h1
          className="font-serif font-bold leading-tight mb-4"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.625rem)", color: "var(--ink)" }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg mb-6 leading-relaxed"
          style={{ color: "var(--ink2)" }}
        >
          {post.subtitle}
        </p>

        {/* Metadata row */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-8 mb-8 border-b text-sm"
          style={{ borderColor: "var(--border)", color: "var(--ink3)" }}
        >
          <span>{post.publishedAt}</span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--border)" }}
            aria-hidden
          />
          <span>{post.readTime}</span>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {post.sections.map((section, i) => renderSection(section, i))}
        </div>

        {/* Footer divider */}
        <div
          className="mt-16 pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/ai-lab"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to AI Lab
          </Link>
          <span className="text-sm" style={{ color: "var(--ink3)" }}>
            Akhil Vanga · {post.publishedAt}
          </span>
        </div>
      </div>
    </main>
  );
}
