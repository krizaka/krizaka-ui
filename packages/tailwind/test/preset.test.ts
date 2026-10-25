import { readFileSync } from "node:fs";
import { join } from "node:path";

import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";

// The app entry of the README, compiled for real: Tailwind resolves `@krizaka/tailwind` (this package, by its
// exports), the tokens and the motion signature, and scans the fixture next to the entry.
const fixtures = join(import.meta.dirname, "fixtures");
const entry = `@import "tailwindcss";\n@import "@krizaka/tailwind";\n`;
const { css } = await postcss([tailwindcss({ base: fixtures, optimize: false })]).process(entry, {
  from: join(fixtures, "app.css"),
});

/** The declarations of the rule whose selector is exactly `selector`. */
function rule(selector: string): string {
  const root = postcss.parse(css);
  let body: string | undefined;
  root.walkRules((r) => {
    if (r.selector === selector) body = r.nodes.map(String).join("; ");
  });
  if (body === undefined) throw new Error(`no rule for ${selector}`);
  return body;
}

describe("@krizaka/tailwind", () => {
  it.each([
    [".bg-surface-1", "background-color", "--kz-surface-1"],
    [".text-fg", "color", "--kz-text-primary"],
    [".text-fg-muted", "color", "--kz-text-muted"],
    [".border-border-subtle", "border-color", "--kz-border-subtle"],
    [".rounded-xl", "border-radius", "--kz-radius-xl"],
    [".shadow-md", "--tw-shadow", "--kz-shadow-md"],
    [".text-accent", "color", "--kz-accent"],
    [".text-fg-accent", "color", "--kz-accent-text"],
    [".text-fg-danger", "color", "--kz-danger-text"],
    [".text-fg-success", "color", "--kz-success-text"],
    [".text-fg-warning", "color", "--kz-warning-text"],
    [".text-fg-info", "color", "--kz-info-text"],
    [".from-brand-from", "--tw-gradient-from", "--kz-brand-gradient-from"],
  ])("generates %s from the token, read at use time", (selector, property, token) => {
    const body = rule(selector);
    expect(body).toContain(property);
    expect(body).toContain(`var(${token})`);
    expect(body).not.toMatch(/#[0-9a-f]{3,8}\b|hsl\(|oklch\(/i);
  });

  it.each([
    [".font-display", "--kz-font-display"],
    [".font-text", "--kz-font-text"],
    [".font-mono", "--kz-font-mono"],
    [".font-cahier", "--kz-font-cahier"],
  ])("generates %s from the family token", (selector, token) => {
    expect(rule(selector)).toContain(`font-family: var(${token})`);
  });

  it.each(["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "title-lg", "title-md", "body-lg", "body-md", "body-sm", "caption", "overline", "mono-md", "mono-sm"])(
    "text-%s carries size, line height, weight and tracking from the type scale",
    (step) => {
      const body = rule(`.text-${step}`);
      expect(body).toContain(`font-size: var(--kz-type-${step}-size)`);
      expect(body).toContain(`var(--kz-type-${step}-line-height)`);
      expect(body).toContain(`var(--kz-type-${step}-weight)`);
      expect(body).toContain(`var(--kz-type-${step}-tracking)`);
    },
  );

  it("generates the hover state on the accent", () => {
    expect(css).toMatch(/\.hover\\:bg-accent-hover:hover\s*\{[^}]*background-color:\s*var\(--kz-accent-hover\)/);
  });

  it("scopes light: to html.light, outside any .theme-dark island", () => {
    expect(css).toContain("html.light .light\\:bg-media:where(:not(.theme-dark, .theme-dark *))");
    expect(css).toMatch(/:where\(:not\(\.theme-dark, \.theme-dark \*\)\)\s*\{[^}]*var\(--kz-media\)/);
  });

  it("brings the tokens, the motion signature and the Krizaka easing", () => {
    expect(css).toContain("--kz-surface-1:");
    expect(css).toContain(".kz-marquee");
    // krizaka-ui#393: no pointer light, no lift, no sheen in the motion signature.
    for (const gone of [".kz-spotlight {", ".kz-lift {", ".kz-sheen {"]) expect(css).not.toContain(gone);
  });

  it.each([
    [".bg-success-soft", "background-color", "--kz-success-soft"],
    [".bg-glass", "background-color", "--kz-glass-bg"],
    [".border-glass-border", "border-color", "--kz-glass-border"],
    [".shadow-raised", "--tw-shadow", "--kz-shadow-raised"],
    [".shadow-floating", "--tw-shadow", "--kz-shadow-floating"],
    [".shadow-overlay", "--tw-shadow", "--kz-shadow-overlay"],
    [".inset-shadow-edge", "--tw-inset-shadow", "--kz-edge-light"],
    [".inset-shadow-edge-fill", "--tw-inset-shadow", "--kz-edge-on-fill"],
    [".inset-shadow-well", "--tw-inset-shadow", "--kz-edge-well"],
    [".bg-sheen", "background-image", "--kz-surface-sheen"],
    [".bg-fill-shade", "background-image", "--kz-fill-shade"],
    [".glass", "background-color", "--kz-glass-bg"],
    [".ruled", "background-image", "--kz-paper-rule-major"],
    [".ruled-lines", "background-size", "--kz-paper-line"],
    [".bg-tag", "background-color", "--kz-paper-tag"],
    [".text-fg-tag", "color", "--kz-paper-tag-ink"],
    [".text-margin", "color", "--kz-paper-rule-margin"],
    [".rounded-2xl", "border-radius", "--kz-radius-2xl"],
    [".rounded-3xl", "border-radius", "--kz-radius-2xl"],
    [".node", "background-color", "--kz-border-strong"],
    [".ease-spring", "transition-timing-function", "--kz-ease-spring"],
  ])("generates the signature %s from the tokens (BRAND.md §6)", (selector, property, token) => {
    const body = rule(selector);
    expect(body).toContain(property);
    expect(body).toContain(`var(${token})`);
    expect(body).not.toMatch(/#[0-9a-f]{3,8}\b|hsl\(|oklch\(/i);
  });

  it("composes the brand glow and the halo where they are used, so a .brand-<id> section has its own", () => {
    expect(rule(".shadow-glow")).toContain("color-mix(in oklab, var(--kz-accent)");
    expect(rule(".bg-halo")).toContain("linear-gradient(var(--kz-accent), var(--kz-accent))");
  });

  it("Cahier (ADR-004): nothing frosted, nothing glowing — no backdrop blur, no blurred glow, no radial halo", () => {
    expect(rule(".glass")).not.toContain("backdrop-filter");
    expect(rule(".bg-halo")).not.toContain("radial-gradient");
    expect(css).not.toMatch(/--shadow-glow(-lg)?:[^;]*\d+px \d+px [1-9]\d*px/);
    expect(rule(".data-\\[on\\]\\:node-lit[data-on]")).not.toMatch(/(^|[,:]\s*)0 0 [1-9]\d*px/);
    expect(css).toContain("font-synthesis-weight: none");
  });

  it("Cahier (ADR-004): tabular-nums is also lining-nums, so every figure of the family sits on one baseline", () => {
    expect(rule(".tabular-nums")).toContain("--tw-numeric-figure: lining-nums");
  });

  it("draws the signature focus ring: a crisp ring off the element, in a halo, added to the element's shadows", () => {
    const ring = rule(".focus-visible\\:focus-ring:focus-visible");
    expect(ring).toContain("outline: var(--kz-ring-width) solid var(--kz-ring)");
    expect(ring).toContain("outline-offset: var(--kz-ring-offset)");
    expect(ring).toContain("var(--tw-shadow, 0 0 #0000)");
    expect(rule(".focus-visible\\:focus-ring-inset:focus-visible")).toContain("outline-offset: calc(var(--kz-ring-width) * -1)");
  });

  it("hides the outline of a mouse click, and keeps the keyboard ring on the token everywhere", () => {
    // A click focuses an element without showing :focus-visible: the browser's blue outline must not appear.
    expect(rule(":focus:not(:focus-visible)")).toContain("outline: none");
    // Keyboard focus of any element without its own ring: the token ring, not the browser default.
    const keyboard = rule(":focus-visible");
    expect(keyboard).toContain("outline: var(--kz-ring-width) solid var(--kz-ring)");
    expect(keyboard).toContain("outline-offset: var(--kz-ring-offset)");
  });

  it("gives every transition the Krizaka easing", () => {
    expect(rule(".transition")).toContain("var(--tw-ease, var(--kz-ease))");
    expect(rule(".ease-kz")).toContain("var(--kz-ease)");
  });

  it("only maps tokens that @krizaka/tokens defines", () => {
    const preset = readFileSync(join(import.meta.dirname, "../index.css"), "utf8");
    const tokens = readFileSync(join(import.meta.dirname, "../node_modules/@krizaka/tokens/dist/tokens.css"), "utf8");
    const used = new Set([...preset.matchAll(/var\((--kz-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    const missing = [...used].filter((name) => !tokens.includes(`${name}:`));
    expect(missing).toEqual([]);
  });
  // #659: a blue block showed on the brand and the titles without any keyboard use.
  describe("focus: the ring is the keyboard's (:focus-visible only)", () => {
    /** Every rule whose selector list matches `test`, with its declarations. */
    function rulesWhere(test: (selector: string) => boolean): string[] {
      const out: string[] = [];
      postcss.parse(css).walkRules((r) => {
        if (r.selectors.some(test)) out.push(r.nodes.map(String).join("; "));
      });
      return out;
    }

    it("hides the ring on a pointer focus and draws it for the keyboard", () => {
      expect(rule(":focus:not(:focus-visible)")).toContain("outline: none");
      expect(rule(":focus-visible")).toContain("outline: var(--kz-ring-width) solid var(--kz-ring)");
    });

    it("never rings an element focused by code (a heading, main, a region with tabindex=-1)", () => {
      const bodies = rulesWhere((s) => /\[tabindex=["']?-1["']?\]/.test(s) && /:focus/.test(s) && /h1/.test(s));
      expect(bodies.length).toBeGreaterThan(0);
      expect(bodies.join(";")).toMatch(/outline:\s*none/);
      expect(bodies.join(";")).toMatch(/box-shadow:\s*none/);
    });

    it("keeps the roving-tabindex items (they have a role) out of that reset: arrow keys must show the ring", () => {
      const sels = rulesWhere((s) => /\[tabindex=["']?-1["']?\]/.test(s) && /:focus/.test(s) && /h1/.test(s));
      expect(sels.length).toBeGreaterThan(0);
      const all: string[] = [];
      postcss.parse(css).walkRules((r) => {
        if (r.selectors.some((s) => /\[tabindex=["']?-1["']?\]/.test(s) && /h1/.test(s))) all.push(r.selector);
      });
      expect(all.join(",")).toContain(":not([role])");
    });

    it("draws no tap highlight: a touch on the brand or a title leaves no blue block", () => {
      const bodies = rulesWhere((s) => s.trim() === "a" || s.trim() === "h1");
      expect(bodies.join(";")).toMatch(/-webkit-tap-highlight-color:\s*transparent/);
    });
  });
});
