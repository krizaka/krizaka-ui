#!/usr/bin/env node
/* The flock's motion, checked in a real browser: with motion allowed its birds are really animating and two of them glance
   at each other; with `prefers-reduced-motion: reduce` nothing moves at all — no running animation, no glance, no flight.
   Usage: node scripts/motion-check.mjs --base http://localhost:4600 [--playwright <path>] [--page /components/flock/] */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const flag = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const path = flag("--page", "/components/flock/");
const { chromium } = createRequire(import.meta.url)(flag("--playwright", "playwright"));

const state = (page) =>
  page.evaluate(() => {
    const flock = document.querySelector("[data-flock]");
    const running = flock ? document.getAnimations().filter((a) => a.playState === "running" && flock.contains(a.effect?.target)).length : -1;
    return { running, looking: flock ? flock.querySelectorAll("svg[data-look]").length : -1, on: flock?.hasAttribute("data-running") ?? false };
  });

const browser = await chromium.launch();
try {
  for (const reduced of [false, true]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await context.newPage();
    await page.goto(base + path, { waitUntil: "load" });
    // The example wakes when it nears the screen and replaces its markup: scroll, wait, scroll again.
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => document.querySelector("[data-flock]")?.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(1200);
    }
    let seenLook = false;
    let peak = 0;
    // A glance comes within ~10 s (4.2–9 s of waiting); watch for 14 s.
    for (let t = 0; t < 28; t++) {
      await page.waitForTimeout(500);
      const s = await state(page);
      peak = Math.max(peak, s.running);
      seenLook ||= s.looking > 0;
      if (!reduced && seenLook && peak >= 5) break;
    }
    const s = await state(page);
    if (reduced) {
      assert.equal(peak, 0, `reduced motion: ${peak} animation(s) still running`);
      assert.equal(seenLook, false, "reduced motion: a bird glanced");
      assert.equal(s.on, false, "reduced motion: the flock reports itself running");
      console.log("motion-check: reduced motion — still (0 animations, no glance)");
    } else {
      assert.ok(peak >= 5, `motion allowed: only ${peak} animation(s) running (each bird breathes, blinks, tilts)`);
      assert.ok(seenLook, "motion allowed: no two birds glanced at each other within 14 s");
      console.log(`motion-check: motion allowed — ${peak} animations running, a glance seen`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
