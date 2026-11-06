import { KRIZAKA } from "./krizaka-geometry";

/**
 * The Kridoc mark's geometry (the managed storage; krizaka-internal#2035). Same grammar as the family
 * (a 360×360 artwork at (20, 20), one stroke of 22, an open figure whose end breaks out as a node, a core, a dashed orbit
 * and a ring). Kridoc is a service of the company, so it wears the **Krizaka** colours — ink figure, blue node and core.
 * The figure is a page with its corner folded: the stroke stays open at the fold, where the node — the share link — sits;
 * the core is the seal on the page (kept, audited).
 */
export const KRIDOC = {
  viewBox: KRIZAKA.viewBox,
  croppedViewBox: KRIZAKA.croppedViewBox,
  offset: KRIZAKA.offset,
  /** The page: from the fold, down the right edge, along the bottom, up the left edge and across the top, stopping short of the fold. */
  page: "M248,140 L248,268 L112,268 L112,92 L190,92",
  /** The folded corner: the crease from the top edge to the right edge. */
  fold: "M214,92 L214,124 L248,124",
  /** Two lines of text on the page. */
  lines: ["M140,170 L214,170", "M140,206 L196,206"],
  stroke: KRIZAKA.stroke,
  ink: KRIZAKA.ink,
  blue: KRIZAKA.blue,
  node: { cx: 248, cy: 92, r: 19, inner: 6 },
  core: { cx: 196, cy: 240, r: 20, inner: 7 },
  highlight: KRIZAKA.highlight,
  glow: KRIZAKA.glow,
  orbit: KRIZAKA.orbit,
  ring: KRIZAKA.ring,
} as const;
