import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { BRAND_ROLES, BRANDS, camel, compile, compileBrands, flatten, load, loadBrands, write } from "../scripts/build.mjs";
import { contrast, parseHsl, toNative } from "../scripts/color.mjs";

const sources = load(join(import.meta.dirname, "../src/tokens"));
const brandSources = loadBrands(join(import.meta.dirname, "../src/brands"));
const { files, tokens } = compile(sources, brandSources);
const css = files["tokens.css"];

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
      it(`${mode}: text-primary and text-secondary ≥ 4.5:1, text-muted ≥ 3:1 on ${bg}`, () => {
        expect(ratio("--kz-text-primary", bg, mode)).toBeGreaterThanOrEqual(4.5);
        expect(ratio("--kz-text-secondary", bg, mode)).toBeGreaterThanOrEqual(4.5);
        expect(ratio("--kz-text-muted", bg, mode)).toBeGreaterThanOrEqual(3);
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
    expect(index.values.light.radiusMd).toBe("12px");
    expect(index.values.dark.ring).toBe(dark.get("--kz-accent"));
    expect(index.values.light.ring).toBe(light.get("--kz-accent"));
    expect(Object.keys(index.values.light)).toEqual(Object.keys(index.tokens));
  });

  it("native: the same colour roles as tokens.css, in both themes", () => {
    const colorRoles = tokens.filter((t) => t.type === "color").map((t) => camel(t.name));
    const cssColorRoles = allNames
      .filter((n) => !/^--kz-(radius|shadow|font|ease)/.test(n))
      .map((n) => camel(n.slice("--kz-".length)));
    expect(Object.keys(native.themes.dark).sort()).toEqual(cssColorRoles.sort());
    expect(Object.keys(native.themes.dark).sort()).toEqual(colorRoles.sort());
    expect(Object.keys(native.themes.light)).toEqual(Object.keys(native.themes.dark));
  });

  it("native: radius and typography mirror their CSS tokens", () => {
    const keysOf = (prefix: string) =>
      allNames.filter((n) => n.startsWith(`--kz-${prefix}-`)).map((n) => camel(n.slice(`--kz-${prefix}-`.length))).sort();
    expect(Object.keys(native.radius).sort()).toEqual(keysOf("radius"));
    expect(Object.keys(native.typography).sort()).toEqual(keysOf("font"));
    expect(native.radius).toEqual({ sm: 8, md: 12, lg: 16, xl: 20, full: 9999 });
    expect(native.typography).toEqual({ sans: "Inter", display: "Inter", mono: "JetBrains Mono" });
    expect(native.motion.ease).toEqual([0.16, 1, 0.3, 1]);
  });

  it("native: resolved hex and rgba values", () => {
    for (const theme of [native.themes.dark, native.themes.light]) {
      for (const v of Object.values(theme)) expect(v).toMatch(/^(#[0-9a-f]{6}|rgba\(\d+,\d+,\d+,[\d.]+\))$/);
    }
    expect(native.themes.dark.surface0).toBe("#0c0c0e");
    expect(native.themes.light.surface1).toBe("#ffffff");
    expect(native.themes.dark.scrim).toBe("rgba(0,0,0,0.6)");
    expect(native.themes.light.scrim).toBe("rgba(0,0,0,0.6)");
    expect(native.themes.dark.ring).toBe(native.themes.dark.accent);
    expect(native.themes.light.ring).toBe(native.themes.light.accent);
  });

  it("type declarations name every export", () => {
    for (const name of ["tokens", "values", "TokenName"]) expect(files["index.d.ts"]).toContain(name);
    for (const name of ["themes", "radius", "typography", "motion", "Theme"]) expect(files["native.d.ts"]).toContain(name);
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
    expect(BRANDS).toEqual(["krizaka", "orazaka", "orochia"]);
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

  it("takes the Orazaka orange from its mark and keeps the Orochia values of its design system", () => {
    expect(native.brands.orazaka.light.accent).toBe("#b45309"); // the deep stop of the Orazaka mark
    expect(native.brands.orazaka.dark.accent2).toBe("#f59e0b"); // its light stop
    expect(native.brands.orochia.dark.accent).toBe("#7c3aed");
    expect(native.brands.orochia.light.accent2).toBe("#db2777");
    expect(native.brands.orochia.dark.ring).toBe("#a78bfa");
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
        expect(contrast(parseHsl(b.ring), parseHsl(page.surface0))).toBeGreaterThanOrEqual(3);
        // Text set on a section gradient reads at AA on every stop.
        for (const stop of [b.brandGradientFrom, b.brandGradientVia, b.brandGradientTo]) {
          expect(contrast(parseHsl(page.textPrimary), parseHsl(stop)), stop).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseHsl(page.textSecondary), parseHsl(stop)), stop).toBeGreaterThanOrEqual(4.5);
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

  it("keeps Orazaka's accent apart from the warning status", () => {
    const hue = (v: string) => Number(/hsl\(([\d.]+)/.exec(v)?.[1]);
    expect(Math.abs(hue(index.brands.orazaka.dark.accent) - hue(index.values.dark.warning))).toBeGreaterThanOrEqual(10);
    expect(index.brands.orazaka.dark.info).not.toBe(index.brands.orazaka.dark.accent);
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
