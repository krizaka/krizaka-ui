#!/usr/bin/env node
/* The geometry of the home's showcase, measured in a real browser (Playwright) at the widths people read it at
   (1550 and 1366 desktop, 390 phone), dark and light, and after an identity switch. Each rule is a defect seen on the
   live page once — it must never come back:
   - the vertical clip fills its tile: the video's box is the tile stage's box (± 1 px), never a small 9:16 floating in
     a frame; the caption and the disclosure stay clear of the action rail;
   - the plans: every button holds its label, sits inside its card, and the buttons of a row stand on one line; a price
     ("Custom") fits its card;
   - the conversation fills its tile down to the composer (no empty area under it);
   - a progress label is never cut ("Tra…") to make room for its figure;
   - no tile cuts its content (no fixed height, no fade-out mask) and the floor has no outer frame;
   - the identity switch re-skins the floor (the accent changes) and says which identity is worn.

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
if (out) mkdirSync(out, { recursive: true });

/** Runs in the page: every rule above, as a list of problems. */
function measure() {
  const issues = [];
  const box = (el) => el.getBoundingClientRect();
  const near = (a, b, tolerance = 1) => Math.abs(a - b) <= tolerance;
  const tile = (area) => document.querySelector(`.kz-land-tile[data-area="${area}"]`);

  // The clip fills its tile.
  const video = tile("video");
  const stage = video?.querySelector(".kz-land-stage");
  const article = stage?.querySelector("article");
  const clip = article?.querySelector("video");
  if (!stage || !article || !clip) issues.push("video: the tile, its article or its <video> is missing");
  else {
    const s = box(stage), a = box(article), v = box(clip);
    for (const [name, r] of [["article", a], ["video", v]]) {
      if (!(near(r.left, s.left) && near(r.top, s.top) && near(r.width, s.width) && near(r.height, s.height)))
        issues.push(`video: the ${name}'s box (${Math.round(r.width)}×${Math.round(r.height)} at ${Math.round(r.left - s.left)},${Math.round(r.top - s.top)}) is not the tile's (${Math.round(s.width)}×${Math.round(s.height)})`);
    }
    if (getComputedStyle(clip).objectFit !== "cover") issues.push("video: the clip does not cover its box");
    if (s.height < 300) issues.push(`video: the tile is too short to read (${Math.round(s.height)} px)`);
    const rail = article.querySelector('[role="group"]');
    const caption = [...article.querySelectorAll("p")].find((p) => p.closest('[role="group"]') === null);
    const block = caption?.parentElement;
    if (rail && block) {
      const r = box(rail);
      for (const el of block.querySelectorAll("*")) {
        const e = box(el);
        if (e.width && e.height && e.right > r.left + 1 && e.left < r.right - 1 && e.bottom > r.top + 1 && e.top < r.bottom - 1) {
          issues.push(`video: "${el.textContent.trim().slice(0, 24)}" runs under the action rail`);
          break;
        }
      }
    }
  }

  // The plans.
  const plans = tile("plans");
  const cards = plans ? [...plans.querySelectorAll("h3")].map((h) => h.parentElement) : [];
  if (cards.length !== 3) issues.push(`plans: ${cards.length} cards instead of 3`);
  const buttons = [];
  for (const card of cards) {
    const c = box(card);
    for (const el of card.querySelectorAll("p, h3")) {
      if (el.scrollWidth > el.clientWidth + 1 || box(el).right > c.right + 1) issues.push(`plans: "${el.textContent.trim().slice(0, 20)}" overflows its card`);
    }
    const button = card.querySelector("button");
    if (!button) continue;
    const b = box(button);
    buttons.push({ b, row: Math.round(c.top) });
    if (button.scrollWidth > button.clientWidth + 1) issues.push(`plans: the label "${button.textContent.trim()}" overflows its button`);
    if (b.left < c.left - 1 || b.right > c.right + 1) issues.push(`plans: the button "${button.textContent.trim()}" sticks out of its card`);
  }
  const rows = Map.groupBy ? Map.groupBy(buttons, (x) => x.row) : new Map();
  for (const row of rows.values()) {
    if (row.length > 1 && !row.every((x) => near(x.b.bottom, row[0].b.bottom))) issues.push("plans: the buttons of a row do not stand on one line");
  }

  // The conversation fills its tile.
  const chat = tile("chat");
  const composer = chat?.querySelector("textarea, input");
  const chatStage = chat?.querySelector(".kz-land-stage");
  if (composer && chatStage) {
    const panel = chatStage.firstElementChild;
    const gap = box(chatStage).bottom - parseFloat(getComputedStyle(chatStage).paddingBottom) - box(panel).bottom;
    if (gap > 2) issues.push(`chat: ${Math.round(gap)} px of empty tile under the conversation`);
  }

  // Progress labels are never cut.
  for (const bar of document.querySelectorAll('.kz-land-bento [role="progressbar"]')) {
    const label = bar.parentElement?.querySelector("[aria-hidden] > span:first-child");
    if (label && label.scrollWidth > label.clientWidth + 1) issues.push(`progress: the label "${label.textContent}" is cut`);
  }

  // Nothing cut, no outer frame.
  const bento = document.querySelector(".kz-land-bento");
  if (bento && parseFloat(getComputedStyle(bento).borderTopWidth) > 0) issues.push("bento: an outer frame around the tiles");
  for (const t of document.querySelectorAll(".kz-land-tile")) {
    const s = t.querySelector(".kz-land-stage");
    const area = t.dataset.area;
    const style = getComputedStyle(s);
    if ((style.maskImage && style.maskImage !== "none") || (style.webkitMaskImage && style.webkitMaskImage !== "none")) issues.push(`${area}: its stage fades its content out`);
    if (s.scrollHeight > s.clientHeight + 1) issues.push(`${area}: its content is cut at the bottom (${s.scrollHeight} > ${s.clientHeight})`);
    if (s.scrollWidth > s.clientWidth + 1) issues.push(`${area}: its content is cut at the side (${s.scrollWidth} > ${s.clientWidth})`);
    if (t.scrollHeight > t.clientHeight + 1) issues.push(`${area}: the tile cuts its stage`);
  }
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) issues.push("the page scrolls sideways");
  return issues;
}

