// The DevX check (krizaka-ui#837): union gzip, the exports lookup, the static rules and the fixture, on fixtures.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { gzipSync } from "node:zlib";
import { distFileOf, fixture, hygiene, unionGzip } from "./devx-check.mjs";

const pkg = (over = {}) => ({
  sideEffects: ["**/*.css"],
  exports: { "./button": { types: "./dist/button.d.ts", import: "./dist/button.js" }, "./blocks.css": "./dist/blocks.css" },
  ...over,
});
const budget = { typicalPage: { entries: ["button"], gzipBytes: 1 } };

test("unionGzip counts a shared chunk once", () => {
  const dist = mkdtempSync(join(tmpdir(), "devx-"));
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, "a.js"), 'import { x } from "./shared.js";\nexport const a = x;');
  writeFileSync(join(dist, "b.js"), 'import { x } from "./shared.js";\nexport const b = x;');
  writeFileSync(join(dist, "shared.js"), "export const x = 'shared'.repeat(50);");
  const alone = unionGzip(dist, ["a.js"]);
  const both = unionGzip(dist, ["a.js", "b.js"]);
  const bGz = gzipSync('import { x } from "./shared.js";\nexport const b = x;').length;
  assert.equal(both, alone + bGz, "b adds only its own file: the shared chunk is counted once");
});

test("distFileOf reads the import target of an export key", () => {
  assert.equal(distFileOf(pkg(), "button"), "button.js");
  assert.equal(distFileOf(pkg(), "gone"), null);
});

test("hygiene passes a typed, tree-shakeable package", () => {
  assert.deepEqual(hygiene(pkg(), budget), []);
});

test("hygiene refuses a missing sideEffects, an untyped export and a typical entry that left", () => {
  assert.match(hygiene(pkg({ sideEffects: undefined }), budget).join(), /sideEffects/);
  assert.match(hygiene(pkg({ exports: { "./button": { import: "./dist/button.js" } } }), budget).join(), /export \.\/button lacks its types/);
  assert.match(hygiene(pkg(), { typicalPage: { entries: ["iso"] } }).join(), /"iso", which @krizaka\/ui no longer exports/);
});

test("fixture is one deep import per entry, each used", () => {
  const text = fixture(["button", "card"]);
  assert.match(text, /from "@krizaka\/ui\/button"/);
  assert.match(text, /from "@krizaka\/ui\/card"/);
  assert.equal(text.split("\n").filter((l) => l.startsWith("export const")).length, 2);
});
