import type { ComponentMeta } from "./types";

export const meta = {
  title: "Job throughput",
  summary: "Jobs per period stacked by status, with the total and the success rate of the finished jobs written above.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  engine: "svg",
  whenToUse: [
    "Orazaka's insights and the console's supervision: jobs per day by status.",
    "The mobile Jobs screen: the total and the success rate first, the week's bars under them.",
    "Any queue whose items end in success or failure: uploads, payouts, transcodes.",
  ],
  whenNotToUse: [
    { when: "Money per period.", use: "earnings-chart" },
    { when: "How long the jobs take.", use: "latency-chart" },
    { when: "The share of each kind of job, without time.", use: "pie-chart" },
  ],
  bestPractices: [
    "Pass the statuses translated, in the order they should stack: the finished ones at the bottom.",
    "Mark the statuses that end a job with `outcome`: only they count in the success rate.",
    "Set `live` when the counts stream in: no entrance on every update.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot, then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the periods: each one's counts by status are announced." },
    ],
    notes: [
      "The statuses wear the status tones and are named in the legend: the colour is never alone.",
      "The total and the success rate are written above the chart, in words.",
    ],
  },
  related: ["bar-chart", "latency-chart", "pie-chart"],
  web: {
    entry: "throughput",
    imports: ["JobThroughput"],
    examples: [
      { name: "week-of-jobs", title: "A week of jobs", description: "Seven days of Orazaka jobs by status, the success rate above." },
      { name: "live-hours", title: "Live, per hour", description: "The last hours, `live`, with the console's own statuses." },
    ],
  },
  native: {
    imports: ["JobThroughput"],
    differences: ["The total and the success rate are a headline above the chart.", "No data table or export: swipe on the chart to hear each period."],
    examples: [{ name: "week-of-jobs", title: "A week of jobs", description: "The mobile Jobs screen: the week's jobs by status." }],
  },
} satisfies ComponentMeta;
