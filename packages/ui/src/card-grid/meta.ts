import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Card grid",
  summary:
    "A responsive grid of cards: as many columns as the width allows (one on a phone), the cells of a row at one height, a staggered reveal; each card keeps its own quiet hover.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Entry points of a hub (`LinkCard`), the reasons of a product page (`ArgumentCard`), plans, products.",
    "Any set of peer cards that should read as one group with one rhythm.",
  ],
  whenNotToUse: [
    { when: "For a sequence the reader follows in order.", use: "stepper" },
    { when: "For rows of data to compare or sort.", use: "data-table" },
  ],
  bestPractices: [
    "Set `min` to the narrowest a card still reads well; the grid does the rest at every width.",
    "`fit=\"fit\"` for two or three cards that should share the whole width; `fill` keeps a lone card at its size.",
    "Keep `reveal` on below the first screen, off on it; `columns` makes the stagger restart on each row.",
    "The default `align=\"stretch\"` gives a row one height; the cards pin their foot to the bottom (`LinkCard` facts + way in, `ArgumentCard` actions) so the footers line up. `align=\"start\"` for cards that unfold.",
    "`as=\"ul\"` when the cards are a list of links.",
    "`foundation` when one thing (an engine, a platform) carries all the others: it takes its own card, wide, above (`foundationPosition=\"end\"` for under), and the cards sit in a hairline frame joined to it. Say the relation with `foundationLabel`; set the hue on `className`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The grid adds no role; `as=\"ul\"` makes it a list (each cell an `li`).",
      "Nothing follows the pointer: `light` and `hover` are deprecated since 3.31 (krizaka-ui#393) and do nothing.",
      "Revealed cells are only hidden visually until they enter the viewport; under reduced motion they never move.",
    ],
  },
  related: ["link-card", "argument-card"],
  web: {
    imports: ["CardGrid"],
    examples: [
      { name: "products", title: "Two halves", description: "`fit=\"fit\"`: two cards share the whole width." },
      { name: "aligned", title: "An aligned row", description: "Cards with sentences of different lengths: one height, and the facts and the way in of every card on the same line." },
      { name: "foundation", title: "A foundation", description: "`foundation`: one wide card the others stand on, a hairline to a frame around them." },
      { name: "reveal", title: "A list of sections", description: "`as=\"ul\"`, six links that rise staggered by column on a real page." },
      { name: "hover-quiet", title: "The hover", description: "The grid adds no hover: each card's surface and hairline go one step up, a ring on focus." },
    ],
  },
} satisfies ComponentMeta;
