import { readFileSync } from "node:fs";
import { join } from "node:path";

import { accentContrast, compileAppearance, parseColor, readsOn, surfacesOf } from "../scripts/appearance.mjs";
import { compile, compileBrands, load, loadAppearance, loadBrands } from "../scripts/build.mjs";
import { contrast } from "../scripts/color.mjs";

const root = join(import.meta.dirname, "..");
const source = loadAppearance(join(root, "src/appearance"));
const brandSources = loadBrands(join(root, "src/brands"));
const { tokens, files } = compile(load(join(root, "src/tokens")), brandSources, source);
const brands = compileBrands(tokens, brandSources).values as Record<string, { dark: Record<string, string>; light: Record<string, string> }>;
const data = compileAppearance(source, brands);
const css = files["appearance.css"]!;

describe("Appearance (ADR-006 §4, krizaka-ui#657): the themes are data", () => {
  it("offers System, Light and Dark as required, Blueprint and Carbone as optional — and no paper, no brand-named theme", () => {
    expect(data.themes.map((t: { id: string }) => t.id)).toEqual(["system", "light", "dark", "blueprint", "carbone"]);
    expect(data.themes.filter((t: { required?: true }) => t.required).map((t: { id: string }) => t.id)).toEqual(["system", "light", "dark"]);
    const ids = data.themes.map((t: { id: string }) => t.id);
    for (const refused of ["seyes", "kraft", "washi", "akinaza-terracotta", "yomizaka-indigo", "electric", "cyberpunk", "solarized", "sovereign"]) expect(ids).not.toContain(refused);
    expect(data.densities).toEqual(["standard", "compact"]);
  });

  it("draws every miniature from the colours of its theme (none for System: it follows the device)", () => {
    expect(data.themes[0].preview).toBeNull();
    for (const theme of data.themes.slice(1)) {
      for (const key of ["surface0", "surface1", "surface2", "text", "muted"]) expect(theme.preview[key], `${theme.id} ${key}`).toBeTruthy();
    }
  });

  for (const [name, set] of Object.entries<Record<string, string>>(source.sets)) {
    it(`${name}: text reads ≥ 4.5:1 on surfaces 0–3, the title ≥ 7:1, the edge of a field ≥ 3:1 on 0–2`, () => {
      const surfaces = ["surface-0", "surface-1", "surface-2", "surface-3"].map((k) => parseColor(set[k]!));
      for (const role of ["text-primary", "text-secondary", "text-muted"]) {
        for (const bg of surfaces) expect(contrast(parseColor(set[role]!), bg), `${role} on ${set["surface-0"]}`).toBeGreaterThanOrEqual(4.5);
      }
      for (const bg of surfaces) expect(contrast(parseColor(set["text-title"]!), bg)).toBeGreaterThanOrEqual(7);
      for (const bg of surfaces.slice(0, 3)) expect(contrast(parseColor(set["border-control"]!), bg)).toBeGreaterThanOrEqual(3);
    });
    it(`${name}: rises in luminance from surface 0 to surface 3, and is dark only`, () => {
      const l = ["surface-0", "surface-1", "surface-2", "surface-3"].map((k) => contrast(parseColor(set[k]!), { r: 0, g: 0, b: 0, a: 1 }));
      expect([...l].sort((a, b) => a - b)).toEqual(l);
      expect(css).toContain(`html.theme-${name}:not(.light)`);
      expect(css).not.toContain(`html.light.theme-${name}`);
    });
  }

  it("tests every combination: an accent is offered on a theme only when text ≥ 4.5:1, the fill ≥ 3:1 and its label ≥ 4.5:1", () => {
    for (const [id, family] of Object.entries(brands)) {
      for (const theme of source.themes.filter((t: { base: string }) => t.base !== "system")) {
        const { mode, surfaces } = surfacesOf(source, theme);
        const c = accentContrast(family[mode as "dark" | "light"], surfaces);
        const passes = data.passes[id].includes(theme.id);
        expect(passes, `${id} on ${theme.id}: text ${c.text.toFixed(1)} fill ${c.fill.toFixed(1)} label ${c.label.toFixed(1)}`).toBe(readsOn(c));
        if (passes) {
          expect(c.text).toBeGreaterThanOrEqual(4.5);
          expect(c.fill).toBeGreaterThanOrEqual(3);
          expect(c.label).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("every accent but Orochia's and Kachizaka's own gaps reads on all four surface sets; the two are named, not hidden", () => {
    const full = ["light", "dark", "blueprint", "carbone"];
    const partial = Object.entries<string[]>(data.passes).filter(([, themes]) => themes.length < full.length).map(([id]) => id);
    expect(partial.sort()).toEqual(["kachizaka", "orochia"]);
    expect(data.passes.kachizaka).toEqual(["dark", "blueprint", "carbone"]);
    expect(data.passes.orochia).toEqual(["light"]);
  });

  it("Carbone's green keeps a dark label on the accent: white on it is 2.3:1 and would fail", () => {
    const akinaza = brands.akinaza!.dark;
    const green = parseColor(akinaza.accent!);
    expect(contrast(parseColor("hsl(0 0% 100%)"), green)).toBeLessThan(4.5);
    expect(contrast(parseColor(akinaza.onAccent!), green)).toBeGreaterThanOrEqual(4.5);
  });

  it("writes the CSS of the choices: both sets, and an accent rule per brand and theme, outranking the product register", () => {
    expect(css.split("\n")[0]).toContain("GÉNÉRÉ");
    for (const id of Object.keys(brands)) {
      expect(css).toContain(`html[data-accent="${id}"]:not(.light) {`);
      expect(css).toContain(`html.light[data-accent="${id}"] {`);
    }
    expect(css).toContain("--kz-surface-0: hsl(222 40% 9%);");
    expect(css).toContain("--kz-surface-0: hsl(0 0% 5.5%);");
  });

  it("is exported as a CSS file and as data on both platforms", () => {
    expect(files["index.js"]).toContain("export const appearance");
    expect(files["index.d.ts"]).toContain("AppearanceThemeId");
    expect(files["native.js"]).toContain("export const appearance");
    expect(files["native.d.ts"]).toContain("AppearanceAccent");
    expect(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).exports["./appearance.css"]).toBe("./dist/appearance.css");
  });
});
