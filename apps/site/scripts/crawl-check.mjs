#!/usr/bin/env node
/* The look of ui.krizaka.com, checked in a real browser (Playwright): the top pages at desktop and phone width, dark
   and light. Fails on a page that scrolls sideways, content cut at the viewport's edge, an example wider than its
   frame, an empty canvas, a console error or an uncaught exception. Screenshots go to --out.

   Usage: node scripts/crawl-check.mjs --base https://ui.krizaka.com [--out <dir>] [--playwright <path to playwright>]
   Known and tolerated while it lasts: the CDN's maps/v1 without CORS headers (MapGate shows the photographs). */

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const out = flag("--out", null);
const require = createRequire(import.meta.url);
const { chromium } = require(flag("--playwright", "playwright"));

export const PAGES = ["/", "/components/", "/components/button/", "/components/map/", "/components/vertical-video/", "/components/line-chart/", "/components/profile-card/", "/fr/"];
const VIEWS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
  // The narrowest phone in common use: the bar's tools must still fit (a wider control once cut the menu button).
  { name: "small-phone", width: 360, height: 780 },
];
const TOLERATED = [/krizaka-assets\.b-cdn\.net\/maps\/v1\/.*CORS|Failed to load resource: net::ERR_FAILED/];

if (out) mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const problems = [];
for (const theme of ["dark", "light"]) {
  for (const view of VIEWS) {
    const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: view.width < 500 ? 2 : 1 });
    await context.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && !TOLERATED.some((re) => re.test(m.text())) && errors.push(m.text().slice(0, 200)));
    page.on("pageerror", (e) => errors.push(`exception: ${e.message.slice(0, 200)}`));
    for (const path of PAGES) {
      const where = `${theme} ${view.name} ${path}`;
      const response = await page.goto(base + path, { waitUntil: "networkidle" });
      if (!response || response.status() !== 200) problems.push(`${where}: HTTP ${response?.status()}`);
      for (let y = 0; y < 6000; y += 600) {
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(150);
      }
      await page.waitForTimeout(1200);
      const home = path === "/" || path === "/fr/";
      const found = await page.evaluate((home) => {
        const issues = [];
        const vw = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth > vw + 1) issues.push(`the page scrolls sideways (${document.documentElement.scrollWidth} > ${vw})`);
        const clipped = (el) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const o = getComputedStyle(p).overflowX;
            if (o !== "visible") return true;
          }
          return false;
        };
        for (const el of document.querySelectorAll("main *, header *, footer *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === "hidden") continue;
          if ((r.right > vw + 1 || r.left < -1) && !clipped(el)) {
            issues.push(`cut at the edge: <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 60)}">`);
            if (issues.length > 6) break;
          }
        }
        for (const pre of document.querySelectorAll("main pre")) {
          if (pre.closest(".kz-preview-stage, .kz-land-stage, .kz-catalog-live")) continue;
          if (pre.scrollWidth > pre.clientWidth + 1) issues.push(`a line of code cut at the edge of its block: ${pre.textContent.trim().slice(0, 40)}`);
        }
        // Text hidden under an overlay: a copy button (or any absolutely placed control) over the lines of its code block.
        const blocks = new Set([...document.querySelectorAll("main pre")].filter((pre) => !pre.closest(".kz-preview-stage, .kz-land-stage, .kz-catalog-live")).map((pre) => pre.closest("figure") ?? pre.parentElement));
        for (const block of blocks) {
          const overlays = [...block.querySelectorAll("button, [role=button]")]
            .filter((b) => ["absolute", "fixed", "sticky"].includes(getComputedStyle(b.closest("[class*=absolute]") ?? b).position))
            .map((b) => b.getBoundingClientRect())
            .filter((r) => r.width > 0 && r.height > 0);
          if (!overlays.length) continue;
          const walker = document.createTreeWalker(block.querySelector("pre") ?? block, NodeFilter.SHOW_TEXT);
          let hidden = null;
          for (let node = walker.nextNode(); node && !hidden; node = walker.nextNode()) {
            if (!node.textContent.trim() || node.parentElement?.closest("button")) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const t of range.getClientRects()) {
              if (overlays.some((o) => t.left < o.right - 1 && t.right > o.left + 1 && t.top < o.bottom - 1 && t.bottom > o.top + 1)) {
                hidden = node.textContent.trim().slice(0, 40);
                break;
              }
            }
          }
          if (hidden) issues.push(`text hidden under an overlay in a code block: ${hidden}`);
        }
        for (const stage of document.querySelectorAll(".kz-preview-stage, .kz-land-stage, .kz-catalog-live")) {
          if (getComputedStyle(stage).overflowX === "visible" && stage.scrollWidth > stage.clientWidth + 1) issues.push(`an example wider than its frame (${stage.scrollWidth} > ${stage.clientWidth})`);
        }
        for (const canvas of document.querySelectorAll("canvas")) {
          const r = canvas.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) continue;
          try {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
              let filled = false;
              for (let i = 3; i < data.length; i += 4 * 97) if (data[i] !== 0) { filled = true; break; }
              if (!filled) issues.push("an empty canvas");
            }
          } catch { /* a WebGL canvas: judged by MapGate's photograph instead */ }
        }
        // The home has no sideways scroller at all (code excepted): a strip of cards cut at its edge reads as broken.
        if (home) {
          for (const el of document.querySelectorAll("main *")) {
            const o = getComputedStyle(el).overflowX;
            if ((o === "auto" || o === "scroll") && el.scrollWidth > el.clientWidth + 1 && !el.closest("pre, figure.shiki, [data-rehype-pretty-code-figure], .kz-land-install")) {
              issues.push(`a sideways scroller on the home: <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 60)}">`);
            }
          }
        }
        return [...new Set(issues)];
      }, home);
      for (const issue of found) problems.push(`${where}: ${issue}`);
      for (const error of errors.splice(0)) problems.push(`${where}: console ${error}`);
      if (out) {
        const name = `${out}/${theme}-${view.name}${path.replace(/\//g, "_") || "_"}`;
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${name}.png` });
        // A component page: its examples too.
        const examples = page.locator("#examples");
        if (await examples.count()) {
          await examples.scrollIntoViewIfNeeded();
          await page.waitForTimeout(600);
          await page.screenshot({ path: `${name}examples.png` });
        }
      }
    }
    await context.close();
  }
}
await browser.close();
for (const p of problems) console.log(`✗ ${p}`);
console.log(problems.length ? `crawl: ${problems.length} problem(s) on ${base}` : `crawl: ${PAGES.length} pages × ${VIEWS.length} widths × 2 themes on ${base} — all good`);
process.exit(problems.length ? 1 : 0);
