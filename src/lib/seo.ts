import type { Metadata } from "next";

export const SITE_URL = "https://www.akhilvanga.com";
export const SITE_TITLE = "Akhil Vanga - Senior UX & Product Designer in Sacramento";
export const SITE_DESCRIPTION =
  "Senior UX and AI-first Product Designer in Sacramento. Try UX Architect and explore enterprise UX, end-to-end design ownership, and reusable systems.";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = path === "/" ? title : `${title} | Akhil Vanga`;
  const images = [{
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "Akhil Vanga - Enterprise UX, powered by AI",
  }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Akhil Vanga Portfolio",
      url,
      title: socialTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
    },
  };
}
