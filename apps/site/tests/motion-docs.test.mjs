import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// The Motion section of ui.krizaka.com (Krizaka Motion roadmap, krizaka-lab#22): the principles, the one config
// vocabulary, the primitives that move, the reduced-motion policy, the budget, and the lab that plays them.
const page = readFileSync(new URL("../content/docs/foundations/motion.mdx", import.meta.url), "utf8");

test("states the config vocabulary every animated primitive follows", () => {
  for (const prop of ["speed", "duration", "easing", "stagger", "direction", "density", "trigger", "reducedMotion", "hue", "paused"]) assert.match(page, new RegExp(`\`${prop}\``), prop);
});

test("lists the primitives that move, with what they offer", () => {
  for (const name of ["EngineFlow", "Route", "Pulse", "NumberTicker", "TerminalReplay", "Stepper", "data-kz-arrive", "kz-grow"]) assert.ok(page.includes(name), name);
});

test("says what the conductor guarantees and what reduced motion keeps", () => {
  for (const phrase of ["data-offscreen", "MotionObserver", "requestAnimationFrame", "prefers-reduced-motion"]) assert.ok(page.includes(phrase), phrase);
});

test("points to the lab where each one is played and tuned", () => {
  assert.match(page, /https:\/\/lab\.krizaka\.com\//);
});

test("keeps the page's own rules: no hover movement, no pointer light", () => {
  assert.match(page, /no pointer light/i);
});
