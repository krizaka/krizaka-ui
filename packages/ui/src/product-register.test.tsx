// krizaka-ui#669, ADR-006 §3 — the product register: the values are the ADR's, the contrast is a test, and the Cahier sites
// never inherit any of it. The register lives in blocks.css (one `light-dark()` rule for both themes); this test reads it
// from the stylesheet itself and measures it, per theme and per brand.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";

import { CardRoot } from "./card/card";

const css = readFileSync(join(import.meta.dirname, "blocks.css"), "utf8");
const brandsDir = join(import.meta.dirname, "..", "..", "tokens", "src", "brands");
const products = readdirSync(brandsDir)
  .map((file) => file.replace(".brand.json", ""))
  .filter((id) => id !== "krizaka");

type Rgba = { r: number; g: number; b: number; a: number };
type Mode = "light" | "dark";
const MODES: Mode[] = ["light", "dark"];

/** `#rrggbb`, `rgb(r g b / a)` or `hsl(h s% l% / a)`. */
function parse(value: string): Rgba {
  const v = value.trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(v);
  if (hex) return { r: parseInt(hex[1]!.slice(0, 2), 16), g: parseInt(hex[1]!.slice(2, 4), 16), b: parseInt(hex[1]!.slice(4, 6), 16), a: 1 };
  const rgb = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)$/.exec(v);
  if (rgb) return { r: +rgb[1]!, g: +rgb[2]!, b: +rgb[3]!, a: rgb[4] === undefined ? 1 : +rgb[4] };
  const hsl = /^hsl\(\s*(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)$/.exec(v);
  if (hsl) {
    const h = ((+hsl[1]! % 360) + 360) % 360, s = +hsl[2]! / 100, l = +hsl[3]! / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round((l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    };
    return { r: f(0), g: f(8), b: f(4), a: hsl[4] === undefined ? 1 : +hsl[4] };
  }
  throw new Error(`not a colour: ${value}`);
}
const lum = (c: Rgba) => {
  const lin = (n: number) => ((n /= 255) <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
};
const over = (top: Rgba, bottom: Rgba): Rgba => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});
const ratio = (fg: Rgba, bg: Rgba) => {
  const a = lum(fg.a < 1 ? over(fg, bg) : fg), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** The declarations of the register's token rule (the first rule that sets the surfaces for a product root). */
const registerRule = (() => {
  const m = /\n(:is\(\[data-surface="product"\][^{]*)\{([^}]*--kz-surface-0[^}]*)\}/.exec(css);
  if (!m) throw new Error("no product register rule in blocks.css");
  return { selector: m[1]!, body: m[2]! };
})();
const decl = (name: string): string => {
  const m = new RegExp(`${name}:\\s*([^;]+);`).exec(registerRule.body.replace(/\/\*[\s\S]*?\*\//g, ""));
  if (!m) throw new Error(`the register does not set ${name}`);
  return m[1]!.trim();
};
/** The value of a role in a theme: `light-dark(a, b)` → a or b. */
function role(name: string, mode: Mode): string {
  const v = decl(name);
  const m = /^light-dark\((.*)\)$/.exec(v);
  if (!m) return v;
  const parts: string[] = [];
  let depth = 0, cur = "";
  for (const ch of m[1]!) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; } else cur += ch;
  }
  parts.push(cur.trim());
  return mode === "light" ? parts[0]! : parts[1]!;
}
const color = (name: string, mode: Mode) => parse(role(name, mode));
const SURFACES = ["--kz-surface-0", "--kz-surface-1", "--kz-surface-2"] as const;

describe("the product register (ADR-006 §3): the values", () => {
  it("is the ADR's ink, in both themes", () => {
    const expected: Record<string, [string, string]> = {
      "--kz-surface-0": ["#fbfbfa", "#111318"],
      "--kz-surface-1": ["#ffffff", "#171a21"],
      "--kz-surface-2": ["#f4f4f2", "#1e222b"],
      "--kz-text-title": ["#222a3a", "#f3f5f9"],
      "--kz-text-primary": ["#242c3d", "#e8ebf1"],
      "--kz-text-secondary": ["#576275", "#a9b1bf"],
      "--kz-text-muted": ["#646d80", "#959eae"],
      "--kz-border-control": ["#7d8799", "#646d7e"],
    };
    for (const [name, [light, dark]] of Object.entries(expected)) {
      expect(role(name, "light"), name).toBe(light);
      expect(role(name, "dark"), name).toBe(dark);
    }
  });

  it("refuses the mockup's muted ink (#8c96a8, 2.9:1)", () => {
    expect(registerRule.body.toLowerCase()).not.toContain("#8c96a8");
  });

  it("draws the hairlines translucent: 4 % and 8 % of the ink in light, of white in dark", () => {
    expect(role("--kz-border-subtle", "light")).toBe("rgb(28 40 65 / 0.04)");
    expect(role("--kz-border-default", "light")).toBe("rgb(28 40 65 / 0.08)");
    expect(role("--kz-border-subtle", "dark")).toBe("rgb(255 255 255 / 0.04)");
    expect(role("--kz-border-default", "dark")).toBe("rgb(255 255 255 / 0.08)");
  });

  it("has the radius roles of the cards (14) and of the controls (4 / 8 / 8), and leaves the pill alone", () => {
    expect(["xs", "sm", "md", "lg", "xl", "2xl"].map((s) => decl(`--kz-radius-${s}`))).toEqual(["4px", "8px", "8px", "14px", "14px", "14px"]);
    expect(registerRule.body).not.toContain("--kz-radius-full");
  });

  it("sets the hover border at 22 % (light) / 30 % (dark) of the brand accent and the soft shadow", () => {
    expect(role("--kz-border-hover", "light")).toBe("color-mix(in srgb, var(--kz-accent) 22%, transparent)");
    expect(role("--kz-border-hover", "dark")).toBe("color-mix(in srgb, var(--kz-accent) 30%, transparent)");
    expect(decl("--kz-shadow-hover")).toBe("0 10px 25px -5px light-dark(rgb(0 0 0 / 0.04), rgb(0 0 0 / 0.5))");
  });

  it("gives the page title and the statistic's value 700 in the title ink", () => {
    expect(css).toMatch(/\.kz-page-title, \.kz-stat-value\) \{ font-weight: 700; color: var\(--kz-text-title\); \}/);
  });
});

