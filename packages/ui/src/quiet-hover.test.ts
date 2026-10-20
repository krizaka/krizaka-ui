// krizaka-ui#393 — the hover of the family is quiet: a border or a background tint, a short colour transition, no
// movement, no light that follows the pointer. This test reads the shipped stylesheets and the class recipes and refuses
// a hover that moves (transform, translate, scale), a pointer-driven light, or a chamfer, so neither comes back.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = import.meta.dirname;
const SHEETS = ["blocks.css", "motion.css", "story.css"].map((f) => [f, readFileSync(join(SRC, f), "utf8")] as const);

/** Every `selector { declarations }` of a stylesheet, flattened out of its @media / @supports blocks. */
function rules(css: string): { selector: string; body: string }[] {
  const out: { selector: string; body: string }[] = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const m of clean.matchAll(re)) out.push({ selector: m[1]!.trim(), body: m[2]! });
  return out;
}

/** What may still move under the pointer: an arrow leaning where it leads, a tooltip sliding in. Never a card or a button. */
const ALLOWED = [/ForwardIcon/, /ExternalIcon/, /-cta svg/, /kz-arg-more:hover svg/, /\[data-tip\]/];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("the quiet hover (krizaka-ui#393)", () => {
  it("never moves an element under the pointer in the shipped stylesheets", () => {
    const moving: string[] = [];
    for (const [file, css] of SHEETS)
      for (const { selector, body } of rules(css)) {
        if (!/:hover/.test(selector) || ALLOWED.some((ok) => ok.test(selector))) continue;
        if (/(^|[;\s])(transform|translate|scale|rotate)\s*:(?!\s*none)/.test(body)) moving.push(`${file}: ${selector}`);
      }
    expect(moving).toEqual([]);
  });

  it("keeps the card a still surface: no lift, no pointer light, a ring on keyboard focus", () => {
    const blocks = SHEETS.find(([f]) => f === "blocks.css")![1];
    const card = rules(blocks).filter(({ selector }) => /\.kz-block-card/.test(selector));
    expect(card.some(({ body }) => /--kz-pointer/.test(body))).toBe(false);
    expect(card.some(({ selector, body }) => /:hover/.test(selector) && /border-color|background/.test(body))).toBe(true);
    expect(card.some(({ selector, body }) => /:focus-visible/.test(selector) && /outline:\s*2px solid var\(--kz-ring/.test(body))).toBe(true);
    const base = card.find(({ selector }) => selector === ".kz-block-card")!;
    expect(base.body).not.toMatch(/transition:[^;]*transform/);
  });

  it("draws no light that follows the pointer anywhere (PointerLight, spotlight, GlowCard's bloom)", () => {
    for (const [file, css] of SHEETS) {
      expect(css, file).not.toMatch(/var\(--kz-pointer-[xy]/);
      expect(css, file).not.toMatch(/var\(--spot-[xy]/);
      expect(css, file).not.toMatch(/var\(--kz-glow-[xy]/);
      expect(css, file).not.toMatch(/var\(--kz-mag-[xy]/);
    }
  });

  it("ships no lift, zoom or chamfer in the class recipes of the components", () => {
    const bad: string[] = [];
    for (const path of sourceFiles(SRC)) {
      const text = readFileSync(path, "utf8");
      for (const m of text.matchAll(/(?:group-)?hover:(?:-?translate-[xy]|scale-)[\w.[\]-]*|corner-shape|kz-lift|kz-spotlight|kz-sheen/g))
        if (!path.includes(`${join("map", "map.tsx")}`)) bad.push(`${path.slice(SRC.length + 1)}: ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
});
