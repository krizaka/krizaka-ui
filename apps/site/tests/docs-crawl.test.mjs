// The documentation crawler's pure parts (scripts/docs-crawl.mjs): the sitemap, the fast subset, the tolerated list and
// the counts per category. The browser part runs in CI against the exported site.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CATEGORIES,
  componentOfPath,
  componentPageName,
  htmlDeclaresAnchor,
  isDeadLink,
  isHarmlessClickError,
  isReactError,
  isUnreachableHost,
  locsOfSitemap,
  parseArgs,
  parseShard,
  pathsOfSitemap,
  pickShard,
  pickSubset,
  summarize,
  toleratedBy,
} from "../scripts/docs-crawl.mjs";
import { failuresByComponent } from "../scripts/docs-crawl-report.mjs";

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

// ADR-026 phase D: the long regexes became lists and small functions. The expectations below were recorded from the regex
// version (and a 20,000-case comparison of old and new gave no difference).

test("React errors: a phrase of the list, an error code, or a hydration word", () => {
  for (const text of [
    "Minified React error #418",
    "React error #31",
    "Hydration failed because the initial UI",
    "hydration  mismatch is not it, but hydrating error is",
    "Warning: Text content did not match",
    "Text content does not match server-rendered HTML",
    "Maximum update depth exceeded",
    "Cannot update a component while rendering",
    'Each child in a list should have a unique "key" prop',
  ])
    assert.equal(isReactError(text), true, text);
  for (const text of ["TypeError: x is not a function", "React error #", "hydration-error", "each child in a list should have a unique 'key'"])
    assert.equal(isReactError(text), false, text);
});

test("tolerated: a text that contains a listed part, with its reason", () => {
  assert.match(toleratedBy("blocked: https://www.tiktokcdn-us.com/x"), /TikTok/);
  assert.match(toleratedBy("https://www.tiktok.com/embed"), /TikTok/);
  assert.match(toleratedBy("GET /x — net::ERR_ABORTED"), /cancelled/);
  for (const text of ["tiktokcdn.com", "tiktok com", "krizaka-assets.b-cdn.net/maps/v2/", "net::ERR_FAILED"]) assert.equal(toleratedBy(text), null, text);
});

test("the sitemap: each <loc> is trimmed, one word, no markup inside", () => {
  assert.deepEqual(locsOfSitemap("<loc> https://a.b/c </loc><loc>x y</loc><loc><loc>z</loc><loc>a<b</loc><loc></loc><loc>open"), ["https://a.b/c", "z"]);
  assert.deepEqual(locsOfSitemap("<LOC>https://a.b/</LOC>"), []);
});

test("component pages: /components/<name> and its French twin, not deeper, not elsewhere", () => {
  for (const [path, name] of [["/components/button/", "button"], ["/components/button", "button"], ["/fr/components/map/", "map"]]) assert.equal(componentPageName(path), name, path);
  for (const path of ["/", "/fr", "/components", "/components/", "/components//", "/components/x/code", "/fr/fr/components/x", "components/x/"])
    assert.equal(componentPageName(path), null, path);
});

test("the component of a docs path, for the report", () => {
  assert.equal(componentOfPath("/components/x/y"), "x");
  assert.equal(componentOfPath("/fr/components/x/"), "x");
  for (const path of ["/", "/fr/", "/templates/x", "components/x", "/frx/components/x", "/components//x"]) assert.equal(componentOfPath(path), null, path);
  const failures = [
    { page: "/components/x/", category: "dead-link" },
    { page: "/fr/components/x/", category: "dead-link" },
    { page: "/templates/", category: "overflow-x" },
  ];
  assert.deepEqual(failuresByComponent(failures), { x: { "dead-link": 2 }, "/templates/": { "overflow-x": 1 } });
});

test("an anchor is declared by id= or name=, in either quote, with the quotes allowed to differ", () => {
  assert.equal(htmlDeclaresAnchor(`<h2 id="a.b">`, "a.b"), true);
  assert.equal(htmlDeclaresAnchor(`<a name='x(y)'>`, "x(y)"), true);
  assert.equal(htmlDeclaresAnchor(`<a id="x'>`, "x"), true);
  assert.equal(htmlDeclaresAnchor(`<h2 id="ab">`, "a.b"), false);
  assert.equal(htmlDeclaresAnchor(`<h2 ID="a">`, "a"), false);
});

test("click errors that only say the example moved are harmless; an unreachable host is dead", () => {
  for (const m of ["element intercepts pointer events", "Timeout 3000ms exceeded", "not stable", "detached", "outside of the viewport", "not visible"]) assert.equal(isHarmlessClickError(m), true, m);
  assert.equal(isHarmlessClickError("boom"), false);
  assert.equal(isUnreachableHost("error: getaddrinfo ENOTFOUND x"), true);
  assert.equal(isUnreachableHost("error: certificate has expired"), true);
  assert.equal(isUnreachableHost("error: ECONNRESET"), false);
});

test("a link is dead when its host is unreachable, on our site at any 4xx/5xx, elsewhere only at 404 or 410", () => {
  assert.equal(isDeadLink("getaddrinfo ENOTFOUND dev.example.com", false), true);
  assert.equal(isDeadLink("socket hang up", true), false);
  assert.equal(isDeadLink(403, true), true);
  assert.equal(isDeadLink(500, true), true);
  assert.equal(isDeadLink(200, true), false);
  assert.equal(isDeadLink(403, false), false);
  assert.equal(isDeadLink(429, false), false);
  assert.equal(isDeadLink(404, false), true);
  assert.equal(isDeadLink(410, false), true);
});
