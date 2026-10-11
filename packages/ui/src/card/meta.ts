import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Card",
  summary:
    "The composed chassis of every card — a media with overlays, a body with a title, a description, stats and a footer — in the Krizaka material: raised, elevated, frosted glass, outlined or in the spotlight, with an optional cut corner.",
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
    "`Card.Image` loads lazily; pass `loading=\"eager\"` (and `fetchPriority=\"high\"`) to the first cards of a page, above the fold.",
    "`reveal={index}` with one `MotionObserver` per page for the entrance; it is shown at once under reduced motion.",
    "`variant`: `default` (raised), `elevated`, `glass` (over a media or a backdrop), `outline` (no material), `spotlight` (the one card a section is about — one per section). `tone` is its former name, kept for 2.x.",
    "`cut` cuts the top-right corner at 45°: the Krizaka chamfer, for a card that carries the brand.",
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
      { name: "stat-card", title: "Stat card", description: "Figures put forward with `Card.Stat`, `variant=\"elevated\"`." },
      { name: "spotlight", title: "Spotlight", description: "`variant=\"spotlight\"`: a halo of the brand from the top, a hairline of light — the recommended plan." },
      { name: "glass", title: "Glass", description: "`variant=\"glass\"`: frosted glass over a media or a backdrop; the text keeps AA on whatever passes under." },
      { name: "outline", title: "Outline", description: "`variant=\"outline\"`: a frame without material, among raised cards." },
      { name: "cut", title: "Cut corner", description: "`cut`: the top-right corner cut at 45°, the angle of the Krizaka marks." },
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
      { name: "default", title: "Default", description: "A media, a body and a footer, on a raised surface: the sheen and the edge of light." },
      { name: "elevated", title: "Elevated", description: "`tone=\"elevated\"`: one step higher, with a shadow." },
      { name: "pressable", title: "Pressable", description: "`onPress`: the whole card is a button." },
      { name: "body", title: "Text and an action", description: "A body only, with a button." },
    ],
  },
} satisfies ComponentMeta;
