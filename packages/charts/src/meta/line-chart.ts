import type { ComponentMeta } from "./types";

export const meta = {
  title: "Line chart",
  summary: "Change over time: one line per series, the last value written at its end, thresholds, markers and a crosshair tooltip.",
  status: "beta",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "A trend over time: a creator's earnings per month, credits used per day, latency per hour.",
    "Two or three series compared over the same period (this year and last, two plans).",
    "A goal or a limit to read against the trend: a payout threshold, an objective, with `thresholds`.",
  ],
  whenNotToUse: [
    { when: "Amounts compared across categories that are not time.", use: "bar-chart" },
    { when: "A volume whose parts add up to a total over time.", use: "area-chart" },
    { when: "A trend in a sentence, a table cell or a stat tile.", use: "sparkline" },
  ],
  bestPractices: [
    "Give dates as ISO strings (`2026-04`, `2026-04-12`): the axis writes them in the reader's locale, by their precision.",
    "Store money as integer minor units and say so with `format={{ style: \"money\", currency }}`: the axis goes compact, the tooltip exact.",
    "Keep to three series or fewer; past that, split into small multiples or fold the rest into one series.",
    "Dash a forecast or a previous period (`dashed`), never a different colour for the same measure.",
    "Write the title as what the chart answers (“Earnings, last 6 months”): it is the accessible name.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the points one by one: each is announced and its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last point." },
      { keys: "Esc", action: "Hides the tooltip and clears the active point." },
      { keys: "Enter", action: "Selects the active point (calls `onSelect` with its row)." },
    ],
    notes: [
      "The plot is a group named by the title and described by a summary written from the data (extremes, trend), read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "Colour never carries a meaning alone: a legend from two series, direct labels, the table.",
      "The entrance plays once, when the chart comes on screen, and never under reduced motion.",
    ],
  },
  related: ["area-chart", "bar-chart", "sparkline", "charts-provider"],
  web: {
    entry: "line",
    imports: ["LineChart"],
    examples: [
      { name: "creator-earnings", title: "Creator earnings", description: "Six months of a creator's earnings and tips in euros, with the payout threshold." },
      { name: "forecast", title: "Forecast", description: "The months to come dashed after the actual ones, a marker on a launch." },
      { name: "live-jobs", title: "Live data", description: "A sliding window of jobs per minute, appended as they arrive (`useSlidingWindow`, `live`)." },
      { name: "states", title: "Loading, empty, error", description: "The three states at the chart's own height: no layout shift when the data arrives." },
    ],
  },
  native: {
    imports: ["LineChart"],
    differences: [
      "No data table or export: the plot is one adjustable element whose label is the title and the summary; swipe up and down to hear each point.",
      "A tap selects the nearest point and writes it under the chart; no hover.",
      "No markers, no end labels; `scheme` and `theme` (from @krizaka/ui/native's `useTheme()`) follow the app's theme.",
    ],
    examples: [{ name: "creator-earnings", title: "Creator earnings", description: "Six months of earnings and tips, the payout threshold." }],
  },
} satisfies ComponentMeta;
