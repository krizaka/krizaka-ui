/**
 * The Krizaka mark's geometry — the one description drawn by the web mark (KrizakaLogo) and the native one
 * (KrizakaMark). Built on the Orochia mark's grammar (docs: packages/tokens/BRAND.md, "Marks"): a 360×360 artwork at
 * (20, 20) in a 400×400 view box, one bold stroke (22) drawn as an open figure, an end that breaks out as a node, a
 * core, a dashed orbit and a ring; below 48 px the view box crops to the emblem.
 *
 * Krizaka is the parent: the hexagonal shield is **ink** (the host's text roles), the node and the core carry the
 * Krizaka blue (the accent of @krizaka/tokens, krizaka brand: hsl(217 92% 53%) → its text tint hsl(217 92% 68%)).
 */
export const KRIZAKA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "86 82 228 228",
  offset: 20,
  /** The shield: a pointy-top hexagon (r 92 around 180,180), open at its upper-right edge. */
  shield: "M259.7,134 L259.7,226 L180,272 L100.3,226 L100.3,134 L180,88 L212,106.5",
  stroke: 22,
  ink: { x1: 70, y1: 290, x2: 290, y2: 70 },
  blue: { x1: 180, y1: 180, x2: 300, y2: 60, stops: [["0%", "#196df5"], ["100%", "#629cf8"]] },
  /** The vertex where the shield opens: a node (the serpent's head in Orochia's grammar). */
  node: { cx: 259.7, cy: 134, r: 19, inner: 6 },
  core: { cx: 180, cy: 180, r: 24, inner: 8 },
  highlight: "#dbeafe",
  glow: { color: "#196df5", opacity: 0.16 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
