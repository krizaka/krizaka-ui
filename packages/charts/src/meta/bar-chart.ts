import type { ComponentMeta } from "./types";

export const meta = {
  title: "Bar chart",
  summary: "Amounts compared across categories: grouped, stacked or horizontal bars, each value written at its tip.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "Counts per category or per period: jobs per day by status, revenue per plan.",
    "A ranking with long names, as horizontal bars: top supporters, busiest models.",
    "The parts of a total per category, stacked: completed, failed and queued jobs.",
  ],
  whenNotToUse: [
    { when: "A continuous trend over many points.", use: "line-chart" },
    { when: "Two dimensions of the same measure (weekday × hour).", use: "heatmap" },
    { when: "Stages that lose people on the way.", use: "funnel" },
  ],
  bestPractices: [
    "Sort a ranking by value; keep time in its own order.",
    "Bars always start at zero: a bar's length is its value.",
    "Stack at most four parts; give each a word in the legend, never a colour alone.",
    "Use the status tones (`color: \"danger\"`) for statuses only, never for an ordinary series.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the points one by one: each is announced and its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last point." },
      { keys: "Esc", action: "Hides the tooltip and clears the active point." },
      { keys: "Enter", action: "Selects the active bar (calls `onSelect` with its row)." },
    ],
    notes: [
      "The plot is a group named by the title and described by a summary written from the data (extremes, trend), read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "Colour never carries a meaning alone: a legend from two series, direct labels, the table.",
      "The entrance plays once, when the chart comes on screen, and never under reduced motion.",
      "A 2 px gap separates the stacked segments, so neighbours stay apart without relying on their colours.",
    ],
  },
  related: ["line-chart", "area-chart", "funnel", "heatmap"],
  web: {
    entry: "bar",
    imports: ["BarChart"],
    examples: [
      { name: "jobs-by-status", title: "Jobs by status", description: "A week of Orazaka jobs per day, stacked by status in the status tones." },
      { name: "top-supporters", title: "Ranking", description: "Horizontal bars: a creator's top supporters, the value at each tip." },
      { name: "plans-by-quarter", title: "Grouped", description: "Revenue per plan, grouped by quarter." },
    ],
  },
  native: {
    imports: ["BarChart"],
    differences: [
      "Vertical bars only (no `horizontal`), no value labels at the tips.",
      "No data table or export: swipe up and down on the chart to hear each category.",
    ],
    examples: [{ name: "jobs-by-status", title: "Jobs by status", description: "A week of jobs, stacked by status." }],
  },
} satisfies ComponentMeta;
