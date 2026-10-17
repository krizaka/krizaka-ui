import type { ComponentMeta } from "./types";

export const meta = {
  title: "Latency chart",
  summary: "Median and 95th-percentile latency per item, in the unit that fits (ms, s, min), against a service objective.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  engine: "svg",
  whenToUse: [
    "The console's supervision: latency per capability against the objective.",
    "Orazaka's “time to result” per kind of job, where seconds turn into minutes.",
    "Any duration compared across items: a model, a region, an endpoint.",
  ],
  whenNotToUse: [
    { when: "A duration over time (the latency of the last hours).", use: "line-chart" },
    { when: "How many jobs ran.", use: "job-throughput" },
  ],
  bestPractices: [
    "Pass milliseconds: the chart picks the unit for each value.",
    "Show the p95 beside the median: the median alone hides the slow tail people feel.",
    "Name the objective in its label (“Objective”: the line writes its value).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot, then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items: the median and the p95 of each are announced." },
    ],
    notes: [
      "The slowest p95 and the number of items past the objective are written above the chart.",
      "Durations are written with their unit everywhere: axis, tooltip, table and summary.",
    ],
  },
  related: ["bar-chart", "job-throughput", "line-chart"],
  web: {
    entry: "latency",
    imports: ["LatencyChart", "formatDuration"],
    examples: [
      { name: "by-capability", title: "By capability", description: "The console: p50 and p95 per capability against a 2 s objective." },
      { name: "time-to-result", title: "Time to result", description: "Orazaka: the median time to a result per kind of job, in minutes when it takes minutes." },
    ],
  },
  native: {
    imports: ["LatencyChart"],
    differences: ["Vertical bars only (no `vertical` prop): keep the names short.", "The slowest p95 is a headline above the chart."],
    examples: [{ name: "by-capability", title: "By capability", description: "The latency per capability, on a phone." }],
  },
} satisfies ComponentMeta;
