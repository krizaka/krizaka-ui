import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Glow card",
  summary:
    "A card lit by the brand: a bloom of the accent follows the pointer across it, and its border is a ring of the brand gradient that turns and brightens under the pointer or the focus.",
  status: "beta",
  category: "layout",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Cards that invite a choice: plans, products, the entry points of a landing page.",
    "One featured card among others (`alive`): its ring turns at rest.",
  ],
  whenNotToUse: [
    { when: "For the cards of an app's lists and feeds: a calm card reads better there.", use: "card" },
    { when: "Around content the reader studies (a form, a table): light that moves distracts." },
  ],
  bestPractices: [
    "One grid of glowing cards per page; `alive` on one card at most.",
    "Make the whole card the link with `asChild` when it leads somewhere — the focus lights it like the pointer.",
    "Colours come from the brand (`.brand-<id>`): never pass one.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Focusing the card (or a control inside it) lights its ring, as the pointer does." }],
    notes: [
      "Decorative light only (pseudo-elements): nothing is added to the accessibility tree; the card's semantics are yours.",
      "Under `prefers-reduced-motion` the ring rests at a fixed angle — still lit on hover and focus, never turning.",
      "Its loops pause off screen and while the page settles (MotionObserver).",
    ],
  },
  related: ["card", "button"],
  web: {
    imports: ["GlowCard"],
    examples: [
      { name: "plans", title: "Plans", description: "Three plans: the light follows the pointer across them; the featured one's ring turns at rest." },
      { name: "link-card", title: "A card that is a link", description: "`asChild` on an `<a>`, `glow=\"border\"`: the focus lights the ring." },
      { name: "spotlight", title: "Spotlight only", description: "`glow=\"spotlight\"`: the bloom alone, for a dense grid." },
    ],
  },
} satisfies ComponentMeta;
