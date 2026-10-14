import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Card grid",
  summary:
    "A responsive grid of cards: as many columns as the width allows (one on a phone), the cells of a row at one height, a staggered reveal and the light that follows the pointer.",
  status: "beta",
  category: "blocks",
  platforms: "web",
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
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The grid adds no role; `as=\"ul\"` makes it a list (each cell an `li`).",
      "The pointer's light is decorative and never runs on touch screens or under `prefers-reduced-motion`.",
      "Revealed cells are only hidden visually until they enter the viewport; under reduced motion they never move.",
    ],
  },
  related: ["link-card", "argument-card", "pointer-light"],
  web: {
    imports: ["CardGrid"],
    examples: [
      { name: "products", title: "Two halves", description: "`fit=\"fit\"`: two cards share the whole width." },
      { name: "aligned", title: "An aligned row", description: "Cards with sentences of different lengths: one height, and the facts and the way in of every card on the same line." },
      { name: "reveal", title: "A list of sections", description: "`as=\"ul\"`, six links that rise staggered by column on a real page." },
    ],
  },
} satisfies ComponentMeta;
