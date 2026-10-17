// /platforms — the parity matrix is generated from the registries: every component carries web · native · desktop, an
// absence always says why (and a gap its issue), the page sits in the Platforms group, and its words exist in both
// languages.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { GROUP_PAGES, GROUPS, MOBILE_PAGE, PLATFORMS_PAGE } from "../lib/ui-ia.ts";
import { pathOfLegacySlug } from "../lib/urls.ts";

const root = new URL("..", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const items = ["ui", "charts"].flatMap((pkg) => read(`node_modules/@krizaka/${pkg}/registry/index.json`).items.map((entry) => ({ pkg, ...entry })));

test("every component of both registries carries its row of the matrix", () => {
  assert.ok(items.length > 150);
  for (const item of items) {
    assert.ok(item.parity, `${item.pkg}/${item.name}: no parity — rebuild the registry (meta.parity)`);
    for (const platform of ["web", "native", "desktop"]) {
      const cell = item.parity[platform];
      assert.ok(["yes", "desktop", "gap", "n/a"].includes(cell?.state), `${item.name}.${platform}`);
      if (cell.state === "gap") assert.match(cell.issue, /^krizaka\/[a-z0-9.-]+#\d+$/, `${item.name}.${platform}: a gap names its issue`);
      if (cell.state === "gap" || cell.state === "n/a") assert.ok(cell.reason.length >= 12, `${item.name}.${platform}: why`);
    }
    // The side it has is the side `platforms` says.
    assert.equal(item.parity.web.state === "yes", item.platforms !== "native", `${item.name}: web`);
    assert.equal(item.parity.native.state === "yes", item.platforms !== "web", `${item.name}: native`);
  }
});

test("the desktop form is the app shell's, and a native-only component is never 'yes' on the desktop", () => {
  for (const item of items.filter((i) => i.platforms === "native")) assert.ok(["gap", "n/a"].includes(item.parity.desktop.state), item.name);
});

test("Platforms is a group of the sidebar: the matrix, then the mobile parity", () => {
  assert.ok(GROUPS.includes("platforms"));
  assert.ok(!GROUPS.includes("mobile"));
  assert.deepEqual(GROUP_PAGES.platforms, [PLATFORMS_PAGE, MOBILE_PAGE]);
  assert.equal(pathOfLegacySlug("platforms"), "/platforms");
  assert.equal(pathOfLegacySlug("mobile"), "/mobile");
});

test("the page's words exist in English and French, the three platforms included", () => {
  for (const lang of ["en", "fr"]) {
    const docs = read(`messages/${lang}.json`).docs;
    assert.ok(docs.pages.ui.platforms.title && docs.pages.ui.platforms.description, `${lang}: page`);
    const p = docs.ia.platforms;
    for (const id of ["web", "native", "desktop"]) assert.ok(p.cards[id].title && p.cards[id].what.length > 40, `${lang}: ${id}`);
    for (const state of ["yes", "desktop", "gap", "na"]) assert.ok(p.states[state], `${lang}: ${state}`);
    assert.match(p.count, /\{yes\}.*\{gap\}.*\{na\}/);
  }
});
