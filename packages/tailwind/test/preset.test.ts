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
  ])("generates %s from the token, read at use time", (selector, property, token) => {
    const body = rule(selector);
    expect(body).toContain(property);
    expect(body).toContain(`var(${token})`);
    expect(body).not.toMatch(/#[0-9a-f]{3,8}\b|hsl\(|oklch\(/i);
  });

  it("generates the hover state on the accent", () => {
    expect(css).toMatch(/\.hover\\:bg-accent-hover:hover\s*\{[^}]*background-color:\s*var\(--kz-accent-hover\)/);
  });

  it("scopes light: to html.light, outside any .theme-dark island", () => {
    expect(css).toContain("html.light .light\\:bg-media:where(:not(.theme-dark, .theme-dark *))");
    expect(css).toMatch(/:where\(:not\(\.theme-dark, \.theme-dark \*\)\)\s*\{[^}]*var\(--kz-media\)/);
  });

  it("brings the tokens, the motion signature and the Krizaka easing", () => {
    expect(css).toContain("--kz-surface-1:");
    expect(css).toContain(".kz-spotlight");
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
});
