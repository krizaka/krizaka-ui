import type { ComponentMeta } from "./types";

export const meta = {
  title: "Price ticker",
  summary: "A live auction's price: the current bid in large, the change since the opening and the number of bids, the bids as steps, the reserve as a line.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  engine: "svg",
  whenToUse: ["An auction room, on the web and in the app: the bids as they arrive.", "Any price that moves by discrete steps: a bid, a quote, an offer."],
  whenNotToUse: [
    { when: "A price series over days with open, high, low and close.", use: "candlestick" },
    { when: "Money per period.", use: "earnings-chart" },
  ],
  bestPractices: [
    "Pass every bid with its time; the opening price and time give the first step.",
    "Keep `live` on (the default) while the auction runs: no entrance, no announcement of every bid.",
    "Announce a new bid in the app's own live region (who outbid whom): the chart does not.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot, then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the bids: each price and time is announced." },
    ],
    notes: ["The current price and the change are written above the plot; the arrow is decorative.", "The reserve is drawn and named until it is met."],
  },
  related: ["line-chart", "goal-progress", "sparkline"],
  web: {
    entry: "ticker",
    imports: ["PriceTicker"],
    examples: [
      { name: "auction-room", title: "Auction room", description: "Eight bids in an auction, the reserve met." },
      { name: "no-bid-yet", title: "No bid yet", description: "The opening price, the reserve ahead." },
    ],
  },
  native: {
    imports: ["PriceTicker"],
    differences: ["The current price and the change are a headline above the plot.", "No dots on the steps; no data table or export."],
    examples: [{ name: "auction-room", title: "Auction room", description: "The auction screen of the app." }],
  },
} satisfies ComponentMeta;
