// The demo at /builder (lib/builder-demo.ts): the starter page is a valid document, the three canned attacks are refused
// by the same validateDocument a server would run, and the French that is missing is listed.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { validateDocument } from "@krizaka/ui-builder/document";

import { attack, ATTACKS, BLOCKS, checkDocument, describeIssue, missingTranslations, starterPage, toDocument, wordsFor } from "../lib/builder-demo.ts";

const starter = () => toDocument(starterPage());

test("the starter page is a valid schema 2 document, in English and French, with nothing missing", () => {
  const doc = starter();
  assert.equal(doc.schema, 2);
  assert.deepEqual(doc.locales, ["en", "fr"]);
  assert.deepEqual(checkDocument(doc), { ok: true });
  assert.deepEqual(missingTranslations(doc, "fr"), []);
  assert.deepEqual(Object.keys(BLOCKS.blocks).sort(), ["CallToAction", "Feature", "Features", "Hero", "Quote"]);
});

test("the nested blocks of the editor become slots of the document", () => {
  const features = starter().blocks.find((block) => block.type === "Features");
  assert.equal(features?.slots.items?.length, 3);
  assert.equal(features?.props.items, undefined);
});

test("an empty slot is left out, not refused", () => {
  const data = starterPage();
  const features = data.content.find((c) => c.type === "Features");
  assert.ok(features);
  features.props.items = [];
  assert.deepEqual(checkDocument(toDocument(data)), { ok: true });
});

const refused = (id) => {
  const verdict = checkDocument(attack(id, starter()));
  assert.equal(verdict.ok, false, `${id} is refused`);
  return verdict.issues;
};

test("attack 1: a <script> in a text is refused with its path", () => {
  const issues = refused("script");
  assert.deepEqual(issues.map((i) => [i.path, i.code]), [["blocks.0.props.title.en", "unsafe_text"]]);
  assert.match(describeIssue(issues[0]), /text holds no markup/);
});

test("attack 2: an onClick prop is refused", () => {
  const issues = refused("handler");
  assert.deepEqual(issues.map((i) => [i.path, i.code]), [["blocks.0.props.onClick", "unsafe_key"]]);
});

test("attack 3: a __proto__ key is refused", () => {
  const issues = refused("proto");
  assert.equal(issues.length, 1);
  assert.match(issues[0].message, /__proto__/);
});

test("every attack of the row is covered above", () => {
  assert.deepEqual([...ATTACKS], ["script", "handler", "proto"]);
});

test("the attacked document is never the one the editor holds", () => {
  const doc = starter();
  const before = JSON.stringify(doc);
  for (const id of ATTACKS) attack(id, doc);
  assert.equal(JSON.stringify(doc), before);
});

// Guard of what 0.3.0 does NOT refuse: a `__proto__` key inside a block is dropped by the parser, it never reaches the
// value the host stores. The demo's third attack is therefore placed at the top of the document, where it is refused.
test("a __proto__ key inside a block never reaches the validated value", () => {
  const doc = starter();
  const hostile = { ...doc, blocks: doc.blocks.map((b, i) => (i === 0 ? { ...b, props: { ...b.props, ...JSON.parse('{"__proto__":{"isAdmin":true}}') } } : b)) };
  assert.equal(Object.hasOwn(hostile.blocks[0].props, "__proto__"), true);
  const result = validateDocument(hostile, { registry: BLOCKS });
  assert.equal(result.ok && Object.hasOwn(result.value.blocks[0].props, "__proto__"), false);
  assert.equal(({}).isAdmin, undefined);
});

test("a French field left empty is listed, with its path, and falls back to English", () => {
  const data = starterPage();
  const hero = data.content[0];
  hero.props.eyebrow = { en: "Bakery · Montréal" };
  const doc = toDocument(data);
  assert.deepEqual(checkDocument(doc), { ok: true });
  assert.deepEqual(missingTranslations(doc, "fr"), ["blocks.0.props.eyebrow"]);
  assert.deepEqual(missingTranslations(doc, "en"), []);
  assert.deepEqual(wordsFor(hero.props.eyebrow, "fr"), { text: "Bakery · Montréal", fallback: true });
  assert.deepEqual(wordsFor(hero.props.eyebrow, "en"), { text: "Bakery · Montréal", fallback: false });
});

test("a field missing in a nested block is listed with the nested path", () => {
  const data = starterPage();
  const features = data.content[1];
  features.props.items[0].props.body = { en: "A starter fed every day." };
  assert.deepEqual(missingTranslations(toDocument(data), "fr"), ["blocks.1.slots.items.0.props.body"]);
});

// The page's surroundings: listed, lazy, nothing stored.
const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("the sitemap, the llms.txt and the bar list /builder", () => {
  assert.match(source("app/sitemap.ts"), /"\/builder"/);
  assert.match(source("lib/llms.ts"), /\/builder/);
  assert.match(source("app/components/SiteBar.tsx"), /path: "\/builder"/);
});

test("the editor is a lazy, client-only chunk: no server module imports it", () => {
  const loader = source("app/components/builder/BuilderDemoLoader.tsx");
  assert.match(loader, /dynamic\(\(\) => import\("\.\/BuilderDemo"\), \{ ssr: false/);
  assert.doesNotMatch(loader.replace(/dynamic\([^\n]*\n/, ""), /BuilderDemo"/);
  assert.doesNotMatch(source("app/components/builder/BuilderPageView.tsx"), /from "\.\/BuilderDemo"/);
});

test("nothing is saved: no storage, no cookie, no network in the demo; the page says so", () => {
  for (const file of ["app/components/builder/BuilderDemo.tsx", "app/components/builder/builder-config.tsx", "lib/builder-demo.ts"]) {
    assert.doesNotMatch(source(file), /localStorage|sessionStorage|document\.cookie|indexedDB|\bfetch\(/, file);
  }
  for (const locale of ["en", "fr"]) {
    assert.match(JSON.parse(source(`messages/${locale}.json`)).site.builder.nothingSaved, locale === "en" ? /cookie/ : /cookie|témoin/);
  }
});

test("the editor's stylesheet is the one that asks no font from another site", () => {
  const demo = source("app/components/builder/BuilderDemo.tsx");
  assert.match(demo, /@krizaka\/ui-builder\/no-external\.css/);
  assert.doesNotMatch(demo, /ui-builder\/puck\.css/);
});

test("the demo runs the npm package, never a copy of it", () => {
  const pkg = JSON.parse(source("package.json"));
  assert.equal(pkg.dependencies["@krizaka/ui-builder"], "0.3.0");
});
