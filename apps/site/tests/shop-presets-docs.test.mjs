// The « Shop presets » page (ui.krizaka.com/foundations/shop-presets) names every preset of @krizaka/tokens and nothing else:
// the table is written, the data is the source — so a new or renamed preset fails here until the page says so.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { shopPresets } from "@krizaka/tokens/shop-presets";

const page = readFileSync(new URL("../content/docs/foundations/shop-presets.mdx", import.meta.url), "utf8");

test("the page lists every preset by its id, its name, its accent and its paper", () => {
  assert.equal(shopPresets.length, 12);
  for (const p of shopPresets) {
    const row = page.split("\n").find((line) => line.includes(`\`${p.id}\``));
    assert.ok(row, `${p.id} is not in the table`);
    assert.ok(row.includes(p.name), `${p.id}: the name ${p.name}`);
    assert.ok(row.includes(p.paper), `${p.id}: the paper ${p.paper}`);
    assert.ok(row.includes(p.accent.split(":")[0]), `${p.id}: the accent ${p.accent}`);
    assert.ok(row.includes(p.density), `${p.id}: the density`);
  }
});

test("the table has no preset the data does not have", () => {
  const ids = [...page.matchAll(/\| `([a-z]+-[a-z]+)` \|/g)].map((m) => m[1]);
  assert.deepEqual([...ids].sort(), shopPresets.map((p) => p.id).sort());
});
