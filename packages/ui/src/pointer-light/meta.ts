import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Pointer light",
  summary:
    "The light that follows the pointer over a group of cards: one passive listener writes the pointer's position into the card it is over, the card's CSS draws the light.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  whenToUse: [
    "Inside a group of cards that is not a `CardGrid` (a flex row, a list, a carousel).",
    "With `usePointerLight` in a component of your own that lays cards out.",
  ],
  whenNotToUse: [
    { when: "Inside a CardGrid: it lights its cards already.", use: "card-grid" },
    { when: "On one card alone, with a ring of the brand's gradient.", use: "glow-card" },
  ],
  bestPractices: [
    "One light per group: drop it once, as the last child of the group.",
    "The cards of the blocks carry `data-kz-light`; a card of your own adds it and draws `--kz-pointer-x/y` in its CSS.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Purely decorative: it renders a hidden, empty element and adds nothing to the accessibility tree.",
      "Nothing runs on touch screens or under `prefers-reduced-motion`; nothing loops.",
    ],
  },
  related: ["card-grid", "glow-card", "link-card"],
  web: {
    imports: ["PointerLight", "usePointerLight"],
    examples: [{ name: "list", title: "A row of cards", description: "Two link cards in a flex row, lit by the pointer." }],
  },
} satisfies ComponentMeta;
