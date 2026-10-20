import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dirname, "motion.css"), "utf8");

describe("motion.css", () => {
  it("reads the accent instead of a hard-coded violet", () => {
    expect(css).not.toContain("rgba(168");
    expect(css).not.toContain("rgba(124");
  });

  it("retires the spotlight, the lift, the sheen and the magnet (krizaka-ui#393)", () => {
    for (const gone of [".kz-spotlight", ".kz-lift", ".kz-sheen", "[data-kz-magnetic]", "kz-glow-turn"]) expect(css).not.toContain(`${gone} {`);
    expect(css).not.toMatch(/kz-sheen-sweep|kz-glow-turn/);
  });

  it("arrival and growth are CSS only, paused off screen by the conductor and still under reduced motion", () => {
    for (const name of ["kz-arrive-slide", "kz-arrive-fade", "kz-arrive-flash", "kz-grow-draw", "kz-grow-rise"]) expect(css).toContain(`@keyframes ${name}`);
    // A row that arrives (a table row holding a [data-kz-arrive] cell, a list item, the element itself), by variant.
    expect(css).toMatch(/\[data-kz-arrive\], tr:has\(\[data-kz-arrive\]\)/);
    expect(css).toMatch(/\[data-kz-arrival="flash"\]/);
    // A sparkline grows: its stroke draws itself over `--kz-grow-duration`, its fill rises.
    expect(css).toMatch(/\.kz-grow svg path\[stroke\][^{]*\{[^}]*kz-grow-draw var\(--kz-grow-duration/);
    const reduced = css.slice(css.indexOf("prefers-reduced-motion: reduce"));
    expect(reduced).toMatch(/\[data-kz-arrive\]/);
    expect(reduced).toMatch(/\.kz-grow svg path/);
    expect(css).not.toMatch(/\.kz-(arrive|grow)[^{]*\{[^}]*(requestAnimationFrame|<canvas)/);
  });
});
