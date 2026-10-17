import type { ComponentMeta } from "./types";

export const meta = {
  title: "Chart (ECharts option)",
  summary: "Any ECharts option on the Krizaka frame: the theme resolved from the tokens, the lazy engine, the states, the table, the keyboard, the export.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "The ECharts escape hatch needs the DOM; a phone draws the SVG charts of the native entry.", use: "line-chart" }, desktop: "web" },
  engine: "echarts",
  whenToUse: ["A chart type the typed components do not cover: polar bars, a sunburst, a parallel axis, a graph."],
  whenNotToUse: [{ when: "A type the package has: its props say more and its summary is written for you.", use: "line-chart" }],
  bestPractices: [
    "Pass `modules` with only what the option needs (`use([...])` in a module of yours): the default loads all of ECharts.",
    "Write `summaryText` and `table`: an option is opaque, the alternative is yours to give.",
    "Read the colours from the theme function (`theme.palette`, `theme.text2`), never hard-coded.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },],
    notes: ["The plot is a group named by the title and described by `summaryText`.", "Give `items` for the arrow keys to walk; without them the plot is not a tab stop.", "`table` is the data table, always in the page for assistive technology."],
  },
  related: ["charts-provider", "radar-chart", "heatmap"],
  web: {
    entry: "chart",
    imports: ["Chart"],
    examples: [{ name: "polar-uploads", title: "Polar bars", description: "Uploads per hour on a clock face: a type the package does not ship, with only its modules loaded." }],
  },
} satisfies ComponentMeta;
