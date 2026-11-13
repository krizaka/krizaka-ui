import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Landing page",
  summary: "A landing page: the promise beside the product alive in a window (or alone, in one column), a band of proofs, a full-width showcase, the features as a bento where the main one takes the room, the closing call.",
  status: "beta",
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["The home of a company or a product line.", "A campaign page that must sell in one screen."],
  whenNotToUse: [
    { when: "For one product's page, with its traps and decisions." },
    { when: "For a list of entry points.", use: "docs-hub-page" },
  ],
  bestPractices: ["One `lg` feature in the bento: the one the visitor came for.", "The window shows the real product (a recording, a demo), never a mock-up; without one, omit `visual` and the hero is one column.", "A home that leads with text and a wide demo: no `visual`, `backdrop=\"quiet\"`, a `MediaCarousel` in `showcase`.", "Three or four proofs, each a fact that can be checked.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The hero's title is the page's `h1`; the window is a `figure`, its bar decorative.", "Proofs are a description list; the bento a list of features."],
  },
  related: ["page-hero", "card-grid"],
  web: {
    imports: ["LandingPage"],
    examples: [
      { name: "showcase", title: "Showcase", description: "A text-only hero on the quiet backdrop, the proofs, then a full-width carousel before the features.", template: true, purpose: "show", why: "A visitor reads the promise, then watches the product at full width before any feature list." },
      { name: "krizaka", title: "Krizaka", description: "The studio's landing: the promise, the console alive, proofs, three products in a bento.", template: true, purpose: "convince", why: "A visitor gets the promise in one screen, the product alive, the proofs and one call to act." },
    ],
  },
} satisfies ComponentMeta;
