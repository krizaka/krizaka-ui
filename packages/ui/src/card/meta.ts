import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Card",
  summary: "The composed chassis of every card: a media with overlays, a body with a title, a description, stats and a footer.",
  status: "stable",
  category: "layout",
  platforms: "both",
  whenToUse: [
    "To present one item of a collection: a video, a creator, a guide, a plan.",
    "As a link to the item (`asChild` + `interactive`): the whole card is one target.",
    "To group a few figures under a title (`Card.Stat`).",
  ],
  whenNotToUse: [
    { when: "To frame a whole page section: use the page layout, not a card around everything." },
    { when: "For a single key figure without a frame.", use: "stat" },
    { when: "For a message about the page.", use: "alert" },
  ],
  bestPractices: [
    "Build product cards from these parts and override any of them with `className` — never fork the card.",
    "Keep one primary target per card: either the whole card is a link, or it holds buttons — not both.",
    "Give `Card.Media` a fixed `aspect` so a grid stays aligned while images load.",
    "`reveal={index}` with one `MotionObserver` per page for the entrance; it is shown at once under reduced motion.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab / Enter", action: "An `asChild` link card is one focusable link that Enter follows." }],
    notes: [
      "`Card.Title` is a heading (`h3` by default, `as` to change the level) so cards are reachable by heading.",
      "A card that is a link is named by its content: keep the title first.",
      "The image fallback is decorative and hidden from assistive technology.",
    ],
  },
  related: ["badge", "stat", "avatar", "skeleton"],
  web: {
    imports: ["Card"],
    examples: [
      { name: "media-card", title: "Media card", description: "An image, badges on the media, a title, a description and a footer." },
      { name: "media-fallback", title: "Media fallback", description: "No image: the `fallback` on the accent gradient." },
      { name: "interactive-link", title: "Interactive link", description: "`asChild` + `<a>`: the whole card is a link, with the spotlight and the lift." },
      { name: "stat-card", title: "Stat card", description: "Figures put forward with `Card.Stat`, `tone=\"elevated\"`." },
      { name: "reveal-grid", title: "Reveal grid", description: "Cards entering in cascade with `reveal` and `MotionObserver`." },
    ],
  },
  native: {
    imports: ["Card"],
    differences: [
      "`onPress` on `Card.Root` makes the whole card a button (no `asChild`, no `interactive`).",
      "Built on `View`, `Image` and `Text`: style with `style`, not `className`.",
      "No `Card.Stat` and no `reveal`.",
    ],
    examples: [
      { name: "default", title: "Default", description: "A media, a body and a footer." },
      { name: "elevated", title: "Elevated", description: "`tone=\"elevated\"`: one step higher, with a shadow." },
      { name: "pressable", title: "Pressable", description: "`onPress`: the whole card is a button." },
      { name: "body", title: "Text and an action", description: "A body only, with a button." },
    ],
  },
} satisfies ComponentMeta;
