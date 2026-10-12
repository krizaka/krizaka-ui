import { marks } from "@krizaka/tokens/native";

/**
 * The Yazakia mark's geometry — drawn by the web mark (YazakiaLogo) and the native one (YazakiaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold emblem in the brand
 * gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **two voices**: two solid speech bubbles, mirrored, that overlap. Where they overlap — what the two
 * people share once they have talked — is the bright core, a lens lit from above that breathes. The left voice sits a
 * shade deeper than the right, so the pair reads as two, with depth, at 16 px as at 128 px. A thin gap (the page shows
 * through) separates each bubble from the lens: the paths are cut here, no mask, so web and native draw the same thing.
 * Two nodes, the pair, ride the dashed orbit. The gradient is the brand's mark gradient (`marks.yazakia` of
 * @krizaka/tokens): emerald → turquoise, mid-tones that read ≥ 3:1 on the page surfaces of both themes (tested in
 * @krizaka/tokens), so one mark serves dark and light.
 */
/** The bright end of the gradient (turquoise): the halo and the core's glow. */
const turquoise = marks.yazakia[marks.yazakia.length - 1]![1];

/** A bubble's radius, the centres' height and half the distance between the two centres; the gap around the lens. */
const R = 80;
const CY = 184;
const DX = 36;
const GAP = 7;

const round = (n: number) => Math.round(n * 10) / 10;
/** Where two circles of radius R and r, centred DX on either side of x = 200, cross: (x, half the chord). */
const cross = (r: number) => {
  const x = 200 - DX + (R * R - r * r + 4 * DX * DX) / (4 * DX);
  return [round(x), round(Math.sqrt(R * R - (x - (200 - DX)) ** 2))] as const;
};
const [, lensHalf] = cross(R);
const [cutX, cutHalf] = cross(R + GAP);
const top = round(CY - cutHalf);
const bottom = round(CY + cutHalf);

/**
 * A voice — its circle with the lens (and the gap) cut out, and its tail, down and out. `side` −1 is the left voice,
 * +1 its mirror (x ↦ 400 − x, arcs turning the other way).
 */
const voice = (side: -1 | 1) => {
  const x = (v: number) => round(side < 0 ? v : 400 - v);
  const [outer, inner] = side < 0 ? [0, 1] : [1, 0];
  return {
    body: `M${x(cutX)} ${top} A${R} ${R} 0 1 ${outer} ${x(cutX)} ${bottom} A${R + GAP} ${R + GAP} 0 0 ${inner} ${x(cutX)} ${top} Z`,
    tail: `M${x(98)} 230 Q${x(104)} 268 ${x(88)} 294 Q${x(122)} 288 ${x(144)} 262 L${x(130)} 200 Z`,
  };
};

export const YAZAKIA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The two voices, left then right: each a bubble (cut around the lens) and its tail. */
  voices: [voice(-1), voice(1)] as const,
  /** The left voice, a shade deeper: the depth between the two. */
  shade: { color: "#000", opacity: 0.22 },
  /** Where the bubbles overlap: the core, lit from above. */
  lens: {
    d: `M200 ${round(CY - lensHalf)} A${R} ${R} 0 0 1 200 ${round(CY + lensHalf)} A${R} ${R} 0 0 1 200 ${round(CY - lensHalf)} Z`,
    y1: round(CY - lensHalf),
    y2: round(CY + lensHalf),
  },
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.yazakia },
  /** The light on the lens: bright at the top, fading down. */
  highlight: { color: "#f0fdfa", from: 0.75, to: 0.2 },
  /** The pair: two nodes on the orbit, opposite each other, that turn with it. */
  pair: { r: 8, at: [[40, 200], [360, 200]] as const },
  glow: { color: turquoise, opacity: 0.16 },
  /** The core's breathing shadow (web), in the mark's turquoise. */
  pulse: { color: turquoise, low: 0.3, high: 0.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
