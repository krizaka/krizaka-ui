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

const heroOf = () => landing.slice(landing.indexOf("<SiteCahierHero"), landing.indexOf("</SiteCahierHero>"));

test("its first screen (#3598): one title, ONE filled button to the install guide, the install line, the search, the Builder as a text line", () => {
  const hero = heroOf();
  assert.match(hero, /<SiteCahierHero [^>]*size="wide"/, "the hero is on the Cahier hero, as wide as the bar");
  assert.match(hero, /aside=\{<Sheet /, "Plate I is the hero's aside");
  assert.equal((hero.match(/<Button\b/g) ?? []).length, 1, "one button in the hero");
  assert.equal((hero.match(/<Button variant="primary" asChild>/g) ?? []).length, 1, "exactly one filled (primary) button");
  assert.match(hero, /localePath\(locale, GET_STARTED_PATH\)/, "the primary action leads to the install guide, in the page's locale");
  assert.match(hero, /<CodeBlock code=\{WEB_INSTALL\}/);
  assert.match(hero, /<HomeSearch /);
  assert.match(hero, /<p className="kz-home-builder">[^]*localePath\(locale, BUILDER_PATH\)/, "the Builder is a text line with a link, from the route table");
  assert.ok(!/<LinkCard|<CardGrid|WAYS/.test(hero), "the three entry cards left the hero");
  assert.ok(!/["'`]\/builder/.test(landing), "the builder path is never typed in the hero");
});

test("the page container takes the bar's width (the Cahier hero's `wide` frame is 88rem, the bar's --kz-page-max-docs)", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const ui = readFileSync(new URL("../../../packages/ui/src/blocks.css", import.meta.url), "utf8");
  const max = (v) => css.match(new RegExp(`${v}:\\s*([\\d.]+rem)`))?.[1];
  assert.equal(max("--kz-page-max-docs"), "88rem");
  assert.match(ui, /\.kz-frame\[data-size="wide"\] \{ --kz-page-max: 88rem; \}/);
});

// The right half of the first screen (krizaka-ui#417, Cahier): one figure, never a collage, never a screenshot.
test("the first screen's right-hand figure is ONE plate of real kit pieces, server-rendered, numbered, inert", () => {
  const hero = heroOf();
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
  assert.match(css, /@media \(min-width: 1024px\) \{[^}]*\.kz-home-hero\.kz-hero > \.kz-frame \{ grid-template-columns: minmax\(0, 1\.15fr\) minmax\(0, 1fr\)/, "two columns from 1024 px, one under it (the figure under the text)");
});

test("every word of the home is a message, in English and in French", () => {
  for (const locale of ["en", "fr"]) {
    const l = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")).landing;
    assert.equal(l.ways, undefined, "the entry cards are gone");
    for (const k of ["title", "lead"]) assert.ok(l[k].length > 0);
    assert.ok(l.search.placeholder.length > 0);
    for (const k of ["title", "subtitle", "figure", "button", "buttonLabel", "field", "fieldLabel", "fieldPlaceholder", "fieldHint", "badge", "badgeStable", "badgeNew", "card", "cardTitle", "cardText"]) assert.ok(l.sheet[k]?.length > 0, `landing.sheet.${k} in ${locale}`);
  }
});

test("the hero's primary action and Builder line have words in FR and EN", () => {
  const words = { en: ["Get started", "Or try the components live in the", "UI Builder"], fr: ["Démarrer", "Ou essayez les composants en direct dans", "UI Builder"] };
  for (const code of ["en", "fr"]) {
    const l = JSON.parse(readFileSync(new URL(`../messages/${code}.json`, import.meta.url), "utf8")).landing;
    assert.deepEqual([l.getStarted, l.builderBefore, l.builderLink], words[code], `${code}: landing words`);
    assert.equal(l.tryBuilder, undefined);
  }
});
