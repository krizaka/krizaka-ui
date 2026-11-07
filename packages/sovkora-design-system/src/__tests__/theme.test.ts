/**
 * @vitest-environment node
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);

/*
 * theme.css is the Sovkora identity as --kz-* overrides. These tests resolve every theme the way the browser does
 * (the @krizaka/tokens defaults, then this file's overrides) and hold each one to WCAG AA.
 */

const theme = readFileSync(join(import.meta.dirname, "..", "theme.css"), "utf8");
const platform = readFileSync(require.resolve("@krizaka/tokens/tokens.css"), "utf8");
const brand = readFileSync(require.resolve("@krizaka/tokens/brands/sovkora.css"), "utf8");

type Declarations = Record<string, string>;

/** Top-level `selector { declarations }` blocks of a stylesheet (comments removed, nested at-rules skipped). */
function blocks(css: string): Map<string, Declarations> {
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map<string, Declarations>();
  for (const [, selector, body] of flat.matchAll(/([^{}@;]+)\{([^{}]*)\}/g)) {
    const key = selector.trim().replace(/\s+/g, " ");
    const declarations = Object.fromEntries(
      [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
    );
    out.set(key, { ...out.get(key), ...declarations });
  }
  return out;
}

const kz = blocks(platform);
const sovkora = blocks(brand);
const own = blocks(theme);

function pick(map: Map<string, Declarations>, selector: string): Declarations {
  const found = map.get(selector);
  if (!found) throw new Error(`no block "${selector}"`);
  return found;
}

const NAMED = ["electric", "custom", "cyberpunk", "solarized", "krizaka"] as const;
const named = (name: string) => pick(own, `html.theme-${name}, .theme-${name}`);

// The cascade of an app: the platform, then the Sovkora brand theme, then this file.
const dark: Declarations = {
  ...pick(kz, ":root, .theme-dark"),
  ...pick(kz, ":root"),
  ...pick(sovkora, ":root, .theme-dark"),
  ...pick(own, ":root, .theme-dark"),
};
const light = {
  ...dark,
  ...pick(kz, "html.light"),
  ...pick(sovkora, "html.light"),
  ...pick(own, "html.light"),
} as Declarations;
const themes: Record<string, Declarations> = {
  dark,
  light,
  ...Object.fromEntries(NAMED.map((name) => [name, { ...(name === "solarized" ? light : dark), ...named(name) }])),
};

/** The value of a role, `var(--x)` references followed. */
function role(t: Declarations, name: string): string {
  const value = t[`--kz-${name}`];
  if (value === undefined) throw new Error(`--kz-${name} is not set`);
  const ref = value.match(/^var\(--kz-([\w-]+)\)$/);
  return ref ? role(t, ref[1]) : value;
}

/** hsl(h s% l%) / hsl(h, s%, l%) → [r, g, b] in 0..255. */
function rgb(value: string): number[] {
  const m = value.match(/^hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/);
  if (!m) throw new Error(`unparsed colour ${value}`);
  const [h, s, l] = [Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100];
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => v * 255);
}

function luminance(value: string): number {
  const [r, g, b] = rgb(value)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("theme.css — Sovkora Orange", () => {
  it("is the Sovkora brand of @krizaka/tokens: orange, hsl(26 92% 55%) dark, #b45309 light", () => {
    expect(role(dark, "accent")).toBe("hsl(26 92% 55%)");
    expect(role(light, "accent")).toBe("hsl(26 90.5% 37.1%)");
    expect(role(dark, "on-accent")).toBe("hsl(240 6% 5%)");
    expect(role(light, "on-accent")).toBe("hsl(0 0% 100%)");
  });

  it("does not re-declare the brand: the accent family comes from @krizaka/tokens/brands/sovkora.css", () => {
    for (const selector of [":root, .theme-dark", "html.light"]) {
      expect(Object.keys(pick(own, selector)).filter((name) => name.startsWith("--kz-"))).toEqual([]);
    }
  });

  it("keeps Electric Blue (the 2.x identity) as the named theme `electric`", () => {
    expect(role(themes.electric, "accent")).toBe("hsl(217 92% 60%)");
  });

  it("keeps the platform surfaces (the krizaka.com values) and overrides only what is Sovkora's", () => {
    for (const name of ["surface-0", "surface-1", "surface-2", "surface-3", "text-primary", "text-muted"]) {
      expect(role(dark, name)).toBe(pick(kz, ":root, .theme-dark")[`--kz-${name}`]);
      expect(role(light, name)).toBe(pick(kz, "html.light")[`--kz-${name}`]);
    }
  });

  it.each(Object.keys(themes))("reads at WCAG AA in %s", (name) => {
    const t = themes[name];
    for (const surface of ["surface-0", "surface-1", "surface-2", "surface-3"].map((s) => role(t, s))) {
      expect(contrast(role(t, "text-primary"), surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(role(t, "text-secondary"), surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(role(t, "text-muted"), surface)).toBeGreaterThanOrEqual(3);
    }
    // The text and icons on the accent (primary button, sent bubble), at rest and on hover.
    expect(contrast(role(t, "on-accent"), role(t, "accent"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(role(t, "on-accent"), role(t, "accent-hover"))).toBeGreaterThanOrEqual(4.5);
    // The accent as text (links, active labels) on every surface.
    for (const surface of ["surface-0", "surface-1", "surface-2", "surface-3"].map((s) => role(t, s))) {
      expect(contrast(role(t, "accent-text"), surface)).toBeGreaterThanOrEqual(4.5);
    }
    // The focus ring stands out from the page (non-text contrast).
    expect(contrast(role(t, "ring"), role(t, "surface-0"))).toBeGreaterThanOrEqual(3);
  });
});

describe("theme.css — mechanism", () => {
  it("brings the platform layers first", () => {
    const code = theme.replace(/\/\*[\s\S]*?\*\//g, "");
    const imports = [...code.matchAll(/@import\s+"([^"]+)"/g)].map(([, path]) => path);
    expect(imports).toEqual(["@krizaka/tailwind", "@krizaka/ui/tailwind.css", "@krizaka/tokens/brands/sovkora.css"]);
  });

  it("declares no variant and no `.dark` theme: dark on :root, html.light, html.theme-<name>", () => {
    expect(theme).not.toMatch(/@custom-variant/);
    expect([...own.keys()].some((selector) => /(^|[\s,])\.dark\b/.test(selector))).toBe(false);
    for (const name of NAMED) expect(named(name)["--kz-accent"]).toBeDefined();
  });

  it("applies each named theme as an island too (`.theme-<name>` on any element), the html selector first", () => {
    for (const name of NAMED) {
      expect(own.has(`html.theme-${name}, .theme-${name}`)).toBe(true);
    }
  });

  it("gives each named theme its whole accent family, so an island never keeps the brand's orange", () => {
    for (const name of NAMED) {
      for (const r of ["accent", "accent-text", "accent-2", "ring", "info", "brand-gradient-from"]) {
        expect([name, r, named(name)[`--kz-${r}`] !== undefined]).toEqual([name, r, true]);
      }
    }
  });

  it("writes roles only: no 1.x variable, no unprefixed token (the 2.x compatibility is gone since 3.0)", () => {
    const declared = [...theme.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(([, name]) => name);
    const unprefixed = declared.filter(
      (name) => !/^--(kz|sovkora)-/.test(name) && !/^--text-(xs|sm|base|lg|xl|2xl|display)$/.test(name),
    );
    expect(unprefixed).toEqual([]);
  });
});
