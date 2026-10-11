import type { ComponentMeta } from "./types";

export const meta = {
  title: "Radar chart",
  summary: "Several measures of a few entities at once — models compared on quality, speed, cost — on axes around a centre.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  engine: "echarts",
  whenToUse: ["Two or three entities compared on five to eight measures of the same scale (scores out of 100)."],
  whenNotToUse: [
    { when: "Measures of different units or scales.", use: "bar-chart" },
    { when: "More than three entities: the shapes overlap.", use: "heatmap" },
  ],
  bestPractices: ["Normalise the measures to one scale (0–100) and say it in the description.", "Orient every axis the same way: higher is better."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation."] },
  related: ["bar-chart", "heatmap", "scatter-chart"],
  web: {
    entry: "radar",
    imports: ["RadarChart"],
    examples: [{ name: "model-comparison", title: "Model comparison", description: "Two Orazaka models scored on five measures, out of 100." }],
  },
} satisfies ComponentMeta;