describe("the product register: contrast (WCAG 2.x)", () => {
  it.each(MODES)("%s: text roles ≥ 4.5:1 on surfaces 0–2, and the muted ink on surface 3 too", (mode) => {
    const floors: Record<string, number> = { "--kz-text-title": 13, "--kz-text-primary": 12, "--kz-text-secondary": 5.5, "--kz-text-muted": 4.5 };
    for (const [text, floor] of Object.entries(floors))
      for (const surface of SURFACES) expect(ratio(color(text, mode), color(surface, mode)), `${mode} ${text} on ${surface}`).toBeGreaterThanOrEqual(floor);
    expect(ratio(color("--kz-text-muted", mode), color("--kz-surface-3", mode))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(MODES)("%s: the control border ≥ 3:1 on surfaces 0–2 (WCAG 1.4.11), where a hairline is never an edge", (mode) => {
    for (const surface of SURFACES) {
      expect(ratio(color("--kz-border-control", mode), color(surface, mode)), `${mode} on ${surface}`).toBeGreaterThanOrEqual(3);
      expect(ratio(color("--kz-border-default", mode), color(surface, mode)), `hairline ${mode} on ${surface}`).toBeLessThan(1.3);
    }
  });

  describe.each(products)("%s", (id) => {
    type Themed = { $value: string; $extensions?: { "com.krizaka"?: { light?: string } } };
    const brand = JSON.parse(readFileSync(join(brandsDir, `${id}.brand.json`), "utf8")) as { accent: { $root: Themed; text: Themed }; ring: Themed };
    /** A brand role in a theme; the ring aliases the accent in most brands. */
    const themed = (t: Themed, mode: Mode) => {
      const value = t.$value === "{accent.$root}" ? brand.accent.$root : t;
      return parse(mode === "light" ? (value.$extensions?.["com.krizaka"]?.light ?? value.$value) : value.$value);
    };
    it.each(MODES)("%s: accent text ≥ 4.5:1 and the ring ≥ 3:1 on surfaces 0–2", (mode) => {
      const text = themed(brand.accent.text, mode);
      const ring = themed(brand.ring, mode);
      for (const surface of SURFACES) {
        expect(ratio(text, color(surface, mode)), `${id} ${mode} accent-text on ${surface}`).toBeGreaterThanOrEqual(4.5);
        expect(ratio(ring, color(surface, mode)), `${id} ${mode} ring on ${surface}`).toBeGreaterThanOrEqual(3);
      }
    });
  });
});

describe("the product register: where it applies", () => {
  const roots = registerRule.selector;

  it("is a product's root: data-surface=product, or its brand class on <html> / <body>", () => {
    expect(roots).toContain('[data-surface="product"]');
    for (const id of products) {
      expect(roots, id).toContain(`.brand-${id}`);
      expect(roots, id).toMatch(new RegExp(`:root:is\\([^)]*\\.brand-${id}`));
      expect(roots, id).toMatch(new RegExp(`body:is\\([^)]*\\.brand-${id}`));
    }
  });

  it("is never the Cahier sites' (the krizaka brand, a bare .brand-<id> wrapper inside a page)", () => {
    expect(roots).not.toContain(".brand-krizaka");
    // every `.brand-<id>` in the selector is introduced by :root:is( or body:is( — none stands alone
    const alone = roots.replace(/(:root|body):is\([^)]*\)/g, "");
    expect(alone).not.toMatch(/\.brand-/);
  });

  it("is a rule of blocks.css only: the Cahier tokens (tokens.css) keep their own values (guarded by the tokens' tests)", () => {
    const tokensCss = readFileSync(join(import.meta.dirname, "..", "..", "tokens", "src", "tokens", "radius.tokens.json"), "utf8");
    expect(JSON.parse(tokensCss).radius.lg.$value).toBe("0px");
    expect(JSON.parse(tokensCss).radius.sm.$value).toBe("2px");
  });

  it("reads the card radius and the hover from --kz-card-*, which only the register sets", () => {
    expect(registerRule.body).toContain("--kz-card-radius: var(--kz-radius-lg)");
    expect(css.match(/--kz-card-radius:/g)?.length).toBe(1);
    expect(css.match(/--kz-card-hover-transform:\s*translateY\(-1px\)/g)?.length).toBe(1);
    expect(css.match(/--kz-card-hover-shadow:/g)?.length).toBe(1);
  });

  it("marks an interactive card for the hover, and a static card not at all", () => {
    expect(renderToStaticMarkup(<CardRoot interactive />)).toContain("data-interactive");
    expect(renderToStaticMarkup(<CardRoot />)).not.toContain("data-interactive");
  });
});
