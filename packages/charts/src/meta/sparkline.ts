import type { ComponentMeta } from "./types";

export const meta = {
  title: "Sparkline",
  summary: "A word-sized trend without axes — in a stat, a table cell or a sentence — drawn on the server when its width is known.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "Beside a key figure: the last 30 days of a stat.",
    "In a table, one per row: each model's throughput, each video's views.",
  ],
  whenNotToUse: [
    { when: "When the reader needs the values, the axes or a comparison.", use: "line-chart" },
    { when: "A value against a range.", use: "gauge" },
  ],
  bestPractices: [
    "Give it a `width` in a table: it renders on the server, with no placeholder.",
    "Colour by the trend with `trendTone` (`\"inverse\"` when down is good: costs, latency).",
    "Write the current value next to it: the line shows the shape, not the figure.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Its title is visually hidden but names it; its summary (first, last, extremes, trend) is read.",
      "It does not take the focus: it is a picture of the trend, the figures are in the summary and its table.",
    ],
  },
  related: ["line-chart", "gauge", "bar-chart"],
  web: {
    entry: "sparkline",
    imports: ["Sparkline"],
    examples: [
      { name: "stat-trend", title: "In a stat", description: "Thirty days of views beside the figure, coloured by the trend." },
      { name: "table-rows", title: "In a table", description: "One fixed-width sparkline per row, drawn on the server: latency, coloured inverse." },
      { name: "bars", title: "Bars", description: "Discrete counts: jobs per hour." },
    ],
  },
  native: {
    imports: ["Sparkline"],
    differences: ["No threshold line."],
    examples: [{ name: "stat-trend", title: "In a stat", description: "Thirty days of views, coloured by the trend." }],
  },
} satisfies ComponentMeta;
