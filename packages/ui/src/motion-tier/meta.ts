import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Motion tier",
  summary: "How much a showroom page may move on this device — `full` (depth, blur, living loops), `light` (a weak device or Save-Data: transforms only) or `still` (reduced motion: one plate, the final state) — and `DepthField`, layers that follow the pointer.",
  status: "beta",
  category: "foundations",
  domain: "foundations",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A phone app reads the system's reduced-motion setting itself (AccessibilityInfo) and has no pointer to follow." },
    desktop: "web",
  },
  whenToUse: ["A page with depth, scroll-driven scenes or living loops must choose how much to move.", "A block needs layers that follow the pointer."],
  whenNotToUse: [{ when: "For the reveal and the off-screen pause of ordinary blocks: `MotionObserver` of `@krizaka/ui/motion`." }],
  bestPractices: [
    "Style by `data-tier`: `light` drops blur and depth, `still` shows the final state.",
    "Decide with `motionTierOf` in a test: it is pure.",
    "Never animate a filter; the living motion runs only while `data-live` (on screen).",
  ],
  accessibility: {
    keyboard: [],
    notes: ["`still` follows `prefers-reduced-motion` and changes with it; nothing moves and no listener runs."],
  },
  related: ["product-page", "story-scroll", "media-gallery"],
  web: {
    imports: ["useMotionTier", "motionTierOf", "DepthField", "MOTION_TIERS"],
    examples: [{ name: "depth", title: "Depth and tier", description: "Layers that follow the pointer, and the tier this device affords." }],
  },
} satisfies ComponentMeta;
