// Never an empty map: every map example that reads tiles has its photograph, in both themes, on the CDN.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { mapSnapshotOf } from "../lib/map-gate.ts";

const examples = readFileSync(new URL("../lib/ui-examples.ts", import.meta.url), "utf8");
// An example reads tiles when its source draws a live `<Map …>`: the static ones (`StaticMap`, `MapSheet` over a picture, `MapPin`) need no photograph.
const reads = (key) => /<Map[\s>]/.test(readFileSync(new URL(`../../../packages/ui/registry/examples/${key}.tsx`, import.meta.url), "utf8"));
const tiled = [...examples.matchAll(/"(map\/[a-z-]+)"/g)].map((m) => m[1]).filter(reads);

test("every map example that reads tiles has a photograph, dark and light, on the Krizaka CDN", () => {
  assert.ok(tiled.length >= 3, tiled.join(", "));
  for (const key of tiled) {
    const shot = mapSnapshotOf(key);
    assert.ok(shot, `${key}: no photograph in lib/map-snapshots.json`);
    for (const theme of ["dark", "light"]) assert.match(shot[theme], /^https:\/\/krizaka-assets\.b-cdn\.net\/ui\/maps\/.+\.[0-9a-f]{10}\.png$/, `${key} ${theme}`);
  }
  for (const key of ["map/static", "map/place-sheet", "map/pins"]) assert.equal(mapSnapshotOf(key), null, `${key} draws without tiles`);
});
