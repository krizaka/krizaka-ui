// node --test tools/ — the files the documentation site generates into lib/ (apps/site/.gitignore) are outputs of turbo's
// `build`: a cache hit restores them. One left out is missing after a replayed build, and the site's `lint`
// (`gen-ui-docs.mjs --check`) then fails as soon as its own cache misses — a change to the root eslint.config.mjs did it
// (krizaka-ui#980: lib/ui-example-keys.ts and lib/ui-registry-data.ts "stale").
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");
const generated = readFileSync(join(root, "apps", "site", ".gitignore"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("lib/"));
const outputs = JSON.parse(readFileSync(join(root, "turbo.json"), "utf8")).tasks.build.outputs;

test("the site's generated lib/ files are found in apps/site/.gitignore", () => {
  assert.ok(generated.length > 0);
});

for (const file of generated) {
  test(`${file} is an output of turbo's build`, () => {
    assert.ok(outputs.includes(file), `${file} is generated but not in turbo.json tasks.build.outputs`);
  });
}
