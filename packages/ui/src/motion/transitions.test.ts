import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Component enter and exit (docs/direction-2027.md, step b). Radix Presence keeps an overlay mounted during its exit
// only when the element runs a CSS animation (it reads animationName), so the exit is a keyframe animation; the
// enter uses @starting-style. Durations and easings come from the --kz-motion-* tokens, never typed here.

// The section heading is itself a comment: find it in the raw file, strip comments only from the section.
const raw = readFileSync(join(import.meta.dirname, "..", "motion.css"), "utf8");
const section = raw.slice(raw.indexOf("COMPONENT TRANSITIONS")).replace(/\/\*[\s\S]*?\*\//g, "");

const tabsSource = readFileSync(join(import.meta.dirname, "..", "tabs", "tabs.tsx"), "utf8");
const popoverSource = readFileSync(join(import.meta.dirname, "..", "popover", "popover.tsx"), "utf8");
const dialogSource = readFileSync(join(import.meta.dirname, "..", "dialog", "dialog.tsx"), "utf8");

describe("component transitions: the stylesheet section", () => {
  it("has its own section in motion.css", () => {
    expect(raw).toContain("COMPONENT TRANSITIONS");
  });

  it("enters the overlay and the panel with @starting-style", () => {
    expect(section).toMatch(/@starting-style\s*{[^}]*\.kz-overlay\[data-state="open"\]/s);
    expect(section).toMatch(/@starting-style\s*{[\s\S]*?\.kz-dialog\[data-state="open"\]/);
  });

  it("lets discrete properties transition (display, overlay) on the overlay and the panel", () => {
    expect(section).toMatch(/allow-discrete/);
  });

  it("exits the dialog panel and the overlay with a keyframe animation, so Presence waits for it", () => {
    expect(section).toMatch(/\.kz-dialog\[data-state="closed"\][^{]*{[^}]*animation:\s*kz-dialog-out/s);
    expect(section).toMatch(/\.kz-overlay\[data-state="closed"\][^{]*{[^}]*animation:\s*kz-overlay-out/s);
    expect(section).toMatch(/@keyframes kz-dialog-out/);
    expect(section).toMatch(/@keyframes kz-overlay-out/);
  });

  it("exits the popover content the same way", () => {
    expect(section).toMatch(/\.kz-popover\[data-state="closed"\][^{]*{[^}]*animation:\s*kz-popover-out/s);
    expect(section).toMatch(/@keyframes kz-popover-out/);
  });

  it("uses the motion tokens for duration and easing, with no literal milliseconds", () => {
    expect(section).toMatch(/var\(--kz-motion-duration-/);
    expect(section).toMatch(/var\(--kz-motion-ease-/);
    const body = section.replace(/:root\s*{[^}]*}/, "");
    expect(body).not.toMatch(/\b\d+ms\b/);
  });

  it("is instant under reduced motion: no animation, no transition", () => {
    const reduced = section.slice(section.indexOf("prefers-reduced-motion"));
    expect(reduced).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(reduced).toMatch(/animation:\s*none/);
    expect(reduced).toMatch(/transition:\s*none/);
  });
});

describe("component transitions: the components carry the hooks", () => {
  it("the dialog overlay and panel keep the classes the stylesheet targets", () => {
    expect(dialogSource).toContain("kz-overlay");
    expect(dialogSource).toContain("kz-dialog");
  });

  it("the popover content carries kz-popover", () => {
    expect(popoverSource).toMatch(/kz-popover/);
  });

  it("the tabs panel fades in on mount (kz-tabs-panel)", () => {
    expect(tabsSource).toMatch(/kz-tabs-panel/);
  });
});
