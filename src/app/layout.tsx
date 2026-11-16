import type { Metadata, Viewport } from "next";
import { Baloo_2, DM_Mono, Poppins } from "next/font/google";
import "./globals.css";
import "@akhil-vanga/design-system/styles.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";

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
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Akhil Vanga",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Akhil Vanga", url: SITE_URL }],
  creator: "Akhil Vanga",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "u5JoDBgITHd2fU187p7U9aoscDiujUzj7zsXCGj3KqM",
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
      <head>
        {/* Disable browser scroll restoration before any JS runs */}
        <script dangerouslySetInnerHTML={{ __html: 'history.scrollRestoration="manual"' }} />
        <noscript>
          <style>{`.reveal, .reveal-left, .reveal-right, .reveal-scale { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
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
