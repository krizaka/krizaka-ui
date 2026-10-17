import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Comparison table",
  summary:
    "A fair “versus” block: one grid where every row lines up across the columns, your column drawn as a highlighted band of the same grid (the brand's tint and light, its header part of it), a small icon per question, each answer as a bold key phrase then its detail; the other answers stay neutral. On a phone, one card per question with the answers stacked.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's landing page; a phone app does not argue against a competitor." }, desktop: "web" },
  whenToUse: [
    "A landing page's “why us”: three to six questions answered by you and by the usual alternative.",
    "Two or three options compared on the same few questions, one of them recommended.",
  ],
  whenNotToUse: [
    { when: "For many rows of data to sort or filter.", use: "data-table" },
    { when: "For plans with prices and features.", use: "pricing-page" },
    { when: "For choices with their reasons and costs.", use: "decision-list" },
  ],
  bestPractices: [
    "Stay fair: the other column states facts, neutral — never crossed out, never mocked.",
    "Keep every claim true today; an answer the product does not deliver yet is softened or left out.",
    "Key phrase in bold (a few words), detail after it (one sentence); questions short enough for one or two lines.",
    "Three to six rows; give each question an icon of the same family.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Nothing to focus: a reading block." }],
    notes: [
      "Wide: a `table` named by `label`, with `columnheader`, `rowheader` and `cell` roles on the grid's cells (rows are `display: contents`).",
      "Phone: a list of cards named by `label`, each answer a `dt` / `dd` pair named by its column — nothing depends on a header out of view.",
      "The highlight is a tint, a border and the column's name — never colour alone. Rows rise in one after the other (`[data-reveal=\"soft\"]`, 70 ms apart); nothing moves under reduced motion.",
    ],
  },
  related: ["decision-list", "pricing-page", "data-table", "argument-card"],
  web: {
    imports: ["ComparisonTable"],
    examples: [{ name: "versus", title: "The same AI, different ownership", description: "Three questions, a cloud assistant against Orazaka; resize to a phone: one card per question." }],
  },
} satisfies ComponentMeta;
