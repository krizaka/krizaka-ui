import type { ComponentMeta } from "./types";

export const meta = {
  title: "Calendar heatmap",
  summary: "One cell a day over a year, weeks in columns, in one sequential hue: streaks, rhythms and gaps at a glance.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#280", reason: "Advanced tier: no phone screen needs it yet." }, desktop: "web" },
  engine: "echarts",
  whenToUse: ["A daily habit or activity over months: publications, contributions, active days."],
  whenNotToUse: [{ when: "Two categorical dimensions (weekday × hour).", use: "heatmap" }, { when: "A trend over time.", use: "line-chart" }],
  bestPractices: ["Pass ISO dates (`2026-04-12`): the month and weekday names come from the locale.", "Leave days without activity out of the data: they are drawn empty."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "The summary says the total, the busiest day and the number of active days."] },
  related: ["heatmap", "line-chart", "bar-chart"],
  web: {
    entry: "heatmap",
    imports: ["CalendarHeatmap"],
    examples: [{ name: "publishing", title: "A year of publishing", description: "A creator's videos published per day over a year." }],
  },
} satisfies ComponentMeta;
