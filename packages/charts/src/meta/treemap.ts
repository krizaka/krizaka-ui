import type { ComponentMeta } from "./types";

export const meta = {
  title: "Treemap",
  summary: "Nested parts of a whole as rectangles — storage by project then by kind — a click zooming into a part.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  engine: "echarts",
  whenToUse: ["A hierarchy of amounts: storage by project and kind, credits by team and model."],
  whenNotToUse: [{ when: "A single level of a few parts.", use: "pie-chart" }, { when: "Flows from one level to the next.", use: "sankey" }],
  bestPractices: ["Two levels read best; a third shows on zoom.", "Name the parts briefly: the labels are inside the rectangles."],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },],
    notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "Labels inside a rectangle take the text colour with the better contrast on its fill (computed, not assumed)."],
  },
  related: ["pie-chart", "sankey", "bar-chart"],
  web: {
    entry: "treemap",
    imports: ["Treemap"],
    examples: [{ name: "storage", title: "Storage by project", description: "A workspace's storage by project, then by kind of file." }],
  },
} satisfies ComponentMeta;
