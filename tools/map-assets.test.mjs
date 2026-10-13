import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { contentType, encodePath, filesOf, parseEnv, publishable } from "./map-assets.mjs";

test("publishes dated tile files and glyph ranges only", () => {
  assert.equal(publishable("tiles/quebec-20261012.pmtiles"), true);
  assert.equal(publishable("tiles/quebec.pmtiles"), false);
  assert.equal(publishable("fonts/Noto Sans Regular/0-255.pbf"), true);
  assert.equal(publishable("fonts/../secret.pbf"), false);
  assert.equal(contentType("tiles/world-20261012.pmtiles"), "application/vnd.pmtiles");
  assert.equal(encodePath("maps/v1/fonts/Noto Sans Regular/0-255.pbf"), "maps/v1/fonts/Noto%20Sans%20Regular/0-255.pbf");
});

test("walks a folder and reads an env file", () => {
  const dir = mkdtempSync(join(tmpdir(), "map-assets-"));
  mkdirSync(join(dir, "fonts", "Noto Sans Regular"), { recursive: true });
  writeFileSync(join(dir, "fonts", "Noto Sans Regular", "0-255.pbf"), "x");
  assert.deepEqual(filesOf(dir), ["fonts/Noto Sans Regular/0-255.pbf"]);
  assert.deepEqual(parseEnv('A=1\nexport B="two"\n# C=3'), { A: "1", B: "two" });
});
