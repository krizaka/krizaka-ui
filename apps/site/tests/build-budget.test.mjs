// Page generation has a budget (Next stops a page at 60 s, three tries): it does CPU work and reads files, never the network.
// The footer, on every page, once awaited the changelog, which fetched the npm packuments (megabytes each, parsed in every
// worker) — the French component pages timed out on the Documentation site job and blocked every release. The dates of the
// releases are now read once, before the build (scripts/gen-release-times.mjs), into a small file the pages read.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const root = new URL("..", import.meta.url);
const read = (f) => readFileSync(new URL(f, root), "utf8");
const walk = (dir) =>
  readdirSync(new URL(`${dir}/`, root)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(new URL(rel, root)).isDirectory() ? walk(rel) : [rel];
  });

/* Server code that may fetch while pages are generated, with why: the home alone (two pages), 8 s at most, once per worker. */
const MAY_FETCH = new Set(["lib/npm-downloads.ts"]);

test("no page reads the network while it is generated (the generators of scripts/ do, once, before the build)", () => {
  const offenders = [...walk("lib"), ...walk("app")]
    .filter((f) => /\.(ts|tsx)$/.test(f) && !MAY_FETCH.has(f))
    .filter((f) => !/"use client"/.test(read(f).slice(0, 200)))
    .filter((f) => /\bfetch\(/.test(read(f)));
  assert.deepEqual(offenders, []);
});

test("the changelog's dates come from the file written before the build, and the footer does not wait for the network", () => {
  const changelog = read("lib/changelog.ts");
  assert.match(changelog, /release-times\.json/);
  assert.doesNotMatch(changelog, /registry\.npmjs\.org/);
  assert.match(read("package.json"), /gen-release-times\.mjs/);
});

test("the generation timeout is room for a slow runner, not a way to hide a slow page", () => {
  const config = read("next.config.ts");
  const seconds = Number(/staticPageGenerationTimeout:\s*(\d+)/.exec(config)?.[1]);
  assert.ok(seconds >= 120 && seconds <= 240, `staticPageGenerationTimeout ${seconds}`);
});
