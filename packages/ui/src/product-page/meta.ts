import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Product page",
  summary: "A product's public page assembled from data only: the hero in layers of depth with the product moment, the one journey told while scrolling, the document the visitor touches, the scenes, the limits, the closing call and the footer. Its blocks carry no product name and no colour: the words, media and verdicts are data, the colour is the brand scope.",
  status: "beta",
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A whole page of a public site, read in a browser; a phone app shows the same proof as a screen built from Screen, Card and the native primitives, and the product's site opens in the browser." },
    desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." },
  },
  whenToUse: ["The home of one product: the promise, the proof in five seconds, then the journey and the call.", "Any part alone: the hero, the scenes, the limits or the closing on a product's inner page."],
  whenNotToUse: [
    { when: "For the home of a company or a product line.", use: "landing-page" },
    { when: "For a price list.", use: "pricing-page" },
  ],
  bestPractices: [
    "Give data, not markup: `ProductPage`'s `data` holds every word (title ≤ 8 words, lead ≤ 14, a scene's title ≤ 4) and every verdict label (`To check`) as the product says it.",
    "Set the colour with `brand` (the `.brand-<id>` scope of @krizaka/tokens), never a colour in the data.",
    "The moment's lines and findings come from a recorded run of the product, never typed for the page.",
    "One way in, said twice: the hero's main action and the closing's are the same.",
    "The decision stamp is neutral (`Decision noted`) in the brand's colour: no signature.",
    "Motion follows the tiers of `@krizaka/ui/motion-tier`: full, light on a weak device, still under reduced motion with the final state shown.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The hero's title is the page's only `h1`; each scene, the story's steps, the demo, the limits and the closing are `h2`.",
      "The moment is a named `figure`; the story's scene is decorative (`aria-hidden`), its steps real text.",
      "Each loop has a visible pause; under reduced motion or Save-Data the still stays alone.",
      "The device's tilt straightens on hover and on focus alike.",
    ],
  },
  related: ["story-scroll", "clause-demo", "motion-tier", "media-gallery", "landing-page"],
  web: {
    imports: ["ProductPage", "ProductHero", "ProductActions", "ProductMoment", "FindingCard", "CahierSheet", "DocumentScene", "DecisionStamp", "SceneRow", "SceneList", "LimitsBand", "ClosingBand", "PublicFooter"],
    examples: [
      { name: "fixture", title: "A fixture product", description: "A whole page from one data object: hero, story, demo, scenes, limits, closing and footer.", template: true, purpose: "convince", why: "A visitor gets the promise and its proof in five seconds, then follows one journey to the one way in." },
      { name: "hero", title: "Hero", description: "The promise and its way in beside the product moment, in layers of depth over a still out of focus." },
      { name: "scenes", title: "Scenes", description: "One useful action per row, its recording beside a few words, alternating; the first enlarged on a phone." },
      { name: "bands", title: "Limits and closing", description: "What the product does not do beside its bird, then the closing sentence and its one way in." },
      { name: "footer", title: "Stamp and footer", description: "The neutral decision stamp in the brand's colour, and the public footer drawn from its data." },
    ],
  },
} satisfies ComponentMeta;
