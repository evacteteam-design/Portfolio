import type { Metadata } from "next";
import { UXArchitectPage } from "@/components/UXArchitectPage";

export const metadata: Metadata = {
  title: "UX Architect — Akhil Vanga",
  description:
    "Bring a product idea or a problem. Get a straight answer, testable personas, a user journey, and a wireframe blueprint.",
};

export default function UXArchitectRoute() {
  return <UXArchitectPage />;
}
