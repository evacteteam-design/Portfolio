import type { Metadata } from "next";
import { DesignSystemCatalog } from "@/components/DesignSystemCatalog";

export const metadata: Metadata = {
  title: "Design System — Akhil Vanga",
  description:
    "Explore a themeable React and TypeScript component library, with accessible patterns, design tokens, and live examples.",
};

export default function DesignSystemPage() {
  return <DesignSystemCatalog />;
}
