import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { assertWritable, build, drawnItems, fileOf, founderItems, KINDS, manifestOf, PREFIX } from "./export-defaults.mjs";

test("reads the founder's pictures from file names only, and nothing else in the folder", () => {
  const items = founderItems(["manifest.json", "avatar-02-rasta-creative.png", "avatar-02-rasta-creative.webp", "avatar-01-boom-bap.png", "banner-07-the-mascot-flock.png", "notes.txt"]);
  assert.deepEqual(
    items.map((i) => `${i.kind}:${i.id}`),
    ["banner:the-mascot-flock", "person:boom-bap", "person:rasta-creative"],
  );
});

test("draws a set per kind from the code: six each, all different", () => {
  const items = drawnItems();
  assert.equal(items.length, 24);
  assert.deepEqual([...new Set(items.map((i) => i.kind))], ["person", "folder", "organisation", "shop"]);
  assert.equal(new Set(items.map((i) => i.id)).size, 24);
});

test("names a file <kind>/<id>-<size>.webp, or <id>.svg", () => {
  assert.equal(fileOf("person", "boom-bap", 512), "person/boom-bap-512.webp");
  assert.equal(fileOf("folder", "folder-2", "svg"), "folder/folder-2.svg");
  assert.equal(fileOf("banner", "the-neon-flamingo", 1920), "banner/the-neon-flamingo-1920.webp");
});

test("writes only under defaults/v1, in a known kind folder", () => {
  for (const kind of KINDS) assert.equal(assertWritable(`${PREFIX}/${kind}/a-1-256.webp`), `${PREFIX}/${kind}/a-1-256.webp`);
  assert.equal(assertWritable(`${PREFIX}/manifest.json`), `${PREFIX}/manifest.json`);
  for (const bad of ["brand/krizaka/logo.svg", "people/defaults/v1/krizaka/person-1.svg", `${PREFIX}/avatar/x.webp`, `${PREFIX}/person/../x.webp`, `${PREFIX}/person/X.webp`, "defaults/v2/person/a.svg"]) {
    assert.throws(() => assertWritable(bad), /outside/);
  }
});

test("builds the drawn sets and a manifest that holds paths, sizes and hashes only; an unrelated file of the founder folder is never read", async () => {
  const dir = mkdtempSync(join(tmpdir(), "founder-"));
  writeFileSync(join(dir, "manifest.json"), JSON.stringify({ private: "SENTINEL-NEVER-PUBLISHED" }));
  const { files } = await build({ founderDirs: [dir] });
  assert.equal(files.size, 24 * 4 + 1);
  const manifest = JSON.parse(files.get(`${PREFIX}/manifest.json`).toString());
  assert.deepEqual(Object.keys(manifest.files[0]).sort(), ["bytes", "path", "sha256"]);
  for (const body of files.values()) assert.ok(!body.toString("latin1").includes("SENTINEL-NEVER-PUBLISHED"));
  for (const path of files.keys()) assertWritable(path);
  assert.equal(manifestOf(files, "1.0.0").files.length, 24 * 4);
});
