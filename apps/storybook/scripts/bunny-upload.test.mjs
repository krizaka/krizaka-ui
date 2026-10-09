// Unit tests of the Bunny mirror script (node --test): cache headers, content types, plan, arguments, retries.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { CACHE, cacheControlFor, contentTypeFor, edgeRules, parseArgs, plan, pool, request,RULE_PATTERNS } from "./bunny-upload.mjs";

test("hashed Vite chunks are immutable for a year", () => {
  for (const path of [
    "assets/Button.stories-C1y4cbCJ.js",
    "assets/iframe-DLK3Loz4.css",
    "assets/KrizakaLogo-CEyAlfy-.js",
    "assets/WithTooltip-CDUNV5IS-BePJQwEa.js",
    "assets/chunk-UAWMPV5J-_VQykhfG.js",
  ]) assert.equal(cacheControlFor(path), CACHE.immutable, path);
});

test("entry points are revalidated on every request", () => {
  for (const path of ["index.html", "iframe.html", "index.json", "project.json"]) assert.equal(cacheControlFor(path), CACHE.entry, path);
});

test("unhashed files get a short cache", () => {
  for (const path of [
    "sb-manager/runtime.js",
    "sb-manager/globals-runtime.js",
    "sb-common-assets/nunito-sans-bold.woff2",
    "favicon.svg",
    "vite-inject-mocker-entry.js",
    "assets/no-hash.js", // a file in assets/ without a hash is not trusted as immutable
  ]) assert.equal(cacheControlFor(path), CACHE.standard, path);
});

/** The glob of a Bunny Url trigger: `*` matches anything. */
const glob = (pattern) => new RegExp(`^${pattern.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\/]/g, "\\$&")).join(".*")}$`);
const matches = (url, trigger) => {
  const hit = trigger.PatternMatches.some((p) => glob(p).test(url));
  return trigger.PatternMatchingType === 2 ? !hit : hit;
};

test("the edge rules give every URL the same Cache-Control as the file policy, exactly once", () => {
  const paths = ["assets/Button.stories-C1y4cbCJ.js", "index.html", "iframe.html", "index.json", "sb-manager/runtime.js", "favicon.svg"];
  for (const dest of ["latest", "2.0.0-beta.2"]) {
    for (const path of paths) {
      const url = `https://ui.krizaka.com/${dest}/${path}`;
      const hits = edgeRules().filter((rule) => rule.Triggers.every((t) => matches(url, t)));
      assert.equal(hits.length, 1, url);
      assert.equal(hits[0].ActionParameter2, cacheControlFor(path), url);
    }
  }
  const folder = edgeRules().filter((rule) => rule.Triggers.every((t) => matches("https://ui.krizaka.com/latest/", t)));
  assert.deepEqual(folder.map((r) => r.ActionParameter2), [CACHE.entry]);
  assert.deepEqual(RULE_PATTERNS.immutable, ["*/assets/*"]);
});

test("content types follow the extension; unknown extensions have none", () => {
  assert.equal(contentTypeFor("index.html"), "text/html; charset=utf-8");
  assert.equal(contentTypeFor("assets/a-12345678.js"), "text/javascript; charset=utf-8");
  assert.equal(contentTypeFor("x.woff2"), "font/woff2");
  assert.equal(contentTypeFor("x.svg"), "image/svg+xml");
  assert.equal(contentTypeFor("x.exe"), undefined);
});

test("arguments: destinations are `latest` or a version", () => {
  const options = parseArgs(["--dir", "s", "--dest", "latest", "--dest", "2.0.0-beta.1", "--root", "i.html", "--dry-run", "--purge", "--rules"]);
  assert.deepEqual(options, { dir: "s", dests: ["latest", "2.0.0-beta.1"], root: "i.html", dryRun: true, purge: true, rules: true });
  assert.throws(() => parseArgs(["--dir", "s", "--dest", "../etc"]), /--dest/);
  assert.throws(() => parseArgs(["--dir", "s", "--dest", "@krizaka/ui@2.0.0"]), /--dest/);
  assert.throws(() => parseArgs(["--dir", "s"]), /--dest/);
  assert.throws(() => parseArgs(["--dest", "latest"]), /--dir/);
  assert.throws(() => parseArgs(["--dir", "--dest"]), /needs a value/);
  assert.throws(() => parseArgs(["--dir", "s", "--dest", "latest", "--nope"]), /unknown/);
});

test("plan: every file under every destination, plus the root redirect", () => {
  const dir = mkdtempSync(join(tmpdir(), "bunny-"));
  mkdirSync(join(dir, "assets"));
  writeFileSync(join(dir, "index.html"), "<html>");
  writeFileSync(join(dir, "assets", "a-12345678.js"), "1");
  const root = join(mkdtempSync(join(tmpdir(), "bunny-root-")), "index.html");
  writeFileSync(root, "<meta>");
  const keys = plan({ dir, dests: ["latest", "1.2.3"], root }).map((u) => `${u.key} ${u.cacheControl}`).sort();
  assert.deepEqual(keys, [
    `1.2.3/assets/a-12345678.js ${CACHE.immutable}`,
    `1.2.3/index.html ${CACHE.entry}`,
    `index.html ${CACHE.entry}`,
    `latest/assets/a-12345678.js ${CACHE.immutable}`,
    `latest/index.html ${CACHE.entry}`,
  ]);
  writeFileSync(join(dir, "x.exe"), "");
  assert.throws(() => plan({ dir, dests: ["latest"] }), /no Content-Type/);
  assert.throws(() => plan({ dir: join(dir, "assets"), dests: ["latest"] }), /not a Storybook build/);
});

const response = (status) => ({ ok: status < 300, status, text: async () => "" });

test("request retries 5xx and 429, not 4xx", async () => {
  let calls = 0;
  const flaky = async () => response(++calls < 3 ? (calls === 1 ? 503 : 429) : 201);
  assert.equal((await request("u", { method: "PUT" }, { delay: 0, fetchImpl: flaky })).status, 201);
  assert.equal(calls, 3);

  calls = 0;
  const denied = async () => (calls++, response(401));
  await assert.rejects(request("u", { method: "PUT" }, { delay: 0, fetchImpl: denied }), /401/);
  assert.equal(calls, 1);

  calls = 0;
  const down = async () => {
    calls++;
    throw new Error("ECONNRESET");
  };
  await assert.rejects(request("u", { method: "PUT" }, { attempts: 3, delay: 0, fetchImpl: down }), /ECONNRESET/);
  assert.equal(calls, 3);
});

test("pool never runs more than the limit at once and runs everything", async () => {
  let running = 0;
  let peak = 0;
  const done = [];
  await pool(Array.from({ length: 30 }, (_, i) => i), 8, async (i) => {
    peak = Math.max(peak, ++running);
    await new Promise((r) => setTimeout(r, 1));
    running--;
    done.push(i);
  });
  assert.equal(peak, 8);
  assert.equal(done.length, 30);
});
