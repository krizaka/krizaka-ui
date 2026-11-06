// WHY  Which pages the documentation crawl visits (the sitemap, a fast subset, one slice of a CI shard) and with which options
//      is pure logic, separate from the browser that visits them.
// WHAT The options of the command line, the shard i/n, the paths of a sitemap and the subset of component pages.
// HOW  Imported by scripts/docs-crawl.mjs (which re-exports it); nothing to run. Tests: tests/docs-crawl.test.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { componentPageName } from "./docs-crawl-verdicts.mjs";

/** `2/3` -> { index: 2, count: 3 }; null when absent. A malformed value is a mistake, not a silent full crawl. */
export function parseShard(value) {
  if (value == null) return null;
  const m = /^(\d+)\/(\d+)$/.exec(value);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > Number(m[2])) throw new Error(`--shard expects i/n with 1 <= i <= n, got '${value}'`);
  return { index: Number(m[1]), count: Number(m[2]) };
}

/** Slice `index` (1-based) of `count`: every count-th page, so the slices are disjoint and together cover every page. */
export function pickShard(paths, shard) {
  return shard ? paths.filter((_, k) => k % shard.count === shard.index - 1) : paths;
}

export function parseArgs(argv) {
  const get = (name, fallback) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : fallback);
  return {
    base: get("--base", "http://localhost:4600").replace(/\/$/, ""),
    sitemap: get("--sitemap", null),
    lang: get("--lang", "both"),
    views: get("--views", "desktop,phone").split(","),
    subset: get("--subset", null) ? Number(get("--subset")) : null,
    only: get("--only", null),
    shard: parseShard(get("--shard", null)),
    external: !argv.includes("--no-external"),
    concurrency: Number(get("--concurrency", "4")),
    out: get("--out", null),
    playwright: get("--playwright", "playwright"),
  };
}


const LOC_OPEN = "<loc>";
const LOC_CLOSE = "</loc>";
const BLANK = /\s/;

/** The text of each `<loc>…</loc>` of a sitemap: trimmed, one word, no markup inside (anything else is not a URL). */
export function locsOfSitemap(xml) {
  const locs = [];
  for (let from = xml.indexOf(LOC_OPEN); from !== -1; from = xml.indexOf(LOC_OPEN, from + LOC_OPEN.length)) {
    const start = from + LOC_OPEN.length;
    const end = xml.indexOf(LOC_CLOSE, start);
    if (end === -1) break;
    const text = xml.slice(start, end).trim();
    if (text && !text.includes("<") && !BLANK.test(text)) locs.push(text);
  }
  return locs;
}

/** The paths of a sitemap's <loc> entries, made relative (the host of the file is the production one). */
export function pathsOfSitemap(xml) {
  return locsOfSitemap(xml)
    .map((loc) => new URL(loc).pathname)
    .filter((p, i, all) => all.indexOf(p) === i);
}

/** The component pages that are always kept in a subset: the ones that exercise the most. */
export const KEY_COMPONENTS = ["button", "dialog", "map", "line-chart", "vertical-video"];

/** The pages of a fast subset: every page that is not a component page, and `sample` component pages (stable). */
export function pickSubset(paths, sample) {
  const isComponent = (p) => componentPageName(p) !== null;
  const components = paths.filter(isComponent);
  const step = Math.max(1, Math.floor(components.length / Math.max(1, sample)));
  const picked = new Set(components.filter((_, i) => i % step === 0).slice(0, sample));
  for (const key of KEY_COMPONENTS) for (const p of components) if (componentPageName(p) === key) picked.add(p);
  return paths.filter((p) => !isComponent(p) || picked.has(p));
}
