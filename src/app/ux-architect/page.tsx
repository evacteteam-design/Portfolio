import type { Metadata } from "next";
import { UXArchitectPage } from "@/components/UXArchitectPage";

export const metadata: Metadata = {
  title: "UX Architect — Akhil Vanga",
  description:
    "Turn a product idea into testable personas, a user journey, and a wireframe blueprint.",
};

export default function UXArchitectRoute() {
  return <UXArchitectPage />;
}
