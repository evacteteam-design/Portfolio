import { DesignSystemCatalog } from "@/components/DesignSystemCatalog";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "React & TypeScript Design System",
  description:
    "Explore a themeable React and TypeScript component library, with accessible patterns, design tokens, and live examples.",
  path: "/design-system",
});

export default function DesignSystemPage() {
  return <DesignSystemCatalog />;
}
