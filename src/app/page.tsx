import HomePage from "@/components/HomePageNew";
import { createPageMetadata, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";

export const metadata = {
  ...createPageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" }),
  title: { absolute: SITE_TITLE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Akhil Vanga",
      url: SITE_URL,
      jobTitle: "Senior UX & AI-First Product Designer",
      description: SITE_DESCRIPTION,
      image: `${SITE_URL}/images/my-image.jpeg`,
      homeLocation: {
        "@type": "Place",
        name: "Sacramento, California, United States",
      },
      knowsAbout: [
        "User experience design",
        "Product design",
        "Enterprise UX architecture",
        "Design systems",
        "React and TypeScript",
        "AI-integrated workflows",
      ],
      sameAs: ["https://www.linkedin.com/in/akvanga/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Akhil Vanga Portfolio",
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePage />
    </>
  );
}
