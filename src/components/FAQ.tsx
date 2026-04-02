"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";

const faqs = [
  {
    q: "What services do you offer?",
    a: "I specialize in end-to-end product design for enterprise platforms — from research and strategy through high-fidelity UI, design systems, and engineering handoff. I also bring AI-integrated workflows and front-end development capability to compress delivery cycles.",
  },
  {
    q: "How does the design process work?",
    a: "I use a hybrid, AI-first methodology. After defining the product strategy through research and OKR-alignment, I leverage MCP-powered pipelines and \"vibe coding\" to sync Figma designs directly to production code. This minimizes handoff friction and keeps development moving at sprint pace.",
  },
  {
    q: "How long does a project usually take?",
    a: "It depends on scope. A focused feature redesign can take 2–4 weeks. A full product design system or platform redesign typically runs 2–4 months. I work in agile sprints and can adapt to your team's cadence.",
  },
  {
    q: "Do you require visa sponsorship?",
    a: "Yes, I am currently on an E3 visa and require sponsorship to engage in a long-term employment relationship. I am well-versed in the E3 process and can provide the necessary documentation to make the sponsorship transition straightforward for your legal team.",
  },
  {
    q: "Are you available for contract or full-time roles?",
    a: "I am available for immediate contract engagements via my existing employer (Corp-to-Corp), and I am also actively seeking full-time W-2 opportunities that can provide E3 visa sponsorship, for which I can provide all necessary documentation to facilitate a seamless transition.",
  },
  {
    q: "How do you handle onboarding for remote roles?",
    a: "I have extensive experience working remotely for enterprise organizations like United Airlines and Quest Diagnostics. I am fully equipped to integrate into your existing Agile workflows and communication tools (Jira, Confluence, Slack) from day one, ensuring minimal downtime during the onboarding and sponsorship process.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-14 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #E3F0FC 0%, #F0F7FD 40%, #EAF2FB 100%)' }}>
      <div className="max-w-[var(--max-w)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-16">
          {/* Left intro */}
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--accent)] mb-4">
                FAQ
              </p>
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,3.8vw,3.375rem)] leading-[1.07] tracking-[-0.025em] text-[var(--black)] mb-6">
                Frequently Asked{" "}
                <em className="italic text-[var(--accent-light)]">Questions</em>
              </h2>
              <p className="text-[15px] text-[var(--ink2)] leading-relaxed">
                A quick guide to my process and engagement options. Have a question that isn&apos;t covered here? Contact me directly to discuss your specific requirements.
              </p>
            </Reveal>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-3">
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={Math.min(i + 1, 5)}>
                  <div className="border-b border-[var(--border)]">
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center justify-between py-6 text-left group"
                    >
                      <div className="flex items-start gap-3 sm:gap-5">
                        <span className="text-[13px] font-semibold text-[var(--ink3)] mt-0.5 shrink-0 w-5 sm:w-6">
                          {i + 1}.
                        </span>
                        <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--black)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                          {faq.q}
                        </span>
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`shrink-0 ml-4 text-[var(--ink3)] transition-transform duration-300 ${
                          openIndex === i ? "rotate-45" : ""
                        }`}
                      >
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-[var(--ease-out-expo)] ${
                        openIndex === i ? "max-h-60 pb-6" : "max-h-0"
                      }`}
                    >
                      <p className="text-[13px] sm:text-[14px] text-[var(--ink2)] leading-[1.8] pl-8 sm:pl-11 pr-2 sm:pr-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
