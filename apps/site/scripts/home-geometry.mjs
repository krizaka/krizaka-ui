#!/usr/bin/env node
/* The home, measured in a real browser (Playwright) at 1440, 1366 and 768 (desktop, tablet) and 390 (phone), dark and
   light, EN and FR — the calmest page of the family (Cahier, krizaka-ui#434):
   - the first screen holds what it is (the title), the install line, the three ways in (components, foundations,
     templates) and the search — on a desktop all four, on a phone at least the title, the install line and the first way
     in — and nothing else: no figure, no live kit, no scene, no dock;
   - the search opens the site's search dialog;
   - nothing scrolls sideways.

   Usage: node scripts/home-geometry.mjs --base http://localhost:4600 [--playwright <path>] [--out <dir>] */

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const out = flag("--out", null);
const require = createRequire(import.meta.url);
const { chromium } = require(flag("--playwright", "playwright"));

const WIDTHS = [1440, 1366, 768, 390];
const PATHS = ["/", "/fr"];
if (out) mkdirSync(out, { recursive: true });

/** Runs in the page: what the first screen holds. */
function firstScreen() {
  const seen = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight)) return false;
    // Painted, not waiting for a reveal: the first screen is never revealed (LCP).
    for (let n = el; n; n = n.parentElement) if (Number(getComputedStyle(n).opacity) < 0.99) return false;
    return true;
  };
  const ways = [...document.querySelectorAll(".kz-home-ways a")];
  return {
    title: seen(document.querySelector(".kz-home-hero h1")),
    install: seen(document.querySelector(".kz-home-install")),
    ways: ways.map((a) => new URL(a.href).pathname.replace(/^\/fr/, "").replace(/\/$/, "") || "/"),
    waysSeen: ways.filter(seen).length,
    search: seen(document.querySelector(".kz-home-search")),
    extra: ["[data-figure]", ".kz-count", ".kz-kit", ".kz-scene", ".kz-dock", "[role=tablist]"].filter((s) => [...document.querySelectorAll(s)].some(seen)),
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
}

const browser = await chromium.launch();
const problems = [];
for (const path of PATHS) {
  for (const theme of ["dark", "light"]) {
    for (const width of WIDTHS) {
      const phone = width < 600;
      const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: phone ? 2 : 1 });
      await context.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
      const page = await context.newPage();
      const where = `${path} ${theme} ${width}`;
      await page.goto(`${base}${path}`, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const f = await page.evaluate(firstScreen);
      if (!f.title) problems.push(`${where}: the title is not on the first screen`);
      if (!f.install) problems.push(`${where}: the install line is not on the first screen`);
      if (f.ways.join() !== "/components,/foundations,/templates") problems.push(`${where}: the ways in are ${f.ways.join(", ") || "missing"}`);
      if (!phone && (f.waysSeen < 3 || !f.search)) problems.push(`${where}: the three ways in and the search are not all on the first screen (${f.waysSeen} ways, search ${f.search})`);
      if (phone && f.waysSeen < 1) problems.push(`${where}: no way in on the first screen`);
      if (f.extra.length) problems.push(`${where}: the first screen also shows ${f.extra.join(", ")}`);
      if (f.sideways) problems.push(`${where}: the page scrolls sideways`);
      if (out) await page.screenshot({ path: `${out}/home${path === "/" ? "-en" : "-fr"}-${width}-${theme}.png` });
      if (width === 1440 && (await page.locator(".kz-home-search").count())) {
        await page.locator(".kz-home-search").click();
        const dialog = await page.locator("[role=dialog]").first().isVisible().catch(() => false);
        if (!dialog) problems.push(`${where}: the search does not open the search dialog`);
      }
      await context.close();
    }
  }
}
await browser.close();
for (const p of [...new Set(problems)]) console.log(`✗ ${p}`);
console.log(problems.length ? `home geometry: ${problems.length} problem(s) on ${base}` : `home geometry: ${PATHS.length} languages × ${WIDTHS.length} widths × 2 themes on ${base} — calm, all good`);
process.exit(problems.length ? 1 : 0);
