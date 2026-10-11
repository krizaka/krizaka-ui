// The data palettes. One categorical set of eight hues, stepped for each theme (the dark steps are chosen for the
// dark surface, not flipped), ordered per brand so that the first series wears the brand's own hue — Krizaka blue,
// Orazaka orange, Orochia violet then magenta, its gradient. Every order was chosen among the ones that pass the
// colour-vision checks (scripts/palette.test: lightness band, chroma floor, adjacent ΔE under protan/deutan ≥ 8 —
// Orochia light 7.2, inside the 6–8 band that requires the secondary encoding every chart carries: legend, direct
// labels, data table —, normal-vision ΔE ≥ 15, ≥ 3:1 on the surface, the first three slots distinct all-pairs).
// A 9th series never gets a generated hue: it folds into “Other” or a second chart.
import type { BrandId } from "./types";

export type Mode = "dark" | "light";

/** The eight hues, light and dark steps. */
export const HUES = {
  blue: { light: "#2a78d6", dark: "#3987e5" },
  orange: { light: "#eb6834", dark: "#d95926" },
  aqua: { light: "#1baf7a", dark: "#199e70" },
  yellow: { light: "#eda100", dark: "#c98500" },
  magenta: { light: "#e87ba4", dark: "#d55181" },
  green: { light: "#008300", dark: "#008300" },
  violet: { light: "#6250d6", dark: "#9085e9" },
  red: { light: "#e34948", dark: "#e66767" },
} as const;

export type Hue = keyof typeof HUES;

/** The order of the hues for each brand: slot 1 is the brand. */
export const ORDERS: Record<BrandId, readonly Hue[]> = {
  krizaka: ["blue", "green", "magenta", "yellow", "aqua", "orange", "violet", "red"],
  orazaka: ["orange", "aqua", "blue", "yellow", "magenta", "green", "violet", "red"],
  orochia: ["violet", "magenta", "yellow", "aqua", "orange", "blue", "green", "red"],
};

/** The categorical palette of a brand in a theme: eight hex colours, slot 1 first. */
export function palette(brand: BrandId, mode: Mode): string[] {
  return ORDERS[brand].map((hue) => HUES[hue][mode]);
}

/** The diverging poles (below / above the midpoint): blue ↔ red, a neutral grey between them. */
export const DIVERGING = {
  light: { low: HUES.blue.light, high: HUES.red.light },
  dark: { low: HUES.blue.dark, high: HUES.red.dark },
} as const;

// --- Colour arithmetic (OKLab), for the sequential ramps the canvas engine needs as plain colours. ---------------

type Rgb = [number, number, number];

/** `#rrggbb`, `#rgb`, `rgb(r, g, b)` / `rgba(…)` or `rgb(r g b / a)` → [r, g, b] in 0–255; null otherwise. */
export function parseColor(color: string): Rgb | null {
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) {
    const h = hex[1]!.length === 3 ? [...hex[1]!].map((c) => c + c).join("") : hex[1]!;
    return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as Rgb;
  }
  const rgb = color.trim().match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (v: number) => {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
};

function toOklab([r8, g8, b8]: Rgb): Rgb {
  const [r, g, b] = [toLinear(r8), toLinear(g8), toLinear(b8)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

function fromOklab([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614031 * s),
  ];
}

const hex = ([r, g, b]: Rgb) => `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

/** `a` → `b` at `t` (0–1), interpolated in OKLab (even steps to the eye). Unparseable colours return `b`. */
export function mix(a: string, b: string, t: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return b;
  const la = toOklab(ca);
  const lb = toOklab(cb);
  return hex(fromOklab([0, 1, 2].map((i) => la[i]! + (lb[i]! - la[i]!) * t) as Rgb));
}

/**
 * A sequential ramp of `steps` colours, one hue from near the surface (`0`, “almost nothing”) to the full hue: the
 * magnitude of a heatmap, a calendar or a choropleth. The first step is still distinct from the surface.
 */
export function sequential(hue: string, surface: string, steps = 5): string[] {
  return Array.from({ length: steps }, (_, i) => mix(surface, hue, 0.22 + (0.78 * i) / Math.max(1, steps - 1)));
}

/** WCAG contrast ratio between two colours (for the tests and the labels drawn inside a mark). */
export function contrast(a: string, b: string): number {
  const lum = (c: string) => {
    const rgb = parseColor(c);
    if (!rgb) return 0;
    const [r, g, bl] = rgb.map(toLinear) as Rgb;
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
