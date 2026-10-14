// Never an empty map: every map example that reads tiles has its photograph, in both themes, on the CDN.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { mapSnapshotOf } from "../lib/map-gate.ts";

const examples = readFileSync(new URL("../lib/ui-examples.ts", import.meta.url), "utf8");
const tiled = [...examples.matchAll(/"(map\/[a-z-]+)"/g)].map((m) => m[1]).filter((key) => key !== "map/static");

test("every map example that reads tiles has a photograph, dark and light, on the Krizaka CDN", () => {
  assert.ok(tiled.length >= 3, tiled.join(", "));
  for (const key of tiled) {
    const shot = mapSnapshotOf(key);
    assert.ok(shot, `${key}: no photograph in lib/map-snapshots.json`);
    for (const theme of ["dark", "light"]) assert.match(shot[theme], /^https:\/\/krizaka-assets\.b-cdn\.net\/ui\/maps\/.+\.[0-9a-f]{10}\.png$/, `${key} ${theme}`);
  }
  assert.equal(mapSnapshotOf("map/static"), null, "the static map draws without tiles");
});
