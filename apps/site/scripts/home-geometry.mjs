#!/usr/bin/env node
/* The home, measured in a real browser (Playwright) at 1550 and 1366 (desktop) and 390 (phone), dark and light:
   - the scene is two real screens: in the window an AppShell with three figures, a chart and a table; on the phone the
     product's own screen (a chat, a vertical video filling the screen ± 1 px, or a document);
   - the identity dock floats at the bottom of the screen while the studio is in view, and each identity re-skins the
     scene (the accent changes, the window's title names the product);
   - the playground (the component-page stage) and the families follow, under the same identity;
   - nothing scrolls sideways, the window never runs out of the scene.

   Usage: node scripts/home-geometry.mjs --base http://localhost:4600 [--playwright <path>] [--out <dir>] */

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const out = flag("--out", null);
const require = createRequire(import.meta.url);
const { chromium } = require(flag("--playwright", "playwright"));

const WIDTHS = [1550, 1366, 390];
const IDS = ["orazaka", "orochia", "yomizaka", "krizaka"];
const NAMES = { orazaka: "Orazaka", orochia: "Orochia", yomizaka: "Yomizaka", krizaka: "Krizaka" };
if (out) mkdirSync(out, { recursive: true });

/** Runs in the page: the scene as it stands, as a list of problems. */
function measure(id) {
  const issues = [];
  const box = (el) => el.getBoundingClientRect();
  const scene = document.querySelector(".kz-scene");
  const win = scene?.querySelector(".kz-scene-window");
  const screen = scene?.querySelector(".kz-scene-screen");
  if (!scene || !win || !screen) return ["the scene, its window or its phone is missing"];
  const s = box(scene.parentElement), w = box(win);
  if (w.left < s.left - 1 || w.right > s.right + 1) issues.push(`the window runs out of the scene (${Math.round(w.left)}–${Math.round(w.right)} in ${Math.round(s.left)}–${Math.round(s.right)})`);
  if (win.querySelectorAll("[role=group] > div, dl > div, .grid > div").length === 0) issues.push("no figures in the window");
  const stats = [...win.querySelectorAll("p")].filter((p) => /font-display/.test(p.className));
  if (stats.length < 3) issues.push(`the window shows ${stats.length} figures, not 3`);
  if (!win.querySelector("svg")) issues.push("no chart in the window");
  if (!win.querySelector("table, [role=table], [role=grid], ul")) issues.push("no table in the window");
  const title = win.textContent ?? "";
  if (!title.includes(id === "krizaka" ? "Krizaka" : { orazaka: "Orazaka", orochia: "Orochia", yomizaka: "Yomizaka" }[id])) issues.push(`the window does not name ${id}`);
  const phone = { orazaka: "chat", orochia: "video", yomizaka: "document", krizaka: "chat" }[id];
  if (phone === "chat" && screen.querySelectorAll("[class*=rounded]").length < 4) issues.push("the phone shows no conversation");
  if (phone === "document" && !screen.querySelector(".kz-scene-doc")) issues.push("the phone shows no document");
  if (phone === "video") {
    const article = screen.querySelector("article");
    const video = article?.querySelector("video");
    if (!article || !video) issues.push("the phone shows no vertical video");
    else {
      const a = box(screen), v = box(video);
      if (Math.abs(a.width - v.width) > 1 || Math.abs(a.height - v.height) > 1) issues.push(`the video (${Math.round(v.width)}×${Math.round(v.height)}) does not fill the phone (${Math.round(a.width)}×${Math.round(a.height)})`);
    }
  }
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) issues.push(`the page scrolls sideways (${document.documentElement.scrollWidth})`);
  return issues;
}

const browser = await chromium.launch();
const problems = [];
for (const theme of ["dark", "light"]) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 960 }, deviceScaleFactor: width < 600 ? 2 : 1 });
    await context.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
    const page = await context.newPage();
    const where = `${theme} ${width}`;
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => { const s = document.querySelector("#scene"); if (s) scrollTo(0, s.getBoundingClientRect().top + scrollY - 80); });
    await page.waitForTimeout(600);

    // The dock floats at the bottom of the screen while the scene is in view.
    const dock = await page.evaluate(() => { const d = document.querySelector(".kz-dock"); if (!d) return null; const r = d.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: innerHeight }; });
    if (!dock) {
      problems.push(`${where}: no identity dock`);
      await context.close();
      continue;
    }
    if (dock.bottom > dock.h + 1 || dock.top < dock.h - 200) problems.push(`${where}: the dock is not at the bottom of the screen (${Math.round(dock.top)}–${Math.round(dock.bottom)} of ${dock.h})`);

    const accent = () => page.evaluate(() => getComputedStyle(document.querySelector(".kz-scene")).getPropertyValue("--kz-accent").trim());
    const seen = new Set();
    for (const id of IDS) {
      if (id !== "orazaka") await page.locator(`.kz-dock [data-id="${id}"]`).click({ force: true });
      await page.waitForTimeout(id === "yomizaka" ? 2500 : 1300);
      seen.add(await accent());
      for (const issue of await page.evaluate(measure, id)) problems.push(`${where} ${id}: ${issue}`);
      const checked = await page.locator(`.kz-dock [data-id="${id}"]`).getAttribute("aria-checked");
      if (checked !== "true") problems.push(`${where} ${id}: the dock does not say ${NAMES[id]} is worn`);
      if (out) await page.screenshot({ path: `${out}/${width}-${theme}-${id}.png` });
    }
    if (seen.size < IDS.length) problems.push(`${where}: ${IDS.length} identities gave ${seen.size} accents`);

    // The playground and the families follow, under the identity.
    const rest = await page.evaluate(() => ({
      stage: !!document.querySelector(".kz-home-play .kz-stage"),
      code: !!document.querySelector(".kz-home-play .kz-play-code, .kz-home-play pre"),
      families: document.querySelectorAll(".kz-families-grid .kz-family").length,
      inStudio: !!document.querySelector(".kz-home-studio .kz-home-play"),
    }));
    if (!rest.stage || !rest.code) problems.push(`${where}: the playground has no stage or no code`);
    if (!rest.inStudio) problems.push(`${where}: the playground is outside the identity`);
    if (rest.families < 10) problems.push(`${where}: ${rest.families} family cards`);
    await context.close();
  }
}
await browser.close();
for (const p of [...new Set(problems)]) console.log(`✗ ${p}`);
console.log(problems.length ? `home geometry: ${problems.length} problem(s) on ${base}` : `home geometry: ${WIDTHS.length} widths × 2 themes × ${IDS.length} identities on ${base} — all good`);
process.exit(problems.length ? 1 : 0);
