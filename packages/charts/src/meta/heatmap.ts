import type { ComponentMeta } from "./types";

export const meta = {
  title: "Heatmap",
  summary: "A measure across two dimensions — activity by weekday and hour — in one sequential hue, with a step legend.",
  status: "beta",
  category: "charts",
  platforms: "web",
  engine: "echarts",
  whenToUse: ["When something happens: uploads by weekday and hour, errors by service and day.", "A matrix of two categorical dimensions with a value in each cell."],
  whenNotToUse: [
    { when: "One value per day over a year.", use: "calendar-heatmap" },
    { when: "Exact values matter more than the pattern.", use: "bar-chart" },
  ],
  bestPractices: ["Give the order of the rows and columns (`xCategories`, `yCategories`): weekdays in order, not as they appear.", "Keep empty cells empty: a missing value is not a zero."],
  accessibility: { keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },], notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "The cells are walked row by row; each is read with its row, column and value."] },
  related: ["calendar-heatmap", "bar-chart", "geo-map"],
  web: {
    entry: "heatmap",
    imports: ["Heatmap"],
    examples: [{ name: "upload-activity", title: "Activity by hour", description: "Uploads by weekday and hour of the day: when a community is awake." }],
  },
} satisfies ComponentMeta;
