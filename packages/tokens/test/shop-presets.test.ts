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
  it("has twelve trade presets, two per trade, and no café, restaurant or bar", () => {
    const trade = data.filter((p: any) => !p.id.startsWith("look-"));
    expect(trade).toHaveLength(12);
    for (const t of SHOP_TRADES) expect(trade.filter((p: any) => p.trades[0] === t).map((p: any) => p.name).length, t).toBe(2);
    expect(trade.map((p: any) => p.id)).toEqual([
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
    expect(() => compileShopPresets([...sources, { ...sources.find((x) => !x.id.startsWith("look-")), id: "cleaning-extra" }], brands)).toThrow(/two presets/);
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

const looks = sources.filter((p) => p.id.startsWith("look-"));
const dataOf = (id: string) => (data as any[]).find((p) => p.id === id);

describe("The six looks (akinaza#478, ADR-004 addendum §3)", () => {
  it("are six, trade-agnostic, and each names a surface, a motion, mascots and a variant for every section it styles", () => {
    expect(looks.map((p) => p.id)).toEqual(["look-affiche", "look-boutique", "look-cahier", "look-editorial", "look-krizaka", "look-nuit"]);
    for (const p of looks) {
      expect(p.trades, p.id).toEqual(SHOP_TRADES);
      for (const k of ["hero", "services", "booking", "gallery", "video", "reviews", "bulletin", "visit"]) expect(p.variants[k], `${p.id}.${k}`).toBeTruthy();
      expect(dataOf(p.id).surface).toBe(p.surface);
    }
    expect(looks.filter((p) => p.mascots === "on").map((p) => p.id)).toEqual(["look-krizaka"]);
    expect(new Set(looks.map((p) => p.variants.hero + p.variants.services + p.variants.gallery + p.motion)).size, "no look is a colour swap of another").toBe(6);
  });

  it("emit the new keys: surface per mode, the poster face, the polaroid frame", () => {
    expect(css).toMatch(/\[data-shop-preset="look-affiche"\] \{[^}]*--kz-shop-title-weight: 800;[^}]*--kz-shop-title-tracking: -0\.03em;/);
    expect(css).toMatch(/\[data-shop-preset="look-cahier"\] \{[^}]*--kz-shop-photo-frame: 0 0 0 6px/);
    expect(css).toMatch(/html\.light \[data-shop-preset="look-nuit"\][^{]*\{\s*--kz-shop-surface: color-mix\(in oklab, var\(--kz-accent\) 6%, var\(--kz-surface-2\)\)/);
    expect(css).toMatch(/\[data-shop-preset="look-nuit"\] \{[^}]*--kz-shop-surface: var\(--kz-surface-0\);/);
    expect(css).toMatch(/\[data-shop-preset="look-affiche"\] \{[^}]*--kz-shop-rule: var\(--kz-border-strong\);/);
  });

  it("stay within a size budget: 3.5 kB of CSS per look (two accents, both modes), and no new font", () => {
    for (const p of looks) {
      const own = css.split("\n/* ").filter((b) => b.startsWith(`${p.id} `)).join("");
      expect(own.length, p.id).toBeLessThan(3500);
    }
    expect(css).not.toMatch(/@font-face/);
  });

  it("refuse a trade preset wearing a look's key, a look missing one, an unknown surface or motion", () => {
    const trade = sources.find((x) => !x.id.startsWith("look-"));
    expect(() => compileShopPresets([{ ...trade, motion: "soft" }, ...sources.filter((x) => x !== trade)], brands)).toThrow(/unknown key/);
    const l = looks[0];
    const rest = sources.filter((x) => x !== l);
    const { motion: _m, ...noMotion } = l;
    expect(() => compileShopPresets([noMotion, ...rest], brands)).toThrow(/missing "motion"/);
    expect(() => compileShopPresets([{ ...l, surface: "neon" }, ...rest], brands)).toThrow(/surface/);
    expect(() => compileShopPresets([{ ...l, motion: "wild" }, ...rest], brands)).toThrow(/motion/);
    expect(() => compileShopPresets([{ ...l, trades: ["salon"] }, ...rest], brands)).toThrow(/trade-agnostic/);
    expect(() => compileShopPresets([{ ...trade, faces: { title: "poster", note: "mono" } }, ...sources.filter((x) => x !== trade)], brands)).toThrow(/faces/);
  });

  for (const look of looks) {
    for (const mode of modes) {
      for (const ref of look.accents as string[]) {
        it(`${look.id} · ${mode} · ${ref}: AA on the look's surface — ink ≥ 7:1, accent text ≥ 4.5:1, label ≥ 4.5:1, fill and borders ≥ 3:1`, () => {
          const base = appearance.base[mode] as Record<string, string>;
          const f = accentFamily(brands, ref, mode);
          const accent = parseColor(f.accent);
          const s0 = parseColor(base["surface-0"]!);
          const s1 = parseColor(base["surface-1"]!);
          const s2 = parseColor(base["surface-2"]!);
          const kind = look.surface === "deep" ? (mode === "dark" ? "paper" : "dusk") : look.surface;
          const pages = {
            paper: [s0, s1],
            ink: [s1, s2],
            contrast: [s0, s0],
            // `color-mix(in oklab…)` is read here as the sRGB mix: the margins below are wide enough for the difference.
            warm: [over({ ...accent, a: 0.06 }, s0), s1],
            dusk: [over({ ...accent, a: 0.06 }, s2), over({ ...accent, a: 0.03 }, s2)],
          }[kind as "paper"]!;
          for (const bg of pages) {
            expect(contrast(parseColor(base["text-primary"]!), bg), "ink").toBeGreaterThanOrEqual(7);
            expect(contrast(parseColor(base["text-secondary"]!), bg), "small text").toBeGreaterThanOrEqual(4.5);
            expect(contrast(parseColor(f.accentText), bg), "accent text").toBeGreaterThanOrEqual(4.5);
            expect(contrast(accent, bg), "accent fill").toBeGreaterThanOrEqual(3);
            expect(contrast(parseColor(f.ring), bg), "focus ring").toBeGreaterThanOrEqual(3);
            expect(contrast(parseColor(mode === "dark" ? "#646d7e" : "#7d8799") /* --kz-border-control of blocks.css */, bg), "control border").toBeGreaterThanOrEqual(3);
          }
          expect(contrast(parseColor(f.onAccent), accent), "label on the accent").toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(f.onAccent), parseColor(f.accentHover)), "label on the hover").toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  }
});
