import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/caseStudies";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/design-system", "/ux-architect", ...caseStudies.map(({ slug }) => `/work/${slug}`)]
    .map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
