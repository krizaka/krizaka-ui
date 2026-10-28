import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Cover hero",
  summary: "The first screen of a shop or a place: its cover — a photo, or a muted loop that stays a still under reduced motion — behind the name, a one-line promise, a few true facts and the main action. Without a cover, the brand's colours.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public storefront is a web page.", use: "profile-card" }, desktop: "web" },
  whenToUse: [
    "The top of a business's public page, where its own photo or loop sells it before any text is read.",
    "Any page whose subject has a cover image: a place, a venue, a profile.",
  ],
  whenNotToUse: [
    { when: "The first screen of a documentation or marketing page of the product itself.", use: "page-hero" },
    { when: "A product's overview with its window beside the words." },
  ],
  bestPractices: [
    "Use the business's own media; with none, leave `cover` out — the hero still reads as designed.",
    "Give the still real `alt` text when it shows something that matters; leave it empty when it only sets a mood.",
    "Keep the facts to what is true now (open now, the neighbourhood, a rating that exists) — never a placeholder.",
    "One main action; pair it with `StickyAction` so a phone keeps it in reach.",
    "Keep the loop short (under 10 s, a few hundred kB): the still is what most readers see first.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `header` with the `h1`; the loop is `aria-hidden` and never focusable, and it is not rendered at all under reduced motion.",
      "The text sits on a veil made of the scrim tokens, readable over any cover in dark and light.",
    ],
  },
  related: ["page-hero", "sticky-action", "service-card", "media-gallery", "badge"],
  web: {
    imports: ["CoverHero"],
    examples: [
      { name: "shop", title: "Shop", description: "A cover photo, the name, the promise, open-now and the neighbourhood, and the main action." },
      { name: "plain", title: "Without a cover", description: "The brand's colours stand in for the photo." },
    ],
  },
} satisfies ComponentMeta;
