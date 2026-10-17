import type { ComponentMeta } from "./types";

export const meta = {
  title: "Sankey",
  summary: "Flows between stages — credits from plans to models to outcomes — with widths proportional to the amounts.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#280", reason: "Advanced tier: no phone screen needs it yet." }, desktop: "web" },
  engine: "echarts",
  whenToUse: ["Where an amount goes, in two or three steps: credits by plan, then by model, then by outcome.", "A journey with branches: viewers from sources to subscriptions."],
  whenNotToUse: [{ when: "A single sequence of stages that only loses people.", use: "funnel" }, { when: "A split at one level.", use: "pie-chart" }],
  bestPractices: ["Keep to about a dozen nodes; group the small flows.", "Use `vertical` on narrow screens."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "The keyboard walks the flows; the table lists every source, target and amount."] },
  related: ["funnel", "treemap", "pie-chart"],
  web: {
    entry: "sankey",
    imports: ["Sankey"],
    examples: [{ name: "credit-flow", title: "Credit flow", description: "A month of Orazaka credits, from plans to models to outcomes." }],
  },
} satisfies ComponentMeta;
