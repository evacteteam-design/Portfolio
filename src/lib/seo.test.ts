import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { caseStudies } from "../content/caseStudies";
import sitemap from "../app/sitemap";
import { createPageMetadata, SITE_URL } from "./seo";

describe("search metadata", () => {
  it("gives each case study its own canonical and matching social metadata", () => {
    for (const study of caseStudies) {
      const title = `${study.title} - UX Case Study`;
      const metadata = createPageMetadata({
        title,
        description: study.seoDescription,
        path: `/work/${study.slug}`,
      });
      const url = `${SITE_URL}/work/${study.slug}`;
      assert.equal(metadata.alternates?.canonical, url);
      assert.equal(metadata.openGraph?.url, url);
      assert.equal(metadata.openGraph?.title, `${title} | Akhil Vanga`);
      assert.equal(metadata.twitter?.description, study.seoDescription);
      assert.ok(study.seoDescription.length <= 160);
    }
  });

  it("includes every published case study without duplicates or invented modification dates", () => {
    const entries = sitemap();
    assert.equal(entries.length, new Set(entries.map(({ url }) => url)).size);
    for (const study of caseStudies) {
      assert.ok(entries.some(({ url }) => url === `${SITE_URL}/work/${study.slug}`));
    }
    assert.ok(entries.every((entry) => !entry.lastModified));
  });
});

describe("server-rendered counters", () => {
  it("renders final values before hydration, with stable accessible text", () => {
    for (const end of [12, 82]) {
      const html = renderToStaticMarkup(createElement(AnimatedCounter, { end, suffix: "+" }));
      assert.ok(html.includes(`<span class="sr-only">${end}+</span>`));
      assert.ok(html.includes(`<span aria-hidden="true">${end}+</span>`));
    }
  });
});
