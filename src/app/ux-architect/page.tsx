import { UXArchitectPage } from "@/components/UXArchitectPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "UX Architect - AI-Powered UX Briefs",
  description:
    "An AI UX tool independently designed and built by Akhil Vanga. Explore product ideas through answers, audience hypotheses, journeys, and wireframe blueprints.",
  path: "/ux-architect",
});

export default function UXArchitectRoute() {
  return <UXArchitectPage />;
}
