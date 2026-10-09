// Colour maths for the token build and its tests: CSS `hsl()` → sRGB, hex/rgba for React Native, and the WCAG 2.x
// contrast ratio. No dependency.

/** @typedef {{ r: number, g: number, b: number, a: number }} Rgba  r, g, b in 0..255 (rounded), a in 0..1 */

const HSL = /^hsl\(\s*(-?[\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?)\s*)?\)$/;

/**
 * Parses a CSS `hsl(h s% l% / a)` (space syntax, as written in the token sources).
 * @param {string} value
 * @returns {Rgba}
 */
export function parseHsl(value) {
  const match = HSL.exec(value.trim());
  if (!match) throw new Error(`Not an hsl() colour: ${value}`);
  const [, hRaw, sRaw, lRaw, aRaw] = match;
  const h = ((Number(hRaw) % 360) + 360) % 360;
  const s = Number(sRaw) / 100;
  const l = Number(lRaw) / 100;
  const a = aRaw === undefined ? 1 : aRaw.endsWith("%") ? Number(aRaw.slice(0, -1)) / 100 : Number(aRaw);
  /** @param {number} n */
  const channel = (n) => {
    const k = (n + h / 30) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: Math.round(channel(0) * 255), g: Math.round(channel(8) * 255), b: Math.round(channel(4) * 255), a };
}

/**
 * `#rrggbb` when opaque, `rgba(r,g,b,a)` otherwise — the two forms React Native reads.
 * @param {Rgba} c
 */
export function toNative(c) {
  if (c.a >= 1) return `#${[c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  return `rgba(${c.r},${c.g},${c.b},${Number(c.a.toFixed(3))})`;
}

/**
 * Composites a translucent colour over an opaque one (source-over).
 * @param {Rgba} top
 * @param {Rgba} bottom
 * @returns {Rgba}
 */
export function over(top, bottom) {
  /** @param {number} t @param {number} b */
  const mix = (t, b) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

/**
 * WCAG 2.x relative luminance.
 * @param {Rgba} c
 */
export function luminance(c) {
  /** @param {number} v */
  const lin = (v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

/**
 * WCAG 2.x contrast ratio (1..21) of a foreground on an opaque background; a translucent foreground is composited
 * first.
 * @param {Rgba} fg
 * @param {Rgba} bg
 */
export function contrast(fg, bg) {
  const a = luminance(fg.a < 1 ? over(fg, bg) : fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
