import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Stat",
  summary: "A key figure: a label, a value in tabular digits, a hint and a trend said in words.",
  status: "stable",
  category: "data-display",
  domain: "data-display",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "The phone dashboards (a creator's earnings, Orazaka usage) write a figure and its caption by hand." }, desktop: "web" },
  whenToUse: ["On a dashboard: revenue, views, supporters.", "In a row of a few figures that compare over the same period."],
  whenNotToUse: [
    { when: "For figures inside an item's card.", use: "card" },
    { when: "For progress towards a goal.", use: "progress" },
    { when: "For a status.", use: "badge" },
  ],
  bestPractices: [
    "Format the value in the app (currency, compact numbers) with `@krizaka/intl`.",
    "In a narrow column (a side panel, 26 rem) use `StatGrid variant=\"strip\"`, never four `Stat`s stacked full width.",
    "Put a `Sparkline` of @krizaka/charts (or a `Meter`) in `chart`: the figure first, its shape under it.",
    "Say the change in `trendLabel` (“+12 %”) and the period in `hint`: the arrow alone says nothing.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The arrow is decorative; `trendLabel` is read and shown.", "Colour is never the only signal of the trend.", "The strip is a description list: each figure reads its label, its value, then its trend in words; a truncated label keeps its full text as its title."],
  },
  related: ["card", "badge", "progress"],
  web: {
    imports: ["Stat", "StatGrid"],
    examples: [
      { name: "up", title: "Up", description: "A rise, with its period." },
      { name: "down", title: "Down", description: "A fall, said in words next to the arrow." },
      { name: "flat", title: "Flat", description: "No change." },
      { name: "plain", title: "Plain", description: "Label and value only." },
      { name: "row", title: "Row", description: "A row of stats, as a dashboard shows them." },
      { name: "strip", title: "Strip", description: "`StatGrid variant=\"strip\"`: two to four figures in one row, each with a sparkline (64 × 18) and its trend in words; a `period` slot takes the switch." },
      { name: "grid", title: "Grid", description: "`StatGrid`: figures that wrap, hairlines between them, a meter under one (or a `Sparkline` of @krizaka/charts in `chart`)." },
    ],
  },
} satisfies ComponentMeta;
