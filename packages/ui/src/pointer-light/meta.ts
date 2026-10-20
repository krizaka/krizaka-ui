import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Pointer light",
  summary:
    "Deprecated (krizaka-ui#393): it drew a light that followed the pointer over cards. It now does nothing — the cards have one quiet hover of their own.",
  status: "deprecated",
  deprecated: {
    since: "3.31.0",
    removedIn: "4.0.0",
    use: "card-grid",
    reason: "krizaka-ui#393: the light that followed the pointer is retired — every card has one quiet hover (a surface and hairline step, no movement, no light). It renders a hidden span and does nothing.",
  },
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "It follows a mouse pointer; a phone has none." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
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
    examples: [{ name: "list", title: "A row of cards", description: "Two link cards in a flex row, with their own quiet hover: the deprecated PointerLight inside adds nothing." }],
  },
} satisfies ComponentMeta;
