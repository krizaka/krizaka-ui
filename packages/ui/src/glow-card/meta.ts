import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Glow card",
  summary:
    "A card ringed by the brand: its border is a still hairline of the brand gradient, a step brighter under the pointer or the focus, fuller on a featured card. Nothing follows the pointer, nothing turns (krizaka-ui#393).",
  status: "beta",
  category: "layout",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Cards that invite a choice: plans, products, the entry points of a landing page.",
    "One featured card among others (`alive`): its ring turns at rest.",
  ],
  whenNotToUse: [
    { when: "For the cards of an app's lists and feeds: a calm card reads better there.", use: "card" },
    { when: "Around content the reader studies (a form, a table): a coloured ring competes with it." },
  ],
  bestPractices: [
    "One grid of glowing cards per page; `alive` on one card at most.",
    "Make the whole card the link with `asChild` when it leads somewhere — the focus brightens its ring like the pointer.",
    "Colours come from the brand (`.brand-<id>`): never pass one.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Focusing the card (or a control inside it) brightens its ring, as the pointer does." }],
    notes: [
      "A decorative ring only (a pseudo-element): nothing is added to the accessibility tree; the card's semantics are yours.",
      "Nothing moves or turns, with or without `prefers-reduced-motion`; only the ring's opacity changes, in 150 ms.",
      "Its loops pause off screen and while the page settles (MotionObserver).",
    ],
  },
  related: ["card", "button"],
  web: {
    imports: ["GlowCard"],
    examples: [
      { name: "plans", title: "Plans", description: "Three plans: each ring brightens under the pointer; the featured one's ring is fuller at rest." },
      { name: "link-card", title: "A card that is a link", description: "`asChild` on an `<a>`, `glow=\"border\"`: the focus brightens the ring." },
      { name: "spotlight", title: "Spotlight only", description: "`glow=\"spotlight\"` is deprecated (krizaka-ui#393): the bloom is retired, the card draws no ring." },
    ],
  },
} satisfies ComponentMeta;
