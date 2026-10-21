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
  assert.deepEqual([...landing.matchAll(/\{ id: "(\w+)", path: "([\w/]+)" \}/g)].map((m) => m[2]), ["/components", "/foundations/tokens", "/templates"]);
  assert.equal((hero.match(/<Button\b/g) ?? []).length, 0, "the ways in are the cards, not a row of buttons");
  assert.match(hero, /<CardGrid [^>]*reveal=\{false\}/, "the first screen is painted at once, never revealed");
});

// The right half of the first screen (krizaka-ui#417, Cahier): one figure, never a collage, never a screenshot.
test("the first screen's right-hand figure is ONE plate of real kit pieces, server-rendered, numbered, inert", () => {
  const hero = landing.slice(landing.indexOf('<header className="kz-home-hero">'), landing.indexOf("</header>"));
  assert.equal((hero.match(/<Sheet /g) ?? []).length, 1, "one figure in the hero");
  assert.equal((landing.match(/<figure /g) ?? []).length, 1);
  for (const piece of ["<Button ", "<Field.Root>", "<Input ", "<Badge ", "<CardRoot>"]) assert.ok(landing.includes(piece), `the plate draws a real ${piece.trim()}`);
  assert.ok(!/^"use client"/m.test(landing), "the plate is a Server Component: no hydration");
  assert.ok(!/<img|<Image|\.png|\.webp|<canvas|<video/.test(landing), "never a screenshot");
  assert.match(landing, /className="kz-sheet-specimen" aria-hidden inert/, "the specimens are inert and hidden from assistive technology; the captions carry the text");
  assert.equal((landing.match(/\{sheet\.figure\} \{i \+ 1\}/g) ?? []).length, 1, "each figure is numbered by its position");
});

test("the plate has no motion and no layout shift: no animation, no transition, no image, a fixed grid", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const sheet = css.split("\n").filter((l) => /\.kz-sheet/.test(l)).join("\n");
  assert.ok(sheet.length > 0);
  assert.ok(!/animation|transition|@keyframes|backdrop-filter|blur\(/.test(sheet), "a still plate");
  assert.match(css, /@media \(min-width: 1024px\) \{[^}]*\.kz-home-hero \{ grid-template-columns: minmax\(0, 1\.15fr\) minmax\(0, 1fr\)/, "two columns from 1024 px, one under it (the figure under the text)");
});

test("every word of the home is a message, in English and in French", () => {
  for (const locale of ["en", "fr"]) {
    const l = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")).landing;
    assert.deepEqual(Object.keys(l.ways).sort(), ["components", "foundations", "label", "templates"]);
    for (const k of ["title", "lead"]) assert.ok(l[k].length > 0);
    assert.ok(l.search.placeholder.length > 0);
    for (const k of ["title", "subtitle", "figure", "button", "buttonLabel", "field", "fieldLabel", "fieldPlaceholder", "fieldHint", "badge", "badgeStable", "badgeNew", "card", "cardTitle", "cardText"]) assert.ok(l.sheet[k]?.length > 0, `landing.sheet.${k} in ${locale}`);
  }
});
