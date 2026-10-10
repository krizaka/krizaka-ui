import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Stat",
  summary: "A key figure: a label, a value in tabular digits, a hint and a trend said in words.",
  status: "stable",
  category: "data-display",
  platforms: "web",
  whenToUse: ["On a dashboard: revenue, views, supporters.", "In a row of a few figures that compare over the same period."],
  whenNotToUse: [
    { when: "For figures inside an item's card.", use: "card" },
    { when: "For progress towards a goal.", use: "progress" },
    { when: "For a status.", use: "badge" },
  ],
  bestPractices: [
    "Format the value in the app (currency, compact numbers) with `@krizaka/intl`.",
    "Say the change in `trendLabel` (“+12 %”) and the period in `hint`: the arrow alone says nothing.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The arrow is decorative; `trendLabel` is read and shown.", "Colour is never the only signal of the trend."],
  },
  related: ["card", "badge", "progress"],
  web: {
    imports: ["Stat"],
    examples: [
      { name: "up", title: "Up", description: "A rise, with its period." },
      { name: "down", title: "Down", description: "A fall, said in words next to the arrow." },
      { name: "flat", title: "Flat", description: "No change." },
      { name: "plain", title: "Plain", description: "Label and value only." },
      { name: "row", title: "Row", description: "A row of stats, as a dashboard shows them." },
    ],
  },
} satisfies ComponentMeta;
