#!/usr/bin/env node
/* The crawler checked against pages made to be wrong: each category it promises must be found on the bad page, and the
   good page must pass. Needs Playwright's Chromium (CI runs it after the browser is installed).
   Usage: node scripts/docs-crawl.selftest.mjs [--playwright <path>] */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

import { CATEGORIES } from "./docs-crawl.mjs";

const args = process.argv.slice(2);
const playwright = args.includes("--playwright") ? args[args.indexOf("--playwright") + 1] : "playwright";

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8"><title>t</title></head><body>${body}</body></html>`;
const PAGES = {
  "/good/": shell(`<main><h1 id="top">Fine</h1><a href="#top">top</a><a href="/good/">self</a>
    <div class="kz-live-example"><button type="button" id="b">Click</button></div>
    <figure><pre>npm i x</pre><button aria-label="Copy" onclick="navigator.clipboard.writeText('npm i x')">c</button></figure></main>`),
  "/bad/": shell(`<main><h1>Broken</h1><a href="#missing">gone</a><a href="/nope/">dead</a>
    <div class="kz-live-example"></div>
    <div class="kz-play"><div class="kz-play-canvas"><span id="c">x</span></div>
      <div class="kz-play-row"><span class="kz-play-label">variant</span><button role="radio" aria-checked="false">a</button><button role="radio" aria-checked="false">b</button></div>
      <div class="kz-play-code">code</div></div>
    <figure><pre>npm i x</pre><button aria-label="Copy">c</button></figure>
    <div class="kz-live-example"><button type="button" onclick="throw new Error('boom')">Throws</button></div>
    <div style="width:3000px;height:10px"></div></main>
    <script>console.error("a console error on load")</script>`),
};
// A phone's fixed bottom bar (the site's RailNav) over a copy button that is already « visible »: not a broken button.
PAGES["/covered/"] = shell(`<meta name="viewport" content="width=device-width, initial-scale=1"><main><h1>Covered</h1><div style="height:700px"></div>
  <figure><pre>npm i x</pre><button aria-label="Copy" onclick="navigator.clipboard.writeText('npm i x')">c</button></figure>
  <div style="height:1200px"></div></main>
  <nav style="position:fixed;left:0;right:0;bottom:0;height:90px;background:#000;z-index:40"></nav>`);
const sitemap = (base) => `<urlset>${Object.keys(PAGES).map((p) => `<url><loc>${base}${p}</loc></url>`).join("")}</urlset>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/sitemap.xml") return res.writeHead(200, { "content-type": "application/xml" }).end(sitemap(`http://127.0.0.1:${server.address().port}`));
  const page = PAGES[url.pathname];
  return page ? res.writeHead(200, { "content-type": "text/html" }).end(page) : res.writeHead(404).end("not found");
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

// Asynchronous on purpose: this process also serves the pages.
const run = (only, views = "desktop") =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL("./docs-crawl.mjs", import.meta.url)), "--base", base, "--playwright", playwright, "--only", only, "--views", views, "--no-external", "--concurrency", "1"]);
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (status) => resolve({ status, counts: JSON.parse(out.split("\n").find((l) => l.startsWith("{")) ?? "{}"), out }));
  });

try {
  const good = await run("/good/");
  assert.equal(good.status, 0, `the good page must pass:\n${good.out}`);
  // The phone's bottom bar covers this button as it first appears: the crawler brings it to the middle of the screen before it presses.
  const covered = await run("/covered/", "phone");
  assert.equal(covered.status, 0, `a copy button under a fixed bar must still copy (the crawler centres it):\n${covered.out}`);
  const bad = await run("/bad/");
  assert.equal(bad.status, 1);
  const expected = ["console-error", "interaction-error", "empty-example", "knob-noop", "copy-empty", "dead-link", "dead-anchor", "overflow-x"];
  for (const category of expected) assert.ok(bad.counts[category] >= 1, `${category} must be found on the bad page:\n${bad.out}`);
  assert.deepEqual(Object.keys(bad.counts), CATEGORIES);
  console.log(`docs-crawl selftest: ${expected.length} categories found on the bad page, the good page passes`);
} finally {
  server.close();
}
