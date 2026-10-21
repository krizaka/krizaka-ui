// The examples of the registry point at repositories and pages that exist (the docs crawler found « See the code » on a
// repository that was never created, and Discussions on an organisation that has none).
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const dir = new URL("../../../packages/ui/registry/examples/", import.meta.url);
const sources = readdirSync(dir).flatMap((name) => {
  const folder = new URL(`${name}/`, dir);
  return statSync(folder).isDirectory() ? readdirSync(folder).filter((f) => f.endsWith(".tsx")).map((f) => [`${name}/${f}`, readFileSync(new URL(f, folder), "utf8")]) : [];
});

test("no example links to a repository or a Discussions page that does not exist", () => {
  assert.ok(sources.length > 300);
  const dead = [/github\.com\/krizaka\/krizaka-java\b/, /github\.com\/orgs\/krizaka\/discussions/];
  const hits = sources.filter(([, code]) => dead.some((re) => re.test(code))).map(([file]) => file);
  assert.deepEqual(hits, []);
});

test("no example leaves the page: a sample never navigates (the docs would show the site's 404)", () => {
  const leaving = sources.filter(([, code]) => /window\.location\.(assign|replace|href\s*=)|location\.href\s*=/.test(code)).map(([file]) => file);
  assert.deepEqual(leaving, []);
});
