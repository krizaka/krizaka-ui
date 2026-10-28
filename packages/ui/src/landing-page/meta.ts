import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Landing page",
  summary: "A landing page: the promise beside the product alive in a window, a band of proofs, the features as a bento where the main one takes the room, the closing call.",
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
  bestPractices: ["One `lg` feature in the bento: the one the visitor came for.", "The window shows the real product (a recording, a demo), never a mock-up.", "Three or four proofs, each a fact that can be checked.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The hero's title is the page's `h1`; the window is a `figure`, its bar decorative.", "Proofs are a description list; the bento a list of features."],
  },
  related: ["page-hero", "card-grid"],
  web: {
    imports: ["LandingPage"],
    examples: [
      { name: "krizaka", title: "Krizaka", description: "The studio's landing: the promise, the console alive, proofs, three products in a bento.", template: true, purpose: "convince", why: "A visitor gets the promise in one screen, the product alive, the proofs and one call to act." },
    ],
  },
} satisfies ComponentMeta;
