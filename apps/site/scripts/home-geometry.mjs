#!/usr/bin/env node
/* The home, measured in a real browser (Playwright) at 1440, 1366 and 768 (desktop, tablet) and 390 and 360 (phone), dark and
   light, EN and FR — the calmest page of the family (Cahier, krizaka-ui#434):
   - the first screen holds what it is (the title), exactly ONE filled button (Get started, to the install guide), the
     install line and the search, the Builder as a text line — no entry cards; at 1440 the content's right edge matches
     the bar's (± 16 px) (krizaka-ui#3598); nothing else: no live kit, no scene, no dock;
   - ONE figure — the specimen sheet (Plate I: four real pieces of the kit, numbered) — fills the right half from 1024 px
     up, beside the title and above the ways in, and sits under the text below it, whole, never cut off, no layout shift;
   - the bar's brand link shows no outline after a mouse load or a mouse click (`:focus` is not `:focus-visible`) and a
     clear one after Tab (krizaka-ui#417: « a heavy dark outline on load, as if focused »);
   - the UI Builder button (krizaka-ui#3598: a quiet text line under the search; the one primary action is Get started) is on the first screen, leads to the demo in the page's
     language, is reached by Tab with a visible ring, and axe finds no serious or critical issue (with --axe);
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
const axePath = flag("--axe", null);

const WIDTHS = [1440, 1366, 768, 390, 360];
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
  const bar = document.querySelector(".kz-site-bar")?.getBoundingClientRect();
  const frame = document.querySelector(".kz-home-hero > .kz-frame");
  const fr = frame?.getBoundingClientRect();
  const cs = frame && getComputedStyle(frame);
  // Filled = a painted background on an action the reader can use (Plate I's inert specimens are drawings, not actions).
  const filled = [...document.querySelectorAll(".kz-home-hero a, .kz-home-hero button")].filter((el) => {
    const bg = getComputedStyle(el).backgroundColor;
    return !el.closest("[inert]") && !el.closest(".kz-home-search, .kz-home-install") && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
  }).length;
  return {
    filled,
    // The content's right edge (the frame less its padding) against the bar's.
    edge: fr && bar ? { bar: Math.round(bar.right), content: Math.round(fr.right - Number.parseFloat(cs.paddingRight)) } : null,
    title: seen(document.querySelector(".kz-home-hero h1")),
    install: seen(document.querySelector(".kz-home-install")),
    ways: document.querySelectorAll(".kz-home-ways").length,
    search: seen(document.querySelector(".kz-home-search")),
    builder: seen(document.querySelector(".kz-home-builder a")),
    builderHref: document.querySelector(".kz-home-builder a")?.getAttribute("href") ?? null,
    primary: seen(document.querySelector(".kz-home-try a")),
    primaryHref: document.querySelector(".kz-home-try a")?.getAttribute("href") ?? null,
    figures: document.querySelectorAll(".kz-sheet").length,
    sheet: (() => {
      const sheet = document.querySelector(".kz-sheet");
      if (!sheet) return null;
      const r = sheet.getBoundingClientRect();
      const text = document.querySelector(".kz-home-hero h1").getBoundingClientRect();
      const ways = document.querySelector(".kz-home-install").getBoundingClientRect();
      const specimens = [...sheet.querySelectorAll(".kz-sheet-specimen")];
      return {
        beside: r.left >= text.right - 1 && r.top < ways.top,
        under: r.top >= ways.bottom - 1,
        inside: r.right <= innerWidth + 0.5 && r.left >= -0.5,
        captions: sheet.querySelectorAll(".kz-sheet-caption").length,
        specimens: specimens.length,
        specimensInside: specimens.every((s) => [...s.children].every((c) => { const b = c.getBoundingClientRect(); const o = s.getBoundingClientRect(); return b.left >= o.left - 0.5 && b.right <= o.right + 0.5; })),
        firstScreen: seen(sheet),
        inert: specimens.every((s) => s.inert && s.getAttribute("aria-hidden") === "true"),
        height: Math.round(r.height),
      };
    })(),
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
      if (!f.builder) problems.push(`${where}: the UI Builder line is not on the first screen`);
      if (f.builderHref?.replace(/\/$/, "") !== (path === "/" ? "/builder" : "/fr/builder")) problems.push(`${where}: the UI Builder line leads to ${f.builderHref}`);
      if (!f.install) problems.push(`${where}: the install line is not on the first screen`);
      if (f.ways) problems.push(`${where}: the entry cards are back in the hero`);
      if (f.filled !== 1) problems.push(`${where}: the hero has ${f.filled} filled buttons, it should have exactly one`);
      if (f.primaryHref?.replace(/\/$/, "") !== (path === "/" ? "/installation" : "/fr/installation")) problems.push(`${where}: Get started leads to ${f.primaryHref}`);
      if (!f.primary) problems.push(`${where}: Get started is not on the first screen`);
      if (width >= 1440 && f.edge && Math.abs(f.edge.bar - f.edge.content) > 16) problems.push(`${where}: the content's right edge is ${f.edge.content}px, the bar's ${f.edge.bar}px`);
      if (!phone && !f.search) problems.push(`${where}: the search is not on the first screen`);
      if (f.figures !== 1 || !f.sheet) problems.push(`${where}: the first screen has ${f.figures} figures, it should have one`);
      else {
        const s = f.sheet;
        if (s.captions !== 4 || s.specimens !== 4) problems.push(`${where}: the plate has ${s.specimens} specimens and ${s.captions} captions, it should have 4 and 4`);
        if (!s.inert) problems.push(`${where}: the specimens are not inert and hidden from assistive technology`);
        if (!s.inside || !s.specimensInside) problems.push(`${where}: the plate or a specimen is cut off or overflows`);
        if (width >= 1024 && !s.beside) problems.push(`${where}: the figure is not beside the text on the right`);
        if (width >= 1024 && !s.firstScreen) problems.push(`${where}: the figure is not whole on the first screen`);
        if (width < 1024 && !s.under) problems.push(`${where}: the figure is not stacked under the text`);
      }
      if (f.extra.length) problems.push(`${where}: the first screen also shows ${f.extra.join(", ")}`);
      if (f.sideways) problems.push(`${where}: the page scrolls sideways`);
      if (out) await page.screenshot({ path: `${out}/home${path === "/" ? "-en" : "-fr"}-${width}-${theme}.png` });
      // The brand link of the bar. A mouse load and a mouse click leave it without an outline; Tab gives it a clear one.
      const brand = () => page.evaluate(() => {
        const a = document.querySelector(".kz-site-bar a");
        const cs = getComputedStyle(a);
        return { focused: document.activeElement === a, visible: a.matches(":focus-visible"), outline: cs.outlineStyle !== "none" && Number.parseFloat(cs.outlineWidth) > 0 };
      });
      const onLoad = await brand();
      if (onLoad.focused || onLoad.outline) problems.push(`${where}: the brand link shows a focus outline on load`);
      if (width >= 768) {
        await page.locator(".kz-site-bar a").first().click();
        await page.waitForLoadState("load");
        const clicked = await brand();
        if (clicked.visible || clicked.outline) problems.push(`${where}: the brand link shows a focus outline after a mouse click`);
        await page.goto(`${base}${path}`, { waitUntil: "load" });
        await page.keyboard.press("Tab");
        const tabbed = await brand();
        if (!tabbed.focused) problems.push(`${where}: the first Tab does not reach the brand link`);
        else if (!tabbed.visible || !tabbed.outline) problems.push(`${where}: the brand link has no visible focus ring after Tab`);
      }
      if (width === 1440 && (await page.locator(".kz-home-search").count())) {
        // The search opens once the page has hydrated: a click before that does nothing, so try a few times.
        let dialog = false;
        for (let i = 0; i < 4 && !dialog; i++) {
          await page.locator(".kz-home-search").click();
          dialog = await page.locator("[role=dialog]").first().waitFor({ state: "visible", timeout: 1500 }).then(() => true, () => false);
        }
        if (!dialog) problems.push(`${where}: the search does not open the search dialog`);
      }
      // The UI Builder button: reachable by Tab with a visible focus ring, clean for axe, and it opens the demo in the same locale.
      {
        await page.goto(`${base}${path}`, { waitUntil: "load" });
        const focusBuilder = async () => {
          for (let i = 0; i < 30; i++) {
            await page.keyboard.press("Tab");
            if (await page.evaluate(() => document.activeElement === document.querySelector(".kz-home-builder a"))) return true;
          }
          return false;
        };
        if (!(await focusBuilder())) problems.push(`${where}: Tab does not reach the UI Builder button`);
        else {
          const ring = await page.evaluate(() => {
            const cs = getComputedStyle(document.activeElement);
            return document.activeElement.matches(":focus-visible") && cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
          });
          if (!ring) problems.push(`${where}: the UI Builder button has no visible focus ring after Tab`);
        }
        if (axePath) {
          await page.addScriptTag({ path: axePath });
          const serious = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })).violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id} on ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`));
          if (serious.length) problems.push(`${where}: axe serious/critical: ${serious.join(", ")}`);
        }
        await page.locator(".kz-home-builder a").click();
        await page.waitForURL(`**${path === "/" ? "" : "/fr"}/builder{,/}`, { timeout: 10000 }).catch(() => {});
        const landed = new URL(page.url()).pathname.replace(/\/$/, "");
        if (landed !== (path === "/" ? "/builder" : "/fr/builder")) problems.push(`${where}: the click lands on ${landed}`);
      }
      await context.close();
    }
  }
}
await browser.close();
for (const p of [...new Set(problems)]) console.log(`✗ ${p}`);
console.log(problems.length ? `home geometry: ${problems.length} problem(s) on ${base}` : `home geometry: ${PATHS.length} languages × ${WIDTHS.length} widths × 2 themes on ${base} — calm, all good`);
process.exit(problems.length ? 1 : 0);
