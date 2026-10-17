import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Generated view",
  summary: "Draws the interface a model describes in A2UI v0.9 — tables, figures, charts, cards, callouts — from a catalog the app declares, never from code.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/orazaka#207", reason: "Slice 3 of the data-driven UI epic: the same messages drawn with the native primitives." },
    desktop: "web",
  },
  whenToUse: [
    "When a model answers a question about data and a table, a figure or a chart says it better than a paragraph.",
    "In a chat that streams: the view grows message by message while the answer arrives.",
    "When the same answer must be drawn by several apps: the messages are data, each app draws them with its catalog.",
  ],
  whenNotToUse: [
    { when: "For an interface the app knows in advance: write it with the components themselves.", use: "data-table" },
    { when: "For prose: render the model's text as markdown.", use: "markdown" },
  ],
  bestPractices: [
    "Merge `baseGenUiCatalog` with `chartsGenUiCatalog` of @krizaka/charts; a component outside the catalog is refused, never guessed.",
    "Pass `onError` and log what was refused: a refused message leaves the rest of the view as it was.",
    "Give the model the catalog and the rule that every number comes from the data it was given — the renderer checks shapes, not truth.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The view is a `section` named by `labels.surface`, `aria-busy` while the answer streams.",
      "Text is rendered as text (escaped): no HTML, no script, no link in the catalog v1.",
      "Charts carry their own written summary and data table (@krizaka/charts); tables are `DataTable`s with a caption.",
    ],
  },
  related: ["data-table", "stat", "alert", "card", "markdown", "chat"],
  web: {
    imports: ["GenUiStream", "GenUiSurface", "baseGenUiCatalog", "validateMessage", "readStream"],
    examples: [
      { name: "table", title: "A table from a model's answer", description: "Prose, then a callout and a sortable table bound to the data model." },
      { name: "streaming", title: "While the answer arrives", description: "A half-written answer: what has arrived is drawn, the rest is a skeleton." },
    ],
  },
} satisfies ComponentMeta;
