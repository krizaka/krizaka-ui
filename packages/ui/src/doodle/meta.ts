import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Doodle",
  summary:
    "A doodle in the margin of the page: an arrow pointing at a block, a circled word, a star, a wavy underline or a tiny bird, in the margin ink. Decoration only, and gone where the margin disappears.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A phone has no margin to scribble in." },
    desktop: "web",
  },
  whenToUse: [
    "Beside a `Stuck` block or a heading, on a wide screen, where the notebook's margin has room.",
    "A touch of hand on a page of the Cahier, once or twice, never a pattern.",
  ],
  whenNotToUse: [
    { when: "Something the reader must know: a status, a warning.", use: "alert" },
    { when: "A note with words, hung in the margin.", use: "footnote" },
  ],
  bestPractices: [
    "At most one or two doodles in view; the register stays refined.",
    "Point at what matters: an arrow toward the block, a circle round its key word.",
    "Give a `seed` so the tilt is the same on every render.",
    "Never carry information in a doodle or its word: it is hidden below 1360 px and from assistive technology.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`aria-hidden`: a doodle is decoration, with its word, and takes no focus and no pointer.",
      "It sits in the margin beside the block and never over text; below 1360 px it is not displayed (`place=\"inline\"` keeps it in the flow).",
      "Drawn in the margin ink; it is not text, and nothing animates.",
    ],
  },
  related: ["stuck", "footnote", "page"],
  web: {
    imports: ["Doodle"],
    examples: [
      { name: "kinds", title: "Five doodles", description: "An arrow, a circled word, a star, a wavy underline and a tiny bird, inline." },
      { name: "margin", title: "In the margin", description: "An arrow and a circled word beside a stuck card, from 1360 px." },
    ],
  },
} satisfies ComponentMeta;
