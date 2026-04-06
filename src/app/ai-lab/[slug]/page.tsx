import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/content/blogPosts";
import { BlogPostPage } from "@/components/BlogPostPage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Akhil Vanga`,
    description: post.excerpt,
  };
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <BlogPostPage post={post} />;
}
