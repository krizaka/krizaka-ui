import { marks } from "@krizaka/tokens/native";

/**
 * The Yasakia mark's geometry — drawn by the web mark (YasakiaLogo) and the native one (YasakiaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold emblem in the brand
 * gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **two voices**: two solid speech bubbles, mirrored, that overlap. Where they overlap — what the two
 * people share once they have talked — is the bright core, a lens lit from above that breathes. The left voice sits a
 * shade deeper than the right, so the pair reads as two, with depth, at 16 px as at 128 px. A thin gap (the page shows
 * through) separates each bubble from the lens: the paths are cut here, no mask, so web and native draw the same thing.
 * Two nodes, the pair, ride the dashed orbit. The gradient is the brand's mark gradient (`marks.yasakia` of
 * @krizaka/tokens): emerald → turquoise, mid-tones that read ≥ 3:1 on the page surfaces of both themes (tested in
 * @krizaka/tokens), so one mark serves dark and light.
 */
/** The bright end of the gradient (turquoise): the halo and the core's glow. */
const turquoise = marks.yasakia[marks.yasakia.length - 1]![1];

/*
 * How the paths are drawn (literal, so the native bundle carries no geometry code): each bubble is a circle of radius 80
 * centred at y 184, 36 on either side of x = 200 (164 and 236); they overlap in the lens (x = 200, y 112.6 → 255.4).
 * Each bubble is cut by the other's circle grown by the gap (r 87): the cut runs from (191.9, 109) to (191.9, 259) on
 * the left, mirrored on the right. Each tail is a curved point from the bubble's lower outer side, down and out to
 * (88, 294) — mirrored (312, 294).
 */
export const YASAKIA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The two voices, left then right: each a bubble (cut around the lens) and its tail. */
  voices: [
    { body: "M191.9 109 A80 80 0 1 0 191.9 259 A87 87 0 0 1 191.9 109 Z", tail: "M98 230 Q104 268 88 294 Q122 288 144 262 L130 200 Z" },
    { body: "M208.1 109 A80 80 0 1 1 208.1 259 A87 87 0 0 0 208.1 109 Z", tail: "M302 230 Q296 268 312 294 Q278 288 256 262 L270 200 Z" },
  ] as const,
  /** The left voice, a shade deeper: the depth between the two. */
  shade: { color: "#000", opacity: 0.22 },
  /** Where the bubbles overlap: the core, lit from above. */
  lens: { d: "M200 112.6 A80 80 0 0 1 200 255.4 A80 80 0 0 1 200 112.6 Z", y1: 112.6, y2: 255.4 },
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.yasakia },
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
