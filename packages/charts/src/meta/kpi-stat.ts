import type { ComponentMeta } from "./types";

export const meta = {
  title: "KPI stat",
  summary: "A key figure with its change against the previous period and a sparkline of the period, on the kit's Stat.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "web",
  whenToUse: [
    "The head of a dashboard: jobs, success rate, time to a result, spend.",
    "Anywhere a figure needs its direction and its shape at a glance.",
  ],
  whenNotToUse: [
    { when: "A chart the reader will explore.", use: "line-chart" },
    { when: "A value against a limit.", use: "gauge" },
  ],
  bestPractices: [
    "Pass `previous` and the trend is computed and written in words; the arrow is only decoration.",
    "Use `good=down` for latency, failures and spend: the arrow's colour says whether the change is good news.",
    "Put several in a `StatGrid` of the kit: they wrap with the width.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
    "The change is written (`+24 % vs previous period`), never colour or arrow alone.",
    "The sparkline has its own accessible summary; the figure is read as text.",
    ],
  },
  related: ["chart-card", "sparkline", "gauge"],
  web: {
    entry: "card",
    imports: ["KpiStat"],
    examples: [
      { name: "dashboard-row", title: "A dashboard row", description: "Four figures in a StatGrid, with sparklines and trends." },
      { name: "single", title: "One figure", description: "A rise in latency is bad: good=down." },
    ],
  },
} satisfies ComponentMeta;
