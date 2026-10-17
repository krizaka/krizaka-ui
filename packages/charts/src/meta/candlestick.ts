import type { ComponentMeta } from "./types";

export const meta = {
  title: "Candlestick",
  summary: "Open, high, low and close per period, rising candles hollow and falling ones filled, the volume in its own panel, zoom and thresholds.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#280", reason: "Advanced tier: no phone screen needs it yet." }, desktop: "web" },
  engine: "echarts",
  whenToUse: ["A price that moves within each period: an auction's bids per hour, a credit's market price per day."],
  whenNotToUse: [{ when: "One value per period.", use: "line-chart" }],
  bestPractices: ["Give the reserve or the target as a threshold.", "Past forty periods the chart zooms on the last forty; the wheel and a drag move through the rest."],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and highlighted, its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the highlight." },],
    notes: ["The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "The engine (ECharts core and this one chart type) loads when the chart nears the screen; a skeleton of the same height holds its place, so nothing shifts.",
      "Under reduced motion the chart is drawn without animation.", "Rising candles are hollow and falling ones filled: the shape says the direction, not only green and red."],
  },
  related: ["line-chart", "bar-chart"],
  web: {
    entry: "candlestick",
    imports: ["Candlestick"],
    examples: [{ name: "auction-bids", title: "Auction bids", description: "An Orochia auction's bids per hour, with the volume and the reserve price." }],
  },
} satisfies ComponentMeta;
