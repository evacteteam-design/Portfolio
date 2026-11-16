import { UXArchitectPage } from "@/components/UXArchitectPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "UX Architect - AI-Powered UX Briefs",
  description:
    "Bring a product idea or a problem. Get a straight answer, testable personas, a user journey, and a wireframe blueprint.",
  path: "/ux-architect",
});

export default function UXArchitectRoute() {
  return <UXArchitectPage />;
}
