// krizaka-ui#393 — the hover of the family is quiet: a border or a background tint, a short colour transition, no
// movement, no light that follows the pointer. ADR-006 (#669) amends it for the PRODUCT register only: an interactive card
// (a link or a button) lifts 1 px, through `--kz-card-hover-transform`, which only the register sets. This test reads the shipped stylesheets and the class recipes and refuses
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

/** The one declaration that may sit in a hover: it reads the register's variable (`none` everywhere else). */
const LIFT = /transform:\s*var\(--kz-card-hover-transform,\s*none\);?/;
/** The cards that are a link or a button: the only ones that answer the hand. */
const INTERACTIVE = [".kz-link-card", "a.kz-block-card", "button.kz-block-card", "[data-interactive]"];

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
        if (/(^|[;\s])(transform|translate|scale|rotate)\s*:(?!\s*none)/.test(body.replace(LIFT, ""))) moving.push(`${file}: ${selector}`);
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

  describe("the product register's lift (ADR-006, #669)", () => {
    const blocks = SHEETS.find(([f]) => f === "blocks.css")![1];
    const all = rules(blocks);

    it("reads the lift from --kz-card-hover-transform on interactive cards only, on hover", () => {
      const lifting = all.filter(({ body }) => LIFT.test(body));
      expect(lifting.length).toBeGreaterThan(0);
      for (const { selector } of lifting) {
        const parts = selector.split(",").map((p) => p.trim());
        expect(parts.every((p) => p.endsWith(":hover")), selector).toBe(true);
        expect(parts.map((p) => p.replace(/:hover$/, "")).sort(), selector).toEqual([...INTERACTIVE].sort());
      }
    });

    it("sets the lift once — 1 px — and only in the product register; a static card never moves", () => {
      expect(blocks.match(/--kz-card-hover-transform:\s*translateY\(-1px\)/g)).toHaveLength(1);
      const set = all.find(({ body }) => /--kz-card-hover-transform:/.test(body))!;
      expect(set.selector).toContain('[data-surface="product"]');
      for (const { selector, body } of all)
        if (/^\.kz-block-card:hover|^\.kz-block-card:focus/.test(selector)) expect(body).not.toMatch(/transform|box-shadow/);
    });

    it("takes the lift away under reduced motion (the border and the shadow still answer)", () => {
      const reduced = blocks.slice(blocks.lastIndexOf("@media (prefers-reduced-motion: reduce)", blocks.indexOf("[data-interactive]:hover { transform: none; }")));
      expect(reduced).toContain("[data-interactive]:hover { transform: none; }");
      expect(reduced).toContain("transition: none");
    });
  });
});
