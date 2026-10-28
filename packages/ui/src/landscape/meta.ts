import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Landscape",
  summary:
    "The Krizaka valley at dusk — peaks, a phoenix over a river of two flames, trees of light and the flock at work: a decorative backdrop in its own colours or in the host brand's.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Behind the end of a told page or a home's first screen, under the last words.",
    "A product's about page, in its own accents (`tone=\"brand\"`, `flock={false}` for a calmer one).",
  ],
  whenNotToUse: [
    { when: "Behind a section's content: the brand's gradient and grid are the section backdrop.", use: "section-backdrop" },
    { when: "In a working screen, or behind text that must be read." },
  ],
  bestPractices: [
    "Place it at the bottom of a positioned parent with room under the words; it fades into the surface.",
    "Hold it still (`animated={false}`) on a page that already moves; it pauses off screen with `MotionObserver`.",
    "The birds are hidden under 1024 px: on a phone the valley stays calm.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative (`aria-hidden`): it never carries information.",
      "Every loop holds its first frame under `prefers-reduced-motion`, with `animated={false}`, and while off screen.",
    ],
  },
  related: ["section-backdrop", "mascots", "page-hero"],
  web: {
    imports: ["Landscape"],
    examples: [
      { name: "backdrop", title: "A page's end", description: "The valley behind the last words, faded into the surface." },
      { name: "brand", title: "In the brand's colours", description: "`tone=\"brand\"` without the flock: the sky and the peaks in the host's accents." },
    ],
  },
} satisfies ComponentMeta;
