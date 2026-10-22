// The documentation crawler's pure parts (scripts/docs-crawl.mjs): the sitemap, the fast subset, the tolerated list and
// the counts per category. The browser part runs in CI against the exported site.
import assert from "node:assert/strict";
import { test } from "node:test";

import { CATEGORIES, parseArgs, parseShard, pathsOfSitemap, pickShard, pickSubset, summarize, toleratedBy } from "../scripts/docs-crawl.mjs";

const xml = `<urlset><url><loc>https://ui.krizaka.com/</loc></url><url><loc>https://ui.krizaka.com/components/button/</loc></url>
<url><loc>https://ui.krizaka.com/components/button/</loc></url><url><loc>https://ui.krizaka.com/fr/components/button/</loc></url></urlset>`;

test("a sitemap gives the paths, once each, whatever its host", () => {
  assert.deepEqual(pathsOfSitemap(xml), ["/", "/components/button/", "/fr/components/button/"]);
});

test("the fast subset keeps every page that is not a component page and samples the others, always with the key ones", () => {
  const components = Array.from({ length: 40 }, (_, i) => `/components/c${i}/`).concat(["/components/dialog/"]);
  const paths = ["/", "/templates/", ...components, "/fr/"];
  const subset = pickSubset(paths, 5);
  for (const p of ["/", "/templates/", "/fr/", "/components/dialog/"]) assert.ok(subset.includes(p), p);
  assert.ok(subset.filter((p) => p.startsWith("/components/")).length <= 6);
  assert.deepEqual(pickSubset(paths, 5), subset, "stable");
});

test("the counts are per category, and a tolerated problem is not a failure", () => {
  const { counts, tolerated } = summarize([
    { category: "console-error", tolerated: false },
    { category: "console-error", tolerated: true },
    { category: "dead-link", tolerated: false },
  ]);
  assert.equal(counts["console-error"], 1);
  assert.equal(tolerated["console-error"], 1);
  assert.equal(counts["dead-link"], 1);
  assert.deepEqual(Object.keys(counts), CATEGORIES);
});

test("only what has a written reason is tolerated", () => {
  assert.ok(toleratedBy("Access to fetch at 'https://krizaka-assets.b-cdn.net/maps/v1/9/1/2.pbf' blocked by CORS"));
  assert.equal(toleratedBy("TypeError: x is not a function"), null);
});

test("the options have defaults, and the subset and views are read", () => {
  const o = parseArgs(["--base", "http://localhost:4600/", "--subset", "12", "--views", "phone"]);
  assert.equal(o.base, "http://localhost:4600");
  assert.equal(o.subset, 12);
  assert.deepEqual(o.views, ["phone"]);
  assert.equal(parseArgs([]).lang, "both");
});

test("--shard i/n: the slices are disjoint, cover every page, and a malformed value is refused", () => {
  const paths = Array.from({ length: 10 }, (_, i) => `/p${i}/`);
  const slices = [1, 2, 3].map((index) => pickShard(paths, { index, count: 3 }));
  assert.deepEqual(slices.flat().sort(), [...paths].sort());
  assert.equal(new Set(slices.flat()).size, paths.length, "no page is crawled twice");
  assert.deepEqual(pickShard(paths, null), paths);
  assert.deepEqual(parseShard("2/3"), { index: 2, count: 3 });
  assert.equal(parseShard(null), null);
  for (const bad of ["0/3", "4/3", "x", "1/", "2"]) assert.throws(() => parseShard(bad), /--shard expects/);
  assert.deepEqual(parseArgs(["--shard", "1/2"]).shard, { index: 1, count: 2 });
});
