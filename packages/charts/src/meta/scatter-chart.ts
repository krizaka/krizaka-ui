import type { ComponentMeta } from "./types";

export const meta = {
  title: "Scatter chart",
  summary: "The relation between two measures, a bubble's area for a third, a colour per group, and the correlation said in words.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#280", reason: "Advanced tier: no phone screen needs it yet." }, desktop: "web" },
  engine: "echarts",
  whenToUse: ["Whether two measures move together: a video's length and its watch time, a job's input and its duration.", "Outliers in a population."],
  whenNotToUse: [{ when: "A trend over time.", use: "line-chart" }, { when: "Measures of a few entities on a common scale.", use: "radar-chart" }],
  bestPractices: ["Keep to three groups: past that, colours stop reading apart for everyone.", "Use `renderer=\"canvas\"` past a few thousand points."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "The summary gives both ranges and Pearson's correlation."] },
  related: ["line-chart", "radar-chart", "heatmap"],
  web: {
    entry: "scatter",
    imports: ["ScatterChart"],
    examples: [{ name: "watch-time", title: "Length and watch time", description: "Orochia videos: length against average watch time, bubbles by views, a colour per format." }],
  },
} satisfies ComponentMeta;
