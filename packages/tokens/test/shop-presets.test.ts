/* eslint-disable @typescript-eslint/no-explicit-any -- the presets are read as plain JSON: their shape is the script's validation */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parseColor } from "../scripts/appearance.mjs";
import { compile, compileBrands, load, loadAppearance, loadBrands, loadShopPresets } from "../scripts/build.mjs";
import { contrast, over } from "../scripts/color.mjs";
import { accentFamily, compileShopPresets, SHOP_ACCENT_BRANDS, SHOP_TRADES, YOUNG_SERIF } from "../scripts/shop-presets.mjs";

const root = join(import.meta.dirname, "..");
const appearance = loadAppearance(join(root, "src/appearance"));
const brandSources = loadBrands(join(root, "src/brands"));
const sources = loadShopPresets(join(root, "src/presets/shop")) as any[];
const { tokens, files } = compile(load(join(root, "src/tokens")), brandSources, appearance, sources);
const brands = compileBrands(tokens, brandSources).values as Record<string, { dark: Record<string, string>; light: Record<string, string> }>;
const { css, data } = compileShopPresets(sources, brands);
const modes = ["dark", "light"] as const;
const token = (name: string, mode: "dark" | "light") => {
  const t = (tokens as any[]).find((x) => x.name === name)!;
  return String(mode === "light" ? (t.light ?? t.dark) : t.dark);
};

describe("Shop look presets (ADR-007 §4, krizaka-ui#745)", () => {
  it("has twelve presets, two per trade, and no café, restaurant or bar", () => {
    expect(data).toHaveLength(12);
    for (const trade of SHOP_TRADES) expect(data.filter((p: any) => p.trades[0] === trade).map((p: any) => p.name).length, trade).toBe(2);
    expect(data.map((p: any) => p.id)).toEqual([
      "cleaning-forfait", "cleaning-net", "coaching-approche", "coaching-studio", "consulting-bureau", "consulting-cabinet",
      "pets-canal", "pets-carnet", "salon-atelier", "salon-vitrine", "workshop-atelier", "workshop-etabli",
    ]);
    expect(JSON.stringify(data)).not.toMatch(/caf[eé]|restaurant|\bbar\b/i);
    expect(files["shop-presets.css"]).toBe(css);
  });

  it("names only tokens: a raw colour in a source is refused", () => {
    for (const file of readdirSync(join(root, "src/presets/shop"))) {
      expect(readFileSync(join(root, "src/presets/shop", file), "utf8"), file).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(/i);
    }
    const bad = { ...sources[0], photo: { grade: "none", grain: 0, radius: "none", tint: "#ff0000" } };
    expect(() => compileShopPresets([bad, ...sources.slice(1)], brands)).toThrow();
    expect(() => compileShopPresets([{ ...sources[0], accent: "hsl(10 10% 10%)", accents: ["hsl(10 10% 10%)"] }, ...sources.slice(1)], brands)).toThrow(/raw colour/);
  });

  it("refuses an unknown key, a paused brand's accent, an accent missing from its list, a third preset in a trade", () => {
    expect(() => compileShopPresets([{ ...sources[0], extra: 1 }, ...sources.slice(1)], brands)).toThrow(/unknown key/);
    expect(() => compileShopPresets([{ ...sources[0], accent: "yasakia", accents: ["yasakia"] }, ...sources.slice(1)], brands)).toThrow(/live brand/);
    expect(() => compileShopPresets([{ ...sources[0], accents: ["krizaka"] }, ...sources.slice(1)], brands)).toThrow(/accents lists/);
    expect(() => compileShopPresets([...sources, { ...sources[0], id: "cleaning-extra" }], brands)).toThrow(/two presets/);
  });

  it("applies each preset under its own selector in both modes, with the Young Serif of the tokens", () => {
    for (const p of data as any[]) {
      expect(css).toContain(`[data-shop-preset="${p.id}"] {`);
      expect(css).toContain(`html.light [data-shop-preset="${p.id}"]`);
    }
    expect(YOUNG_SERIF).toBe(/--kz-font-display: ([^;]+);/.exec(files["tokens.css"]!)![1]!.replace(/ \/\*.*$/, ""));
  });

  for (const preset of sources) {
    for (const mode of modes) {
      const surfaces = (() => {
        const base = appearance.base[mode] as Record<string, string>;
        return ["surface-0", "surface-1", "surface-2"].map((k) => parseColor(base[k]));
      })();
      for (const ref of preset.accents as string[]) {
        it(`${preset.id} · ${mode} · ${ref}: text ≥ 4.5:1, the accent's text ≥ 4.5:1, its label ≥ 4.5:1, its fill ≥ 3:1 — on surfaces 0–2`, () => {
          const base = appearance.base[mode] as Record<string, string>;
          const f = accentFamily(brands, ref, mode);
          for (const bg of surfaces) {
            expect(contrast(parseColor(base["text-primary"]!), bg), "body").toBeGreaterThanOrEqual(4.5);
            expect(contrast(parseColor(base["text-secondary"]!), bg), "small text").toBeGreaterThanOrEqual(4.5);
            expect(contrast(parseColor(f.accentText), bg), "accent text").toBeGreaterThanOrEqual(4.5);
            expect(contrast(parseColor(f.accent), bg), "accent fill").toBeGreaterThanOrEqual(3);
            expect(contrast(parseColor(f.ring), bg), "focus ring").toBeGreaterThanOrEqual(3);
          }
          expect(contrast(parseColor(f.onAccent), parseColor(f.accent)), "label on the accent").toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(f.onAccent), parseColor(f.accentHover)), "label on the hover").toBeGreaterThanOrEqual(4.5);
        });

        it(`${preset.id} · ${mode} · ${ref}: the hue and the ink read on the preset's paper (${preset.paper})`, () => {
          const base = appearance.base[mode] as Record<string, string>;
          const f = accentFamily(brands, ref, mode);
          const accent = parseColor(f.accent);
          const paper =
            preset.paper === "kraft"
              ? { bg: parseColor(token("paper-kraft", mode)), ink: parseColor(token("paper-kraft-ink", mode)) }
              : preset.paper === "washi"
                ? { bg: over({ ...accent, a: 0.06 }, parseColor(base["surface-0"]!)), ink: parseColor(base["text-primary"]!) }
                : { bg: parseColor(base["surface-0"]!), ink: parseColor(base["text-primary"]!) };
          expect(contrast(paper.ink, paper.bg), "ink on paper").toBeGreaterThanOrEqual(7);
          expect(contrast(accent, paper.bg), "the hue on paper").toBeGreaterThanOrEqual(3);
          expect(contrast(parseColor(f.accentText), paper.bg), "accent text on paper").toBeGreaterThanOrEqual(3);
        });
      }
    }
  }

  it("lists only accents of live brands", () => {
    for (const p of sources) for (const a of p.accents) expect(SHOP_ACCENT_BRANDS).toContain(a.split(":")[0]);
  });
});
