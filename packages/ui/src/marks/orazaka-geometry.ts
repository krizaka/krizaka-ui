/**
 * The Orazaka mark's geometry — drawn by the web mark (OrazakaLogo) and the native one (OrazakaMark). The same
 * grammar as Orochia and Krizaka (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold
 * emblem in the brand gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem keeps the original idea — three hexagonal shards orbiting a core — drawn as solid shards (the weight of
 * Orochia's body) in the logo's own orange: #b45309 → #f59e0b, the stops the Orazaka brand theme is built from.
 */
export const ORAZAKA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "76 76 248 248",
  center: 200,
  /**
   * The three shards — a hexagon's cap (from the original 132-unit drawing), scaled ×1.9 around the centre and turned
   * 0°, 120°, 240° — in view-box coordinates, so that one gradient runs across all three.
   */
  shards: [
    "M154.4,121.2 L200,94.7 L245.6,121.2 L245.6,154.4 L226.6,165.4 L226.6,132.2 L200,116.8 L173.4,132.2 L173.4,165.4 L154.4,154.4 Z",
    "M291.1,199.9 L291.2,252.6 L245.5,278.9 L216.7,262.3 L216.6,240.3 L245.4,257 L272.1,241.6 L272,210.9 L243.2,194.3 L262.3,183.3 Z",
    "M154.5,278.9 L108.8,252.6 L108.9,199.9 L137.7,183.3 L156.8,194.3 L128,210.9 L127.9,241.6 L154.6,257 L183.4,240.3 L183.3,262.3 Z",
  ],
  shardStroke: 5.7,
  amber: { x1: 90, y1: 310, x2: 310, y2: 90, stops: [["0%", "#b45309"], ["100%", "#f59e0b"]] },
  core: { r: 21, inner: 7.6 },
  highlight: "#fffbeb",
  glow: { color: "#f59e0b", opacity: 0.16 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
