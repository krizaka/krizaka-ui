import type { ComponentMeta } from "./types";

export const meta = {
  title: "Generated view catalog",
  summary: "KpiStat and ChartCard as entries of the data-driven UI catalog (A2UI v0.9): a model's answer draws figures and charts from data, never code.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/orazaka#207", reason: "Slice 3 of the data-driven UI epic: the same messages drawn by the native charts." }, desktop: "web" },
  whenToUse: [
    "With `GenUiStream` of @krizaka/ui: merge `chartsGenUiCatalog` with `baseGenUiCatalog` so a model's answer can hold figures and charts.",
    "When an assistant answers a question about data with a dashboard the reader can then refine.",
  ],
  whenNotToUse: [
    { when: "A dashboard the app knows in advance: use the charts directly.", use: "chart-card" },
    { when: "One figure in a page.", use: "kpi-stat" },
  ],
  bestPractices: [
    "Tell the model the catalog and that every number must come from the data it was given: the entries check shapes, not truth.",
    "Formats are a closed list (number, integer, compact, percent, money with a currency): no free-form format string reaches the chart.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Each generated chart keeps its title as accessible name, its written summary and its data table, as any chart of the package."],
  },
  related: ["kpi-stat", "chart-card", "line-chart", "bar-chart", "pie-chart"],
  web: {
    entry: "genui",
    imports: ["chartsGenUiCatalog"],
    examples: [{ name: "dashboard", title: "A generated dashboard", description: "Two figures and a chart from a model's answer, drawn with both catalogs." }],
  },
} satisfies ComponentMeta;
