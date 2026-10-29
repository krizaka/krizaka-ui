import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const release = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");

test("a brand export tells krizaka/.github, which opens one icons-sync pull request per consumer (krizaka/.github#388)", () => {
  const exportAt = release.indexOf("node tools/export-brand.mjs");
  const dispatchAt = release.indexOf("brand-changed");
  assert.ok(exportAt > 0 && dispatchAt > exportAt, "the event is sent after the export, never before the files are on the CDN");
  assert.match(release, /repositories: \.github/, "the token is scoped to the one repository that receives the event");
  assert.match(release, /repos\/krizaka\/\.github\/dispatches/);
  assert.match(release, /steps\.ver\.outputs\.changed == 'true'/);
});
