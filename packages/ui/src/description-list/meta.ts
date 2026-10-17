import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Description list",
  summary: "Facts about one thing as term and value: stacked, inline like a receipt, or a grid of key figures (`KeyValueGrid`).",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["A job's details in a side panel.", "A payout's or a tip's breakdown.", "An account's limits as a grid of figures."],
  whenNotToUse: [
    { when: "For many records.", use: "list" },
    { when: "For one key figure with its trend.", use: "stat" },
  ],
  bestPractices: ["Keep the terms short and the values formatted (`@krizaka/intl`).", "Inline for amounts that add up; grid for figures to scan."],
  accessibility: {
    keyboard: [],
    notes: ["A `dl`: each term (`dt`) names its value (`dd`).", "On React Native each pair is one element, read as “term, value”."],
  },
  related: ["stat", "list", "card"],
  web: {
    imports: ["DescriptionList", "KeyValueGrid"],
    examples: [
      { name: "job-details", title: "Details", description: "A job's status, studio, start and credits." },
      { name: "receipt", title: "Receipt", description: "`layout=\"inline\"`: where a tip goes." },
      { name: "key-value-grid", title: "Key figures", description: "`KeyValueGrid`: an account's limits as cards that wrap." },
    ],
  },
  native: {
    imports: ["DescriptionList"],
    differences: ["`term` is a string; `layout=\"grid\"` draws two cards per row.", "No `KeyValueGrid`: use `layout=\"grid\"`."],
    examples: [{ name: "job-details", title: "Details", description: "Stacked details, then an inline summary." }],
  },
} satisfies ComponentMeta;