const browser = await chromium.launch();
const problems = [];
for (const theme of ["dark", "light"]) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 960 }, deviceScaleFactor: width < 600 ? 2 : 1 });
    await context.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
    const page = await context.newPage();
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    const where = `${theme} ${width}`;
    await page.locator(".kz-land-bento").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    for (const issue of await page.evaluate(measure)) problems.push(`${where}: ${issue}`);

    // The switch re-skins the floor and says so.
    const accent = () => page.evaluate(() => getComputedStyle(document.querySelector(".kz-land-bento")).getPropertyValue("--kz-accent").trim());
    const before = await accent();
    await page.getByRole("radio", { name: /Orazaka/ }).click();
    await page.waitForTimeout(1300);
    const after = await accent();
    if (!after || after === before) problems.push(`${where}: the identity switch does not change the accent (${before} → ${after})`);
    const worn = await page.evaluate(() => document.querySelector(".kz-land-now strong")?.textContent ?? null);
    if (worn?.trim() !== "Orazaka") problems.push(`${where}: the toolbar says "${worn}" after choosing Orazaka`);
    for (const issue of await page.evaluate(measure)) problems.push(`${where} orazaka: ${issue}`);
    if (out && (await page.locator(".kz-land-studio").count())) await page.locator(".kz-land-studio").screenshot({ path: `${out}/${width}-${theme}-orazaka.png` });
    await context.close();
  }
}
await browser.close();
for (const p of [...new Set(problems)]) console.log(`✗ ${p}`);
console.log(problems.length ? `home geometry: ${problems.length} problem(s) on ${base}` : `home geometry: ${WIDTHS.length} widths × 2 themes × 2 identities on ${base} — all good`);
process.exit(problems.length ? 1 : 0);
