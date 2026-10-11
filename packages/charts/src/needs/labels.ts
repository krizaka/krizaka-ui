// The words of the ready-made charts: English by default, an app passes its own (translated) through `labels`.
// Placeholders are written `{name}`.

export interface EarningsLabels {
  /** Under the total: `earned over {count} months`. `{count}` is the number of periods. */
  total: string;
  /** The change of the last period: `{change} vs the previous month`. */
  change: string;
  /** The gross series' name. */
  gross: string;
  /** The net series' name. */
  net: string;
}

export const EARNINGS_LABELS: EarningsLabels = {
  total: "earned over {count} periods",
  change: "{change} vs the previous period",
  gross: "Gross",
  net: "Net",
};

export interface ThroughputLabels {
  /** Under the total: `jobs over {count} days`. */
  total: string;
  /** The success rate of the finished jobs: `{rate} succeeded`. */
  success: string;
}

export const THROUGHPUT_LABELS: ThroughputLabels = { total: "jobs over {count} periods", success: "{rate} succeeded" };

export interface LatencyLabels {
  /** The median series. */
  p50: string;
  /** The 95th percentile series. */
  p95: string;
  /** The slowest p95: `slowest: {name}`. */
  slowest: string;
  /** How many go past the objective: `{count} over the objective`. */
  over: string;
  /** All within the objective. */
  within: string;
}

export const LATENCY_LABELS: LatencyLabels = {
  p50: "Median (p50)",
  p95: "p95",
  slowest: "p95 of {name}, the slowest",
  over: "{count} over the objective",
  within: "all within the objective",
};

export interface CreditLabels {
  /** Under the remaining amount: `left of {limit}`. */
  remaining: string;
  /** The used part: `{used} used ({percent})`. */
  used: string;
  /** The projection: `at this pace, runs out on {date}`. */
  runsOut: string;
  /** No use lately: it does not run out. */
  steady: string;
  /** The renewal: `renews on {date}`. */
  renews: string;
  /** The daily use sparkline's title. */
  daily: string;
}

export const CREDIT_LABELS: CreditLabels = {
  remaining: "left of {limit}",
  used: "{used} used ({percent})",
  runsOut: "At this pace, runs out on {date}",
  steady: "No use lately",
  renews: "Renews on {date}",
  daily: "Use per day",
};

export interface GoalLabels {
  /** Under the amount: `raised of {goal}`. */
  raised: string;
  /** Reached: `goal reached`. */
  reached: string;
  /** The supporters: `{count} supporters`. */
  supporters: string;
  /** The time left: `{time} left`. */
  left: string;
}

export const GOAL_LABELS: GoalLabels = { raised: "raised of {goal}", reached: "Goal reached", supporters: "{count} supporters", left: "{time} left" };

export interface TickerLabels {
  /** Under the price: `current bid`. */
  current: string;
  /** The change since the opening: `{change} since the opening ({count} bids)`. */
  change: string;
  /** No bid yet: `opening price`. */
  opening: string;
  /** The reserve line. */
  reserve: string;
  /** The series' name. */
  price: string;
}

export const TICKER_LABELS: TickerLabels = {
  current: "current bid",
  change: "{change} since the opening · {count} bids",
  opening: "opening price, no bid yet",
  reserve: "Reserve price",
  price: "Price",
};
