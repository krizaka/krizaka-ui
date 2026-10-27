// The addresses of ui.krizaka.com (lib/urls.ts): the old krizaka.com/docs/ui pages map one by one, links get the reader's
// language, and every page the IA lists lives at its address.
import assert from "node:assert/strict";
import { test } from "node:test";

import { GROUP_PAGES, templatePurposeSlug } from "../lib/ui-ia.ts";
import { absoluteUrl, componentPath, localePath, pathOfLegacySlug, resolveDocHref } from "../lib/urls.ts";

test("every old /docs/ui page has its new address", () => {
  const cases = {
    "": "/",
    installation: "/installation",
    theming: "/theming",
    tokens: "/foundations/tokens",
    typography: "/foundations/typography",
    icons: "/foundations/icons",
    motion: "/foundations/motion",
    navigation: "/foundations/navigation",
    layouts: "/foundations/layouts",
    "brand-marks": "/foundations/brand-marks",
    "cahier-site": "/foundations/cahier-site",
    tailwind: "/packages/tailwind",
    query: "/packages/query",
    config: "/packages/config",
    mobile: "/mobile",
    templates: "/templates",
    screens: "/templates",
    "templates-convince": "/templates/convince",
    button: "/components/button",
    "line-chart": "/components/line-chart",
    "page-hero": "/components/page-hero",
  };
  for (const [slug, path] of Object.entries(cases)) assert.equal(pathOfLegacySlug(slug), path, slug || "(index)");
});

test("the IA's pages and the legacy map agree: every written or generated page of a group maps back to itself", () => {
  for (const pages of Object.values(GROUP_PAGES)) {
    for (const page of pages) {
      const slug = page === "index" ? "" : page.split("/").at(-1);
      assert.equal(pathOfLegacySlug(slug), page === "index" ? "/" : `/${page}`, page);
    }
  }
  assert.equal(pathOfLegacySlug("templates-act"), `/${templatePurposeSlug("act")}`);
});

test("English has no prefix, French lives under /fr", () => {
  assert.equal(localePath("en", "/"), "/");
  assert.equal(localePath("fr", "/"), "/fr");
  assert.equal(componentPath("en", "button"), "/components/button");
  assert.equal(componentPath("fr", "button"), "/fr/components/button");
  assert.equal(absoluteUrl("en", "/"), "https://ui.krizaka.com/");
  assert.equal(absoluteUrl("fr", "/components/button"), "https://ui.krizaka.com/fr/components/button/");
});

test("a link written in a doc gets the reader's language; an old /docs/ui link its new address; others stay", () => {
  assert.equal(resolveDocHref("/foundations/tokens", "fr"), "/fr/foundations/tokens");
  assert.equal(resolveDocHref("/foundations/tokens", "en"), "/foundations/tokens");
  assert.equal(resolveDocHref("/docs/ui/tokens#roles", "fr"), "/fr/foundations/tokens#roles");
  assert.equal(resolveDocHref("/docs/ui", "en"), "/");
  assert.equal(resolveDocHref("https://www.krizaka.com/products", "fr"), "https://www.krizaka.com/products");
  assert.equal(resolveDocHref("#props", "en"), "#props");
  assert.equal(resolveDocHref(undefined, "en"), undefined);
});
