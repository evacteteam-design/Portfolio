import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — Akhil Vanga`,
    description: cs.lede,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  return <CaseStudyPage study={cs} />;
}
