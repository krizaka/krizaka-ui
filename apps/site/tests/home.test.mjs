// The home's install line (lib/install.ts) and its « rest of the family ».
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { NATIVE_INSTALL, WEB_INSTALL } from "../lib/install.ts";

test("the hero's install line is the one the Installation page documents", () => {
  const page = readFileSync(new URL("../content/docs/installation.mdx", import.meta.url), "utf8");
  assert.ok(page.includes(WEB_INSTALL), "installation.mdx documents WEB_INSTALL");
  assert.match(NATIVE_INSTALL, /npm install @krizaka\/ui/);
});

test("the home's « rest of the family » comes from @krizaka/ui/sites: the other open-source sites, then the company — never typed", async () => {
  const { familyLinks } = await import("../lib/family-links.ts");
  const { sites } = await import("@krizaka/ui/sites");
  const links = familyLinks("ui");
  assert.deepEqual(links.map((s) => s.id), [...sites.filter((s) => s.group === "open-source" && s.id !== "ui").map((s) => s.id), "krizaka"]);
  assert.ok(links.some((s) => s.id === "java") && links.some((s) => s.id === "motion"));
  assert.ok(links.every((s) => /^https:\/\//.test(s.url)));
});

// Peer review (krizaka-ui#434): « the docs home is very AI and overloaded ». The first screen is what it is, the install
// line, the three ways in and the search — nothing more (the browser check is scripts/home-geometry.mjs).
const landing = readFileSync(new URL("../app/components/landing/Landing.tsx", import.meta.url), "utf8");

test("the home is calm: no figures, no live kit, no scene, no playground, no tabs", () => {
  for (const gone of ["NumberTicker", "HeroKit", "HomeStudio", "ProductScene", "PlayStage", "TabsRoot", "Sparkline", "FamilyCards", "kz-land-eyebrow"]) {
    assert.ok(!landing.includes(gone), `the home still uses ${gone}`);
  }
});

test("its first screen: one title, the install line, three ways in (components, foundations, templates), the search", () => {
  const hero = landing.slice(landing.indexOf('<header className="kz-home-hero">'), landing.indexOf("</header>"));
  assert.equal((hero.match(/<h1>/g) ?? []).length, 1);
  assert.match(hero, /<CodeBlock code=\{WEB_INSTALL\}/);
  assert.match(hero, /<HomeSearch /);
  assert.deepEqual([...landing.matchAll(/\{ id: "(\w+)", path: "(\/\w+)" \}/g)].map((m) => m[2]), ["/components", "/foundations", "/templates"]);
  assert.equal((hero.match(/<Button\b/g) ?? []).length, 0, "the ways in are the cards, not a row of buttons");
  assert.match(hero, /<CardGrid [^>]*reveal=\{false\}/, "the first screen is painted at once, never revealed");
});

test("every word of the home is a message, in English and in French", () => {
  for (const locale of ["en", "fr"]) {
    const l = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")).landing;
    assert.deepEqual(Object.keys(l.ways).sort(), ["components", "foundations", "label", "templates"]);
    for (const k of ["title", "lead"]) assert.ok(l[k].length > 0);
    assert.ok(l.search.placeholder.length > 0);
  }
});
