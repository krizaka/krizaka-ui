import type { ComponentMeta } from "./types";

export const meta = {
  title: "Chart card",
  summary: "The frame of a chart: title, one line of insight, the chart, a footer, and the actions menu (view as table, download, copy) — used everywhere a chart is shown.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Every chart of a dashboard or a usage page: the same frame, the same hierarchy, the same actions.",
    "A chart that needs a period switch or a filter beside its actions menu.",
  ],
  whenNotToUse: [
    { when: "A figure with its trend.", use: "kpi-stat" },
    { when: "A chart that sits inside running text.", use: "sparkline" },
    { when: "On React Native: the native charts draw their own frame." },
  ],
  bestPractices: [
    "Write the insight from the data, in one line: the figure first, then the change (`100 jobs · +100 % vs last week`).",
    "Leave the chart without a title: the card hands it its own, which stays the chart's accessible name.",
    "Zoom the time axis on the period that has data with `autoRange` rather than drawing empty days.",
    "Keep the footer for the source and the freshness; never a second insight.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
    "The chart keeps its data table in the page, its written summary and its keyboard walk inside the card.",
    "The actions menu is a real menu: arrow keys, Escape, focus returned to the ⋯ button; the table opens in a sheet with a focus trap.",
    "Legend chips are toggle buttons (`aria-pressed`); the last visible series cannot be switched off.",
    ],
  },
  related: ["kpi-stat", "line-chart", "bar-chart", "pie-chart", "sparkline"],
  web: {
    entry: "card",
    imports: ["ChartCard"],
    examples: [
      { name: "jobs-activity", title: "Jobs per day", description: "Stacked bars by outcome, an insight, a footer and the actions menu." },
      { name: "usage-donut", title: "What you made", description: "A donut whose legend chips carry values and filter the ring." },
      { name: "sparse-and-empty", title: "Sparse and empty", description: "The time axis zoomed on the active period, and a calm empty state." },
      { name: "before-after", title: "Before and after", description: "The same chart bare, then in a ChartCard." },
    ],
  },
  native: {
    imports: ["ChartCard"],
    differences: ["No actions menu (table, CSV, PNG): a phone reads the chart's summary and walks its points; `actions` holds a period switch.", "Give the chart `hideTitle`: the card's title names it."],
    examples: [{ name: "earnings", title: "Earnings", description: "Six months of earnings, the insight in one line, the source under it." }],
  },
} satisfies ComponentMeta;
