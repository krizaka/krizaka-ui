import type { ComponentMeta } from "./types";

export const meta = {
  title: "Funnel",
  summary: "Stages that lose people on the way, with the conversion from each stage to the next and from the first written beside it.",
  status: "beta",
  category: "charts",
  platforms: "web",
  engine: "echarts",
  whenToUse: ["A sign-up or purchase journey: visit, sign-up, verification, first video, first sale."],
  whenNotToUse: [{ when: "Flows that branch.", use: "sankey" }, { when: "Stages that do not contain each other.", use: "bar-chart" }],
  bestPractices: ["Order the stages as the journey goes; each count includes the next.", "Name the columns of the table in your language (`fromFirstLabel`, `fromPreviousLabel`)."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "The summary says each step's conversion and the overall one."] },
  related: ["sankey", "bar-chart"],
  web: {
    entry: "funnel",
    imports: ["Funnel"],
    examples: [{ name: "signup", title: "Sign-up funnel", description: "Orochia's creator sign-up, from visit to first sale." }],
  },
} satisfies ComponentMeta;
