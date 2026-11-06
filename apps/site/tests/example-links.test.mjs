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
  const dead = [/github\.com\/krizaka\/(krizaka-build|template-next-app|template-tauri-app|krizaka-tauri-kit)\b/, /github\.com\/orgs\/krizaka\/discussions/, /krizaka-java\/discussions/];
  const hits = sources.filter(([, code]) => dead.some((re) => re.test(code))).map(([file]) => file);
  assert.deepEqual(hits, []);
});

test("no example leaves the page: a sample never navigates (the docs would show the site's 404)", () => {
  const leaving = sources.filter(([, code]) => /window\.location\.(assign|replace|href\s*=)|location\.href\s*=/.test(code)).map(([file]) => file);
  assert.deepEqual(leaving, []);
});

// The docs crawler opened a MediaPlayer whose film was `src="/film.mp4"`: ui.krizaka.com serves no such file, so the
// lightbox answered 404 — and the crawl runs only in the merge queue. A sample's media is a real, served address (the
// org's CDN, a data URI) or a file of this site's `public/`; never a root-relative path nothing serves.
test("no example points a media at a root-relative file the docs site does not serve", () => {
  const served = new Set(readdirSync(new URL("../public/", import.meta.url), { recursive: true }).map((f) => `/${String(f).split("\\").join("/")}`));
  const media = /\b(?:src|poster|webm|mp4|workerSrc)\s*[=:]\s*\{?\s*["'`](\/(?!\/)[^"'`?#]*)/g;
  const missing = sources.flatMap(([file, code]) => [...code.matchAll(media)].map((m) => m[1]).filter((path) => !served.has(path)).map((path) => `${file} → ${path}`));
  assert.deepEqual(missing, []);
});
