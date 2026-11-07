// The theme as a browser resolves it — the @krizaka/tokens platform values, then the Orazaka brand of @krizaka/tokens,
// then theme.css — for the foundations of the registry (palette, both modes, contrasts). Plain stylesheet parsing: the
// files are generated or hand-written with one declaration per line, top-level blocks only.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Top-level `selector { declarations }` blocks of a stylesheet (comments removed, at-rules skipped). */
export function blocks(css) {
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map();
  for (const [, selector, body] of flat.matchAll(/([^{}@;]+)\{([^{}]*)\}/g)) {
    const key = selector.trim().replace(/\s+/g, " ");
    // Only declarations closed by a semicolon count: the text after the last one is dropped.
    const declarations = Object.fromEntries(
      body
        .split(";")
        .slice(0, -1)
        .map((declaration) => declaration.match(/^\s*(--[\w-]+)\s*:(.+)$/s))
        .filter(Boolean)
        .map(([, name, value]) => [name, value.trim()]),
    );
    out.set(key, { ...out.get(key), ...declarations });
  }
  return out;
}

export const read = (specifier) => readFileSync(require.resolve(specifier), "utf8");

/** The value of a custom property, `var(--x)` references followed (a `var()` inside a longer value is kept). */
export function resolve(theme, name) {
  const value = theme[name];
  if (value === undefined) return undefined;
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(theme, ref[1]) : value;
}

/** #rgb, #rrggbb, rgb()/rgba(), hsl()/hsla() → [r, g, b, a] (0..255, alpha 0..1); null for anything else. */
export function rgba(value) {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return parts.length === 3 ? [...parts, 1] : parts;
  }
  const hsl = v.match(/^hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+))?\s*\)$/);
  if (hsl) {
    const [h, s, l] = [Number(hsl[1]), Number(hsl[2]) / 100, Number(hsl[3]) / 100];
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)].map((x) => Math.round(x * 255)).concat(hsl[4] === undefined ? 1 : Number(hsl[4]));
  }
  return null;
}

/** `#rrggbb` of an opaque colour, for display; null when it is translucent or not a colour. */
export function hex(value) {
  const c = value && rgba(value);
  if (!c || c[3] !== 1) return null;
  return `#${c
    .slice(0, 3)
    .map((x) => Math.round(x).toString(16).padStart(2, "0"))
    .join("")}`;
}

function luminance(value) {
  const [r, g, b] = rgba(value)
    .slice(0, 3)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two opaque colours, rounded to two decimals. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/**
 * The pairs every Krizaka theme is held to (the kits' theme tests): text on every surface, text on the accent, the
 * accent as text, the focus ring. `[foreground, background, minimum]`, roles without `--kz-`.
 */
export const PAIRS = [
  ...["surface-0", "surface-1", "surface-2", "surface-3"].flatMap((s) => [
    ["text-primary", s, 4.5],
    ["text-secondary", s, 4.5],
    ["text-muted", s, 3],
    ["accent-text", s, 4.5],
  ]),
  ["on-accent", "accent", 4.5],
  ["on-accent", "accent-hover", 4.5],
  ["on-accent", "accent-2", 4.5],
  ["ring", "surface-0", 3],
];

/** The contrasts of a resolved theme: every pair whose two roles are opaque colours. */
export function contrasts(theme) {
  return PAIRS.flatMap(([fg, bg, min]) => {
    const [f, b] = [resolve(theme, `--kz-${fg}`), resolve(theme, `--kz-${bg}`)];
    if (!hex(f) || !hex(b)) return [];
    return [{ fg, bg, ratio: contrast(f, b), min }];
  });
}
