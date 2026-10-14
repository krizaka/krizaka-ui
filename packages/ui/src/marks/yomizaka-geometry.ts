import { marks } from "@krizaka/tokens/native";

/**
 * The Yomizaka mark's geometry — drawn by the web mark (YomizakaLogo) and the native one (YomizakaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold filled emblem in the
 * brand gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **the reading**: a filled page whose upper-right corner wears the Krizaka cut, three lines of text in
 * light, and a lens — the eye that reads, the owl's — resting on its lower half, its handle running out of the page.
 * The lens is the bright core: it breathes. A thin gap (the page shows through) separates the page from the lens: the
 * page is cut here, no mask, so web and native draw the same thing. On the web a line of light scans the page from top
 * to bottom (reading); one node, a page, rides the dashed orbit. The gradient is the brand's mark gradient
 * (`marks.yomizaka` of @krizaka/tokens): ink → indigo, mid-tones that read ≥ 3:1 on the page surfaces of both themes
 * (tested in @krizaka/tokens), so one mark serves dark and light.
 */
/** The indigo end of the gradient: the halo. */
const indigo = marks.yomizaka[marks.yomizaka.length - 1]![1];

/*
 * How the page is drawn (literal, so the native bundle carries no geometry code): a page x 128 → 264, y 92 → 300, its
 * upper-right corner cut 36 (228, 92) → (264, 128). The lens is centred at (240, 232); the page is cut by the lens'
 * circle grown by the gap (r 52), which crosses the right edge at y 232 ± 46.13 — the large arc runs inside the page.
 */
export const YOMIZAKA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The page, cut at its corner (the Krizaka chamfer) and around the lens. */
  page: "M128 92 H228 L264 128 V185.87 A52 52 0 1 0 264 278.13 V300 H128 Z",
  /** Three lines of text and the start of a fourth, in light: they wrap around the lens. */
  lines: "M156 140 H226 M156 170 H236 M156 200 H184 M156 230 H176",
  line: { color: "#f4f5ff", opacity: 0.6, width: 10 },
  /** The lens: a ring in the brand gradient, its pale core lit from above, a glint; the handle leaves the page. */
  lens: { cx: 240, cy: 232, r: 40, width: 12, core: 28, glint: { cx: 230, cy: 222, r: 8 } },
  handle: "M276 268 L304 296",
  handleWidth: 20,
  gradient: { x1: 128, y1: 300, x2: 304, y2: 92, stops: marks.yomizaka },
  /** The lens' core: a pale indigo light, brighter at the top. */
  coreGradient: { stops: [["0%", "#c9ceff"], ["100%", "#f4f5ff"]] as const },
  highlight: "#ffffff",
  /** The reading (web): a line of light that scans the page from top to bottom, clipped to the page. */
  scan: { d: "M136 100 H236", travel: 192, color: "#f4f5ff", opacity: 0.7, width: 3 },
  /** A page: one node on the orbit, that turns with it. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: indigo, opacity: 0.18 },
  /** The lens' breathing shadow (web), in the indigo. */
  pulse: { color: indigo, low: 0.3, high: 0.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
