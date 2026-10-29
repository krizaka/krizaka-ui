import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { BRAND_ROLES, BRANDS, camel, compile, compileBrands, flatten, load, loadBrands, write } from "../scripts/build.mjs";
import { contrast, over, parseHsl, toNative } from "../scripts/color.mjs";

const sources = load(join(import.meta.dirname, "../src/tokens"));
const brandSources = loadBrands(join(import.meta.dirname, "../src/brands"));
const { files, tokens } = compile(sources, brandSources);
const css = files["tokens.css"];
/** Each brand's raw accent family per theme (aliases resolved). */
const brandsIndex = compileBrands(tokens, brandSources).values as Record<string, Record<"dark" | "light", Record<string, string>>>;

/** The `--kz-*` declarations of one CSS block, by its exact selector. */
function declarations(selector: string): Map<string, string> {
  const start = css.indexOf(`\n${selector} {`);
  expect(start, `block ${selector}`).toBeGreaterThan(-1);
  const body = css.slice(start, css.indexOf("\n}", start));
  return new Map([...body.matchAll(/(--kz-[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
}
const dark = declarations(":root, .theme-dark");
const light = declarations("html.light");
const lightIsland = declarations(".theme-light");
const invariant = declarations(":root");

/** A colour token's raw value in a theme, aliases followed. */
function color(name: string, mode: "dark" | "light"): string {
  const own = mode === "light" ? (light.get(name) ?? dark.get(name)) : dark.get(name);
  const value = own ?? invariant.get(name);
  if (!value) throw new Error(`${name} is not declared`);
  const alias = /^var\((--kz-[\w-]+)\)$/.exec(value);
  return alias ? color(alias[1], mode) : value;
}

describe("tokens.css", () => {
  it("matches the snapshot", async () => {
    await expect(css).toMatchFileSnapshot("./__snapshots__/tokens.css");
  });

  it("is marked as generated and orders its blocks dark, light, invariants", () => {
    expect(css.split("\n")[0]).toContain("GÉNÉRÉ");
    expect(css.split("\n")[0]).toContain("ne pas éditer");
    const order = [":root, .theme-dark {", "html.light {", ".theme-light {", "\n:root {"].map((s) => css.indexOf(s));
    expect(order.every((i) => i > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(css).toMatch(/:root, \.theme-dark \{\n {2}color-scheme: dark;/);
    expect(css).toMatch(/html\.light \{\n {2}color-scheme: light;/);
  });

  it("gives every light token its dark counterpart", () => {
    expect(light.size).toBeGreaterThan(0);
    for (const name of light.keys()) expect(dark.has(name), `${name} has no dark value`).toBe(true);
  });

  it("declares each token in exactly one of the dark or invariant blocks", () => {
    for (const name of invariant.keys()) expect(dark.has(name), `${name} is declared twice`).toBe(false);
    expect(dark.size + invariant.size).toBe(tokens.length);
  });

  it("gives .theme-light the light values of every token .theme-dark declares, aliases included (parity)", () => {
    expect([...lightIsland.keys()].sort()).toEqual([...dark.keys()].sort());
    for (const [name, value] of light) expect(lightIsland.get(name), name).toBe(value);
    for (const [name, value] of lightIsland) if (!light.has(name)) expect(value, name).toBe(dark.get(name));
    expect(lightIsland.get("--kz-ring")).toBe("var(--kz-accent)");
    expect(css).toMatch(/\.theme-light \{\n {2}color-scheme: light;/);
  });

  it("keeps aliases in the dark block so they re-resolve under .theme-dark", () => {
    for (const [name, value] of invariant) expect(value, name).not.toContain("var(");
    expect(dark.get("--kz-ring")).toBe("var(--kz-accent)");
  });

  it("ends the section gradient on the page surface itself (an alias, so an app's own --kz-surface-0 follows)", () => {
    expect(dark.get("--kz-brand-gradient-to")).toBe("var(--kz-surface-0)");
    expect(lightIsland.get("--kz-brand-gradient-to")).toBe("var(--kz-surface-0)");
    expect(light.has("--kz-brand-gradient-to")).toBe(false);
  });

  it("keeps what sits on a media identical in both themes", () => {
    for (const name of ["--kz-scrim", "--kz-scrim-strong", "--kz-text-on-media", "--kz-overlay"]) {
      expect(invariant.has(name), name).toBe(true);
      expect(light.has(name), name).toBe(false);
    }
  });
});

describe("contrast (WCAG 2.x)", () => {
  const surfaces = ["--kz-surface-0", "--kz-surface-1", "--kz-surface-2", "--kz-surface-3"];
  const ratio = (fg: string, bg: string, mode: "dark" | "light") =>
    contrast(parseHsl(color(fg, mode)), parseHsl(color(bg, mode)));

  for (const mode of ["dark", "light"] as const) {
    for (const bg of surfaces) {
      it(`${mode}: text-primary and text-secondary ≥ 4.5:1, text-muted ≥ 4.5:1 on ${bg} (small text, WCAG AA)`, () => {
        expect(ratio("--kz-text-primary", bg, mode)).toBeGreaterThanOrEqual(4.5);
        expect(ratio("--kz-text-secondary", bg, mode)).toBeGreaterThanOrEqual(4.5);
        expect(ratio("--kz-text-muted", bg, mode)).toBeGreaterThanOrEqual(4.5);
      });
    }
    it(`${mode}: on-accent ≥ 4.5:1 on accent, accent-text ≥ 4.5:1 on every surface`, () => {
      expect(ratio("--kz-on-accent", "--kz-accent", mode)).toBeGreaterThanOrEqual(4.5);
      for (const bg of surfaces) expect(ratio("--kz-accent-text", bg, mode), bg).toBeGreaterThanOrEqual(4.5);
    });
    it(`${mode}: the status text roles (success, warning, danger, info) ≥ 4.5:1 on every surface — small text included`, () => {
      for (const role of ["success", "warning", "danger", "info"]) {
        for (const bg of surfaces) expect(ratio(`--kz-${role}-text`, bg, mode), `${role} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  it("keeps the status fills ≥ 3:1 for non-text marks (dot, border, icon) on the dark surfaces", () => {
    for (const role of ["--kz-success", "--kz-warning", "--kz-danger"]) expect(ratio(role, "--kz-surface-0", "dark"), role).toBeGreaterThanOrEqual(3);
  });

  it("computes the reference ratios", () => {
    const black = parseHsl("hsl(0 0% 0%)");
    const white = parseHsl("hsl(0 0% 100%)");
    expect(contrast(white, black)).toBeCloseTo(21, 5);
    expect(contrast(white, white)).toBe(1);
    // #767676 on white is the classic 4.54:1 threshold.
    expect(contrast({ r: 0x76, g: 0x76, b: 0x76, a: 1 }, white)).toBeCloseTo(4.54, 2);
    // A translucent foreground is composited first: 50 % black on white is #808080.
    expect(contrast(parseHsl("hsl(0 0% 0% / 0.5)"), white)).toBeCloseTo(contrast({ r: 127.5, g: 127.5, b: 127.5, a: 1 }, white), 5);
  });
});

describe("surfaces & matières (BRAND.md §6)", () => {
  const surfaces = ["--kz-surface-0", "--kz-surface-1", "--kz-surface-2", "--kz-surface-3"];
  const raw = (name: string, mode: "dark" | "light") => parseHsl(color(name, mode));

  for (const mode of ["dark", "light"] as const) {
    it(`${mode}: text on glass keeps AA whatever passes under it (surfaces, the page's own text, the accent)`, () => {
      const glass = raw("--kz-glass-bg", mode);
      // Cahier (ADR-004): what floats is a sheet of paper, opaque — no frosted glass.
      expect(glass.a).toBe(1);
      for (const under of [...surfaces, "--kz-text-primary", "--kz-accent", "--kz-accent-text"]) {
        const bg = over(glass, raw(under, mode));
        expect(contrast(raw("--kz-text-primary", mode), bg), `primary on glass over ${under}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(raw("--kz-text-secondary", mode), bg), `secondary on glass over ${under}`).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${mode}: the primary text reads ≥ 4.5:1 on every status tint over every surface, the status text over surfaces 0–2`, () => {
      for (const role of ["success", "warning", "danger"]) {
        for (const s of surfaces) {
          const bg = over(raw(`--kz-${role}-soft`, mode), raw(s, mode));
          expect(contrast(raw("--kz-text-primary", mode), bg), `${role}-soft on ${s}`).toBeGreaterThanOrEqual(4.5);
          // A tinted badge or alert sits on the page, a card or a raised element (0–2); surface-3 is a track or an active chip.
          if (s !== "--kz-surface-3") expect(contrast(raw(`--kz-${role}-text`, mode), bg), `${role}-text on ${role}-soft over ${s}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    it(`${mode}: the sheen keeps the text roles AA at the top of every raised surface`, () => {
      for (const s of surfaces) {
        const top = over(raw("--kz-surface-sheen", mode), raw(s, mode));
        expect(contrast(raw("--kz-text-primary", mode), top), s).toBeGreaterThanOrEqual(4.5);
        expect(contrast(raw("--kz-text-secondary", mode), top), s).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  it("keeps on-accent ≥ 4.5:1 down to the shaded bottom of a fill, in every brand and both themes", () => {
    for (const id of BRANDS) {
      for (const mode of ["dark", "light"] as const) {
        const b = brandsIndex[id][mode];
        for (const fill of [b.accent, b.accentHover]) {
          const shaded = over(raw("--kz-fill-shade", mode), parseHsl(fill));
          expect(contrast(parseHsl(b.onAccent), shaded), `${id} ${mode} ${fill}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("collapses every duration to 0 ms under reduced motion, and keeps them ≤ 200 ms", () => {
    const durations = tokens.filter((t) => t.type === "duration");
    expect(durations.map((t) => t.name)).toEqual(["duration-instant", "duration-fast", "duration-base"]);
    for (const t of durations) expect(Number.parseFloat(String(t.dark))).toBeLessThanOrEqual(200);
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    for (const t of durations) expect(reduced).toContain(`--kz-${t.name}: 0ms;`);
  });

  it("tightens the controls under [data-density=compact]", () => {
    const block = css.slice(css.indexOf('[data-density="compact"] {'));
    for (const step of ["sm", "md", "lg", "field"]) {
      const normal = Number.parseFloat(String(invariant.get(`--kz-control-${step}`)));
      const compact = Number.parseFloat(new RegExp(`--kz-control-${step}: ([\\d.]+)px`).exec(block)?.[1] ?? "NaN");
      expect(compact, step).toBeLessThan(normal);
    }
  });

  it("rejects a compact value on a non-dimension", () => {
    expect(() => flatten({ x: { c: { $type: "color", $value: "hsl(0 0% 0%)", $extensions: { "com.krizaka": { compact: "1px" } } } } })).toThrow(/compact/);
  });
});

describe("colour conversion", () => {
  it("converts hsl() to hex, and to rgba() when translucent", () => {
    expect(toNative(parseHsl("hsl(240 6% 5%)"))).toBe("#0c0c0e");
    expect(toNative(parseHsl("hsl(0 0% 100%)"))).toBe("#ffffff");
    expect(toNative(parseHsl("hsl(217 92% 50%)"))).toBe("#0a64f5");
    expect(toNative(parseHsl("hsl(0 0% 0% / 0.60)"))).toBe("rgba(0,0,0,0.6)");
    expect(toNative(parseHsl("hsl(0 0% 100% / 6%)"))).toBe("rgba(255,255,255,0.06)");
  });

  it("refuses what it cannot read", () => {
    expect(() => parseHsl("#fff")).toThrow(/hsl/);
  });
});

describe("generated modules", async () => {
  const out = mkdtempSync(join(tmpdir(), "kz-tokens-"));
  write(files, out);
  const index = await import(pathToFileURL(join(out, "index.js")).href);
  const native = await import(pathToFileURL(join(out, "native.js")).href);
  const allNames = [...dark.keys(), ...invariant.keys()];

  it("index: camelCase keys referencing the CSS variables", () => {
    expect(index.tokens.surface0).toBe("var(--kz-surface-0)");
    expect(index.tokens.textOnMedia).toBe("var(--kz-text-on-media)");
    expect(Object.values(index.tokens).sort()).toEqual(allNames.map((n) => `var(${n})`).sort());
    expect(Object.isFrozen(index.tokens)).toBe(true);
  });

  it("index: raw values per theme, aliases resolved", () => {
    expect(index.values.dark.surface0).toBe(dark.get("--kz-surface-0"));
    expect(index.values.light.surface0).toBe(light.get("--kz-surface-0"));
    expect(index.values.light.radiusMd).toBe("2px");
    expect(index.values.dark.ring).toBe(dark.get("--kz-accent"));
    expect(index.values.light.ring).toBe(light.get("--kz-accent"));
    expect(Object.keys(index.values.light)).toEqual(Object.keys(index.tokens));
  });

  it("native: the same colour roles as tokens.css, in both themes", () => {
    const colorRoles = tokens.filter((t) => t.type === "color").map((t) => camel(t.name));
    const nonColor = new Set(tokens.filter((t) => t.type !== "color").map((t) => `--kz-${t.name}`));
    const cssColorRoles = allNames.filter((n) => !nonColor.has(n)).map((n) => camel(n.slice("--kz-".length)));
    expect(Object.keys(native.themes.dark).sort()).toEqual(cssColorRoles.sort());
    expect(Object.keys(native.themes.dark).sort()).toEqual(colorRoles.sort());
    expect(Object.keys(native.themes.light)).toEqual(Object.keys(native.themes.dark));
  });

  it("native: radius and typography mirror their CSS tokens", () => {
    const keysOf = (prefix: string) =>
      allNames.filter((n) => n.startsWith(`--kz-${prefix}-`)).map((n) => camel(n.slice(`--kz-${prefix}-`.length))).sort();
    expect(Object.keys(native.radius).sort()).toEqual(keysOf("radius"));
    expect(Object.keys(native.typography).sort()).toEqual(keysOf("font"));
    expect(native.radius).toEqual({ xs: 2, sm: 2, md: 2, lg: 0, xl: 0, "2xl": 0, full: 9999 });
    expect(native.typography).toEqual({ sans: "Atkinson Hyperlegible Next", text: "Atkinson Hyperlegible Next", display: "Young Serif", mono: "Courier Prime", cahier: "Krizaka Cahier", productDisplay: "Plus Jakarta Sans", monoMeta: "Courier Prime" });
    expect(native.motion.ease).toEqual([0.45, 0, 0.2, 1]);
    expect(native.motion.spring).toEqual([0.34, 1.36, 0.64, 1]);
    expect(native.motion.duration).toEqual({ instant: 90, fast: 150, base: 200 });
  });

  it("native: the shadows as boxShadow strings per theme, and the griffe's size", () => {
    expect(Object.keys(native.shadows.dark)).toEqual(["sm", "md", "lg", "raised", "floating", "overlay", "hover"]);
    expect(Object.keys(native.shadows.light)).toEqual(Object.keys(native.shadows.dark));
    for (const v of Object.values(native.shadows.dark) as string[]) expect(v).toMatch(/^(-?[\d.]+(px)? ){4}rgba\([\d,.]+\)(, (-?[\d.]+(px)? ){4}rgba\([\d,.]+\))*$/);
    expect(native.shadows.light.raised).not.toBe(native.shadows.dark.raised);
    expect(native.cut).toEqual({ size: 10 });
    expect(files["native.d.ts"]).toContain("export declare const shadows");
  });

  it("native: resolved hex and rgba values", () => {
    for (const theme of [native.themes.dark, native.themes.light]) {
      for (const v of Object.values(theme)) expect(v).toMatch(/^(#[0-9a-f]{6}|rgba\(\d+,\d+,\d+,[\d.]+\))$/);
    }
    expect(native.themes.dark.surface0).toBe("#151b18");
    expect(native.themes.light.surface1).toMatch(/^#f[0-9a-f]{5}$/);
    expect(native.themes.dark.scrim).toBe("rgba(0,0,0,0.6)");
    expect(native.themes.light.scrim).toBe("rgba(0,0,0,0.6)");
    expect(native.themes.dark.ring).toBe(native.themes.dark.accent);
    expect(native.themes.light.ring).toBe(native.themes.light.accent);
  });

  it("the type scale: four values per step, in CSS, the index and native", () => {
    const steps = index.typeScale;
    expect(steps.map((s: { name: string }) => s.name)).toEqual([
      "display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "title-lg", "title-md",
      "body-lg", "body-md", "body-sm", "caption", "overline", "mono-md", "mono-sm",
    ]);
    const root = declarations(":root");
    for (const s of steps) {
      expect(root.get(`--kz-type-${s.name}-size`)).toBe(s.size);
      expect(root.get(`--kz-type-${s.name}-line-height`)).toBe(String(s.lineHeight));
      expect(root.get(`--kz-type-${s.name}-weight`)).toBe(String(s.weight));
      expect(root.get(`--kz-type-${s.name}-tracking`)).toBe(s.tracking);
      expect(["display", "text", "mono"]).toContain(s.role);
      expect(s.description.length).toBeGreaterThan(5);
      const n = native.typeScale[camel(s.name)];
      expect(n.fontSize).toBe(Number.parseFloat(s.size));
      expect(n.lineHeight).toBe(Math.round(Number.parseFloat(s.size) * s.lineHeight));
      expect(n.fontWeight).toBe(String(s.weight));
      expect(n.role).toBe(s.role);
    }
    // Sizes go down the scale, display then body.
    const size = (name: string) => Number.parseFloat(steps.find((s: { name: string }) => s.name === name).size);
    const descending = (names: string[]) => names.every((n, i) => i === 0 || size(names[i - 1]) > size(n));
    expect(descending(["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "title-lg", "title-md"])).toBe(true);
    expect(descending(["body-lg", "body-md", "body-sm", "caption", "overline"])).toBe(true);
    for (const s of steps.filter((x: { role: string }) => x.role === "display")) expect(Number.parseFloat(s.size)).toBeGreaterThanOrEqual(20);
    expect(native.typeScale.display2xl.letterSpacing).toBeCloseTo(-0.72, 2);
  });

  it("the font roles: text aliases sans; display and mono are their own families, with a metric-matched fallback", () => {
    expect(dark.get("--kz-font-text")).toBe("var(--kz-font-sans)");
    const root = declarations(":root");
    expect(root.get("--kz-font-sans")).toMatch(/^"Atkinson Hyperlegible Next", "Atkinson Hyperlegible Next Fallback", /);
    expect(root.get("--kz-font-display")).toMatch(/^"Young Serif", "Young Serif Fallback", Georgia/);
    expect(root.get("--kz-font-mono")).toMatch(/^"Courier Prime", "Courier Prime Fallback", /);
    expect(root.get("--kz-font-cahier")).toMatch(/^"Krizaka Cahier", "Krizaka Cahier Fallback", /);
  });

  it("type declarations name every export", () => {
    for (const name of ["tokens", "values", "TokenName", "typeScale", "TypeStep"]) expect(files["index.d.ts"]).toContain(name);
    for (const name of ["themes", "radius", "typography", "motion", "Theme", "typeScale", "NativeTypeStep"]) expect(files["native.d.ts"]).toContain(name);
    expect(files["index.d.ts"]).toContain('readonly surface0: "var(--kz-surface-0)";');
  });
});

describe("sources", () => {
  it("rejects a token without a $type", () => {
    expect(() => flatten({ color: { x: { $value: "hsl(0 0% 0%)" } } })).toThrow(/\$type/);
  });

  it("rejects an unknown alias and a themed alias", () => {
    expect(() => compile({ color: { a: { $type: "color", $value: "{nope}" } } })).toThrow(/Unknown alias/);
    expect(() =>
      compile({
        color: {
          a: { $type: "color", $value: "hsl(0 0% 0%)" },
          b: { $type: "color", $value: "{a}", $extensions: { "com.krizaka": { light: "hsl(0 0% 100%)" } } },
        },
      }),
    ).toThrow(/alias follows/);
  });

  it("rejects duplicate CSS names", () => {
    expect(() =>
      flatten({
        color: {
          "a-b": { $type: "color", $value: "hsl(0 0% 0%)" },
          a: { b: { $type: "color", $value: "hsl(0 0% 0%)" } },
        },
      }),
    ).toThrow(/Duplicate/);
  });
});

describe("brands", async () => {
  const out = mkdtempSync(join(tmpdir(), "kz-brands-"));
  write(files, out);
  const index = await import(pathToFileURL(join(out, "index.js")).href);
  const native = await import(pathToFileURL(join(out, "native.js")).href);
  const surfaces = ["surface0", "surface1", "surface2", "surface3"] as const;

  it("compiles one theme per brand and the scoped classes", () => {
    expect(BRANDS).toEqual(["krizaka", "orazaka", "yomizaka", "akinaza"]);
    for (const id of BRANDS) expect(files[`brands/${id}.css`], id).toBeDefined();
    expect(files["brands/scoped.css"]).toContain(".brand-orazaka {");
    expect(Object.keys(index.brands)).toEqual(BRANDS);
    expect(Object.keys(native.brands)).toEqual(BRANDS);
  });

  it("matches the snapshots", async () => {
    for (const id of BRANDS) await expect(files[`brands/${id}.css`]).toMatchFileSnapshot(`./__snapshots__/brands/${id}.css`);
    await expect(files["brands/scoped.css"]).toMatchFileSnapshot("./__snapshots__/brands/scoped.css");
  });

  it("sets every role of the accent family, in both themes, in every block", () => {
    for (const id of BRANDS) {
      for (const mode of ["dark", "light"] as const) {
        expect(Object.keys(index.brands[id][mode])).toEqual(BRAND_ROLES.map(camel));
      }
      // html.light outweighs `:root`: it restates every literal role, or the platform's light accent would win.
      const css = files[`brands/${id}.css`];
      const block = (selector: string) => css.slice(css.indexOf(`${selector} {`), css.indexOf("}", css.indexOf(`${selector} {`)));
      const literals = [...block(":root, .theme-dark").matchAll(/(--kz-[\w-]+): (?!var\()/g)].map(([, name]) => name);
      expect(literals.length).toBeGreaterThan(0);
      for (const name of literals) expect(block("html.light"), `${id} ${name}`).toContain(`${name}:`);
    }
  });

  it("is the platform's default for krizaka: tokens.css already carries the Krizaka identity", () => {
    for (const mode of ["dark", "light"] as const) {
      for (const role of BRAND_ROLES) expect(index.brands.krizaka[mode][camel(role)], `${mode} ${role}`).toBe(index.values[mode][camel(role)]);
    }
  });

  it("keeps the Orazaka orange", () => {
    expect(native.brands.orazaka.light.accent).toBe("#b45309"); // the deep orange, also the first stop of the mark
    expect(native.brands.orazaka.dark.accent2).toBe("#f59e0b"); // the buttons' gradient closes on amber (not the mark)
  });

  for (const id of BRANDS) {
    for (const mode of ["dark", "light"] as const) {
      it(`${id} ${mode}: WCAG AA — on-accent on accent, hover and accent-2; accent-text on every surface; ring ≥ 3:1; text on the section gradient`, () => {
        const b = index.brands[id][mode];
        const page = index.values[mode];
        const on = parseHsl(b.onAccent);
        for (const fill of [b.accent, b.accentHover, b.accent2]) expect(contrast(on, parseHsl(fill)), fill).toBeGreaterThanOrEqual(4.5);
        for (const s of surfaces) expect(contrast(parseHsl(b.accentText), parseHsl(page[s])), s).toBeGreaterThanOrEqual(4.5);
        for (const s of surfaces) expect(contrast(parseHsl(b.infoText), parseHsl(page[s])), `info-text ${s}`).toBeGreaterThanOrEqual(4.5);
        for (const s of surfaces) expect(contrast(parseHsl(page.textMuted), parseHsl(page[s])), `text-muted ${s}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(parseHsl(b.ring), parseHsl(page.surface0))).toBeGreaterThanOrEqual(3);
        // Text set on a section gradient reads at AA on every stop.
        for (const stop of [b.brandGradientFrom, b.brandGradientVia, b.brandGradientTo]) {
          expect(contrast(parseHsl(page.textPrimary), parseHsl(stop)), stop).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseHsl(page.textSecondary), parseHsl(stop)), stop).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseHsl(page.textMuted), parseHsl(stop)), `muted ${stop}`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseHsl(b.accentText), parseHsl(stop)), stop).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }

  it("ends every brand's section gradient on the page surface (an alias, never a copy)", () => {
    for (const id of BRANDS) {
      expect(files[`brands/${id}.css`], id).toContain("--kz-brand-gradient-to: var(--kz-surface-0);");
      expect(files[`brands/${id}.css`], id).not.toMatch(/--kz-brand-gradient-to: hsl/);
      for (const mode of ["dark", "light"] as const) expect(index.brands[id][mode].brandGradientTo).toBe(index.values[mode].surface0);
    }
    expect(files["brands/scoped.css"]).not.toMatch(/--kz-brand-gradient-to: hsl/);
  });

  describe("marks", () => {
    const hue = (v: string) => Number(/hsl\(([\d.]+)/.exec(v)?.[1]);

    it("gives every brand its mark's gradient, raw and native", () => {
      expect(Object.keys(index.marks)).toEqual(BRANDS);
      expect(Object.keys(native.marks)).toEqual(BRANDS);
      for (const id of BRANDS) {
        expect(index.marks[id].length, id).toBeGreaterThanOrEqual(2);
        expect(native.marks[id].map(([offset]: [string]) => offset)).toEqual(index.marks[id].map(([offset]: [string]) => offset));
        for (const [, color] of native.marks[id]) expect(color, id).toMatch(/^#[0-9a-f]{6}$/);
      }
    });

    it("draws each mark in its brand's colour", () => {
      expect(index.marks.krizaka.map(([, c]: [string, string]) => c)).toEqual([index.brands.krizaka.dark.accent, index.brands.krizaka.dark.accentText]);
      // Orazaka: deep orange (its light accent) → orange, both on the accent's hue 26 — never the amber of --kz-warning.
      expect(index.marks.orazaka[0][1]).toBe(index.brands.orazaka.light.accent);
      for (const [, c] of index.marks.orazaka) {
        expect(hue(c)).toBe(hue(index.brands.orazaka.dark.accent));
        expect(Math.abs(hue(c) - hue(index.values.dark.warning))).toBeGreaterThanOrEqual(10);
      }
    });

    it.each(["orazaka", "yomizaka", "akinaza"])("keeps every stop of the %s mark ≥ 3:1 (a graphic object) on surfaces 0–2, dark and light", (id) => {
      for (const mode of ["dark", "light"] as const) {
        for (const s of ["surface0", "surface1", "surface2"] as const) {
          for (const [, c] of index.marks[id]) expect(contrast(parseHsl(c), parseHsl(index.values[mode][s])), `${mode} ${s} ${c}`).toBeGreaterThanOrEqual(3);
        }
      }
    });

    it("rejects a brand without a mark", () => {
      const { $extensions: _ext, ...bare } = brandSources.orazaka as Record<string, unknown>;
      expect(() => compileBrands(tokens, { x: bare })).toThrow(/mark/);
    });
  });

  it("keeps Yomizaka's indigo apart from the Krizaka blue, every other brand and every status", () => {
    const hsl = (v: string) => /hsl\(([\d.]+) ([\d.]+)%/.exec(v)!.slice(1).map(Number) as [number, number];
    const gap = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    for (const mode of ["dark", "light"] as const) {
      const [accent] = hsl(index.brands.yomizaka[mode].accent);
      // The ink indigo sits at least 20° from the parent's blue.
      expect(gap(accent, hsl(index.brands.krizaka[mode].accent)[0]), `${mode} krizaka`).toBeGreaterThanOrEqual(20);
      for (const other of ["orazaka"] as const) {
        expect(gap(accent, hsl(index.brands[other][mode].accent)[0]), `${mode} ${other}`).toBeGreaterThanOrEqual(60);
      }
      for (const status of ["success", "warning", "danger"] as const) {
        expect(gap(accent, hsl(index.values[mode][status])[0]), `${mode} ${status}`).toBeGreaterThanOrEqual(60);
      }
      expect(index.brands.yomizaka[mode].info).not.toBe(index.brands.yomizaka[mode].accent);
    }
    // Ink (232) → indigo (248): the mark's first stop is accent-2's hue, its last within 10° of the accent.
    const hue = (v: string) => Number(/hsl\(([\d.]+)/.exec(v)?.[1]);
    expect(index.marks.yomizaka.map(([, c]: [string, string]) => hue(c))).toEqual([232, 248]);
    expect(hue(index.brands.yomizaka.dark.accent2)).toBe(232);
    expect(Math.abs(hue(index.marks.yomizaka.at(-1)[1]) - hue(index.brands.yomizaka.dark.accent))).toBeLessThanOrEqual(10);
  });

  it("gives Yomizaka the same roles as every brand, dark, light and native (key parity)", () => {
    for (const mode of ["dark", "light"] as const) {
      expect(Object.keys(index.brands.yomizaka[mode])).toEqual(Object.keys(index.brands.krizaka[mode]));
      expect(Object.keys(native.brands.yomizaka[mode])).toEqual(Object.keys(native.brands.krizaka[mode]));
    }
    expect(files["brands/scoped.css"]).toContain(".brand-yomizaka {");
    expect(files["brands/scoped.css"]).toContain("html.light .brand-yomizaka");
  });

  it("gives Akinaza the forest green, apart from success; a matte copper second, never Orazaka's orange", () => {
    const hsl = (v: string) => /hsl\(([\d.]+) ([\d.]+)%/.exec(v)!.slice(1).map(Number) as [number, number];
    const gap = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    for (const mode of ["dark", "light"] as const) {
      const [green] = hsl(index.brands.akinaza[mode].accent);
      for (const other of ["krizaka", "orazaka", "yomizaka"] as const) {
        expect(gap(green, hsl(index.brands[other][mode].accent)[0]), `${mode} ${other}`).toBeGreaterThanOrEqual(20);
      }
      expect(gap(green, hsl(index.values[mode].success)[0]), `${mode} success`).toBeGreaterThanOrEqual(20);
      // The copper is a matte metal: saturation ≤ 65 %, where Orazaka's orange is ≥ 90 %.
      const [, copperSat] = hsl(index.brands.akinaza[mode].accent2);
      expect(copperSat).toBeLessThanOrEqual(65);
      expect(hsl(index.brands.orazaka[mode].accent)[1]).toBeGreaterThanOrEqual(90);
    }
    const hue = (v: string) => Number(/hsl\(([\d.]+)/.exec(v)?.[1]);
    expect(index.marks.akinaza.map(([, c]: [string, string]) => hue(c))).toEqual([140, 22]);
  });

  it.each(["akinaza"] as const)("gives %s the same roles as every brand, dark, light and native (key parity)", (id) => {
    for (const mode of ["dark", "light"] as const) {
      expect(Object.keys(index.brands[id][mode])).toEqual(Object.keys(index.brands.krizaka[mode]));
      expect(Object.keys(native.brands[id][mode])).toEqual(Object.keys(native.brands.krizaka[mode]));
    }
    expect(files["brands/scoped.css"]).toContain(`.brand-${id} {`);
    expect(files["brands/scoped.css"]).toContain(`html.light .brand-${id}`);
  });

  it("keeps Orazaka's accent apart from the warning status", () => {
    const hue = (v: string) => Number(/hsl\(([\d.]+)/.exec(v)?.[1]);
    expect(Math.abs(hue(index.brands.orazaka.dark.accent) - hue(index.values.dark.warning))).toBeGreaterThanOrEqual(10);
    expect(index.brands.orazaka.dark.info).not.toBe(index.brands.orazaka.dark.accent);
  });

  // krizaka-ui#393, ADR-003: the Krizaka accent is a steel blue, not the saturated electric blue every AI product wears.
  it("gives Krizaka a steel blue: the complement of the Orazaka orange, muted, AA in both themes", () => {
    const hsl3 = (v: string) => /hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%/.exec(v)!.slice(1).map(Number);
    for (const mode of ["dark", "light"] as const) {
      const b = index.brands.krizaka[mode];
      const page = index.values[mode];
      for (const role of ["accent", "accentHover", "accentText", "ring", "info"] as const) {
        const [h, s] = hsl3(b[role]);
        expect(h, `${mode} ${role} hue`).toBeGreaterThanOrEqual(200);
        expect(h, `${mode} ${role} hue`).toBeLessThanOrEqual(212);
        expect(s, `${mode} ${role} saturation`).toBeLessThanOrEqual(60);
      }
      // ~180° from the Orazaka orange (26): the parent frames its products without competing with them.
      expect(Math.abs(hsl3(b.accent)[0] - hsl3(index.brands.orazaka.dark.accent)[0] - 180)).toBeLessThanOrEqual(6);
      // White on the button, at rest and hovered; the focus ring ≥ 3:1 where it is drawn; the accent as text ≥ 4.5:1.
      for (const fill of [b.accent, b.accentHover]) expect(contrast(parseHsl(b.onAccent), parseHsl(fill)), `${mode} ${fill}`).toBeGreaterThanOrEqual(4.5);
      for (const s of surfaces) {
        // The ring sits on the page, a card or a field (surfaces 0–2); surface 3 is a pressed chip, never focused alone.
        if (s !== "surface3") expect(contrast(parseHsl(b.ring), parseHsl(page[s])), `${mode} ring ${s}`).toBeGreaterThanOrEqual(3);
        expect(contrast(parseHsl(b.accentText), parseHsl(page[s])), `${mode} accent-text ${s}`).toBeGreaterThanOrEqual(4.5);
      }
      // The platform default is the Krizaka brand: tokens.css carries the same values.
      expect(page.accent).toBe(b.accent);
    }
    expect(toNative(parseHsl(index.brands.krizaka.dark.accent))).not.toBe("#196df5");
    // A product whose `info` is not its own accent borrows the Krizaka steel, never the old electric blue.
    for (const id of BRANDS)
      for (const mode of ["dark", "light"] as const) {
        const b = index.brands[id][mode];
        if (b.info === b.accent) continue;
        expect(hsl3(b.info)[0], `${id} ${mode} info hue`).toBeLessThanOrEqual(212);
        expect(hsl3(b.info)[1], `${id} ${mode} info saturation`).toBeLessThanOrEqual(60);
      }
  });

  it("rejects a brand that sets a non-brand role, an unknown token or misses a role", () => {
    const one = (tree: Record<string, unknown>) => () => compileBrands(tokens, { x: tree });
    const full = brandSources.krizaka as Record<string, unknown>;
    expect(one({ ...full, "surface-0": { $type: "color", $value: "hsl(0 0% 0%)" } })).toThrow(/not a brand role/);
    expect(one({ ...full, nope: { $type: "color", $value: "hsl(0 0% 0%)" } })).toThrow(/not a platform token/);
    const { info: _info, ...partial } = full;
    expect(one(partial)).toThrow(/missing --kz-info/);
  });
});

describe("ADR-006 (krizaka-ui#669): the new roles leave the Cahier as it is", () => {
  // The product register (data-surface="product") sets the calm values in @krizaka/ui's blocks.css, where its contrast is
  // tested. The tokens carry the Cahier: the four new roles exist and resolve to the Cahier's own look.
  it("adds the four roles in both themes and native, aliased to the values the Cahier already has", () => {
    const dark = css.slice(0, css.indexOf("html.light {"));
    expect(dark).toContain("--kz-border-control: var(--kz-border-strong);");
    expect(dark).toContain("--kz-border-hover: var(--kz-border-strong);");
    expect(dark).toContain("--kz-text-title: var(--kz-text-primary);");
    expect(dark).toMatch(/--kz-shadow-hover: 0 1px 0 /);
    expect(css).toContain("--kz-shadow-hover: 0 1px 0 hsl(212 49% 24%");
  });

  it("keeps the Cahier's ink, hairlines and corners at their ADR-004 values", () => {
    expect(css).toContain("--kz-text-muted: hsl(140 8% 68%);");
    expect(css).toContain("--kz-text-muted: hsl(212 14% 36%);");
    expect(css).toContain("--kz-border-subtle: hsl(110 25% 92% / 0.07);");
    expect(css).toContain("--kz-border-default: hsl(110 25% 92% / 0.12);");
    expect(css).toContain("--kz-radius-lg: 0px;");
    expect(css).toContain("--kz-radius-md: 2px;");
    expect(css).not.toContain("#646d80");
  });

  it("tightens the rows and the density gaps under [data-density=compact]", () => {
    const block = css.slice(css.indexOf('[data-density="compact"] {'));
    for (const [role, normal] of [["control-row", 48], ["density-gap", 16], ["density-pad", 20]] as const) {
      const compact = Number.parseFloat(new RegExp(`--kz-${role}: ([\\d.]+)px`).exec(block)?.[1] ?? "NaN");
      expect(compact, role).toBeLessThan(normal);
      expect(css, role).toContain(`--kz-${role}: ${normal}px;`);
    }
  });
});

describe("tag markers (ADR-006, krizaka-ui#627; @krizaka/organize MARKERS)", () => {
  const names = ["blue", "green", "amber", "red", "violet", "gray"];
  // The Cahier's four surfaces and the product register's three (blocks.css), in both themes.
  const hex = (h: string) => ({ r: Number.parseInt(h.slice(1, 3), 16), g: Number.parseInt(h.slice(3, 5), 16), b: Number.parseInt(h.slice(5, 7), 16), a: 1 });
  const surfacesOf = (mode: "dark" | "light") => [
    ...["--kz-surface-0", "--kz-surface-1", "--kz-surface-2", "--kz-surface-3"].map((n) => parseHsl(color(n, mode))),
    ...(mode === "dark" ? ["#111318", "#171a21", "#1e222b"] : ["#fbfbfa", "#ffffff", "#f4f4f2"]).map(hex),
  ];
  const lab = (c: { r: number; g: number; b: number }) => {
    const lin = (v: number) => ((v / 255) <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
    const [r, g, b] = [lin(c.r), lin(c.g), lin(c.b)];
    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
    const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  const distance = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]!));

  it("declares the six names of the contract, as a dot and as a text role, in both themes", () => {
    for (const name of names) {
      for (const role of [`--kz-tag-${name}`, `--kz-tag-${name}-text`]) {
        expect(dark.has(role), role).toBe(true);
        expect(light.has(role), `${role} (light)`).toBe(true);
      }
    }
    expect([...dark.keys()].filter((n) => n.startsWith("--kz-tag-") && !n.endsWith("-text")).map((n) => n.slice(9))).toEqual(names);
  });

  for (const mode of ["dark", "light"] as const) {
    it(`${mode}: the dot reads at 3:1 and the text at 4.5:1 on the Cahier's and the product register's surfaces`, () => {
      for (const name of names) {
        const dot = parseHsl(color(`--kz-tag-${name}`, mode));
        const text = parseHsl(color(`--kz-tag-${name}-text`, mode));
        for (const bg of surfacesOf(mode)) {
          expect(contrast(dot, bg), `${name} dot`).toBeGreaterThanOrEqual(3);
          expect(contrast(text, bg), `${name} text`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    it(`${mode}: no marker is a status tone or a product's accent (ΔE ≥ 10)`, () => {
      const others = [
        ...["success", "warning", "danger"].map((r) => color(`--kz-${r}`, mode)),
        ...Object.values(brandsIndex).map((b) => b[mode]!.accent!),
      ];
      for (const name of names) {
        const dot = parseHsl(color(`--kz-tag-${name}`, mode));
        for (const other of others) expect(distance(dot, parseHsl(other)), `${name} vs ${other}`).toBeGreaterThanOrEqual(10);
      }
    });
  }

  it("keeps the six markers apart from each other (ΔE ≥ 20): the colour is never the only signal, but it is never a twin", () => {
    for (const mode of ["dark", "light"] as const) {
      const dots = names.map((n) => parseHsl(color(`--kz-tag-${n}`, mode)));
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) expect(distance(dots[i]!, dots[j]!), `${names[i]} vs ${names[j]} (${mode})`).toBeGreaterThanOrEqual(20);
    }
  });
});

describe("Cahier (ADR-004, krizaka-ui#417): the template tells are gone at the source", () => {
  const all = new Map([...dark, ...invariant]);
  /** The layers of a box-shadow value: `x y blur spread color`. */
  const layers = (value: string) => value.split(/,(?![^(]*\))/).map((l) => l.trim());

  it("no shadow blurs: elevation is a solid offset of paper, in both themes", () => {
    const shadows = [...all.keys()].filter((n) => n.startsWith("--kz-shadow-"));
    expect(shadows.length).toBeGreaterThanOrEqual(6);
    for (const mode of [dark, light]) {
      for (const name of shadows) {
        const value = mode.get(name) ?? all.get(name)!;
        for (const layer of layers(value)) expect(layer.split(/\s+/)[2], `${name}: ${layer}`).toBe("0");
      }
    }
  });

  it("a statistic's figures are lining and tabular: one baseline, one width (Young Serif draws old-style by default)", () => {
    expect(all.get("--kz-figures")).toBe("lining-nums tabular-nums");
  });

  it("nothing frosted, nothing glossy: no backdrop blur, no sheen, no light edge", () => {
    expect(invariant.get("--kz-glass-blur") ?? dark.get("--kz-glass-blur")).toBe("0px");
    for (const mode of ["dark", "light"] as const) {
      expect(parseHsl(color("--kz-surface-sheen", mode)).a, mode).toBe(0);
      expect(parseHsl(color("--kz-edge-light", mode)).a, mode).toBe(0);
    }
  });

  it("square paper: cards, dialogs and sheets are 0; controls at most 2 px; only the pill stays round", () => {
    const px = (n: string) => Number.parseFloat(String(all.get(n)));
    for (const step of ["lg", "xl", "2xl"]) expect(px(`--kz-radius-${step}`), step).toBe(0);
    for (const step of ["xs", "sm", "md"]) expect(px(`--kz-radius-${step}`), step).toBeLessThanOrEqual(2);
    expect(px("--kz-radius-full")).toBeGreaterThan(999);
  });

  it("no wash: the section gradient of every brand is the page surface, flat", () => {
    for (const mode of ["dark", "light"] as const) {
      expect(color("--kz-brand-gradient-from", mode)).toBe(color("--kz-surface-0", mode));
      expect(color("--kz-brand-gradient-via", mode)).toBe(color("--kz-surface-0", mode));
    }
    for (const id of BRANDS) {
      for (const mode of ["dark", "light"] as const) {
        const b = brandsIndex[id][mode];
        expect(b.brandGradientFrom, `${id} ${mode}`).toBe(b.brandGradientTo);
        expect(b.brandGradientVia, `${id} ${mode}`).toBe(b.brandGradientTo);
      }
    }
  });

  it("ink on paper (light), chalk on slate (dark): the page is not near-black and the ink is blue", () => {
    const hsl = (v: string) => {
      const [h, s, l] = /^hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%/.exec(v)!.slice(1).map(Number);
      return { h, s, l };
    };
    const slate = hsl(color("--kz-surface-0", "dark"));
    expect(slate.h).toBeGreaterThan(100);
    expect(slate.h).toBeLessThan(180);
    expect(slate.l).toBeGreaterThanOrEqual(9);
    expect(slate.s).toBeGreaterThanOrEqual(8);
    const ink = hsl(color("--kz-text-primary", "light"));
    expect(ink.h).toBeGreaterThan(195);
    expect(ink.h).toBeLessThan(225);
    expect(ink.s).toBeGreaterThanOrEqual(35);
    const paper = hsl(color("--kz-surface-0", "light"));
    expect(paper.l).toBeGreaterThanOrEqual(95);
    // never cream: the paper leans cool (green-grey), not warm.
    expect(paper.h).toBeGreaterThan(60);
    expect(paper.h).toBeLessThan(180);
  });

  it("the ruling and the specimen tag: their roles exist in both themes, the tag's ink reads ≥ 4.5:1", () => {
    for (const role of ["rule-major", "rule-minor", "rule-margin", "tag", "tag-edge", "tag-ink"]) {
      expect(dark.has(`--kz-paper-${role}`), role).toBe(true);
      expect(light.has(`--kz-paper-${role}`), role).toBe(true);
    }
    for (const mode of ["dark", "light"] as const) {
      expect(contrast(parseHsl(color("--kz-paper-tag-ink", mode)), parseHsl(color("--kz-paper-tag", mode))), mode).toBeGreaterThanOrEqual(4.5);
      expect(contrast(parseHsl(color("--kz-paper-rule-margin", mode)), parseHsl(color("--kz-surface-0", mode))), mode).toBeGreaterThanOrEqual(3);
    }
    expect(invariant.get("--kz-paper-module")).toBe("32px");
    expect(invariant.get("--kz-paper-line")).toBe("8px");
  });

  it("the kraft and dot-grid papers (krizaka-ui#600): roles in both themes, body ink ≥ 7:1 on kraft at its darkest and lightest grain point", () => {
    for (const role of ["dot", "kraft", "kraft-ink"]) {
      expect(dark.has(`--kz-paper-${role}`), role).toBe(true);
      expect(light.has(`--kz-paper-${role}`), role).toBe(true);
    }
    const grain = Number(invariant.get("--kz-paper-grain-opacity"));
    expect(grain).toBeGreaterThan(0);
    expect(grain).toBeLessThanOrEqual(0.1);
    for (const mode of ["dark", "light"] as const) {
      const kraft = parseHsl(color("--kz-paper-kraft", mode));
      const ink = parseHsl(color("--kz-paper-kraft-ink", mode));
      // The grain is a black or a white speck at most `grain` strong: the two worst points of the paper.
      const speck = (shade: number) => over({ r: shade, g: shade, b: shade, a: grain }, kraft);
      for (const point of [kraft, speck(0), speck(255)]) expect(contrast(ink, point), mode).toBeGreaterThanOrEqual(7);
    }
  });

  it("the display face has one weight: every display step is 400; the overline is a lower-case note, not tracked caps", () => {
    for (const step of ["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "title-lg"]) {
      expect(invariant.get(`--kz-type-${step}-weight`), step).toBe("400");
    }
    expect(Number.parseFloat(String(invariant.get("--kz-type-overline-tracking")))).toBe(0);
  });

  it("the motion personality is the ink stroke: an ease-in-out, not the overshooting fade-up", () => {
    expect(invariant.get("--kz-ease") ?? dark.get("--kz-ease")).toBe("cubic-bezier(0.45, 0, 0.2, 1)");
  });
});
