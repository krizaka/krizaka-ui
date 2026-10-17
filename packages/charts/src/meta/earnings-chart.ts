import type { ComponentMeta } from "./types";

export const meta = {
  title: "Earnings chart",
  summary: "Earnings per period in money: the bars of the net amount, the total and the last period's change written above, the payout threshold as a line.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  engine: "svg",
  whenToUse: [
    "A creator's earnings page: net earnings per month, with the minimum to withdraw (Orochia /earnings).",
    "A treasury view: gross and net per month side by side (Orochia's console).",
    "The earnings card of the mobile app: the total in large, the bars under it.",
  ],
  whenNotToUse: [
    { when: "A count that is not money (jobs, views).", use: "job-throughput" },
    { when: "A trend over many points (a year of days).", use: "line-chart" },
    { when: "One figure against a goal.", use: "goal-progress" },
  ],
  bestPractices: [
    "Pass the amounts in minor units (cents) as the ledger stores them, and the currency: the chart writes them.",
    "Keep the periods in time order; the change compares the last two periods.",
    "Say what the threshold means in its label (“Payout threshold”), never only its amount.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot, then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the periods one by one: each amount is announced." },
    ],
    notes: [
      "The total and the change are written in words under the title; the arrow beside the change is decorative.",
      "The plot is described by a summary written from the data and backed by a data table, as every chart of the package.",
    ],
  },
  related: ["bar-chart", "goal-progress", "sparkline"],
  web: {
    entry: "earnings",
    imports: ["EarningsChart"],
    examples: [
      { name: "creator-month", title: "A creator's months", description: "Six months of net earnings, the payout threshold, the change of the last month." },
      { name: "gross-and-net", title: "Gross and net", description: "The treasury: gross and net per month side by side." },
    ],
  },
  native: {
    imports: ["EarningsChart"],
    differences: ["The total and the change sit above the chart as a headline (the first thing a phone shows), not in the description.", "No data table or export: swipe on the chart to hear each period."],
    examples: [{ name: "creator-month", title: "A creator's months", description: "The mobile earnings card: the total first, the bars under it." }],
  },
} satisfies ComponentMeta;
