import type { Metadata, Viewport } from "next";
import { Baloo_2, DM_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

// Baloo 2 — headings, display, large type
const baloo2 = Baloo_2({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Poppins — body text, UI labels
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Akhil Vanga — UX/UI Designer",
  description: "AI-First Product Designer crafting enterprise experiences that users trust.",
  openGraph: {
    title: "Akhil Vanga — UX/UI Designer",
    description: "AI-First Product Designer crafting enterprise experiences that users trust.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo2.variable} ${poppins.variable} ${dmMono.variable}`}
    >
      <body>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
