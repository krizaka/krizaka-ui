// The price of a live auction, shared by the web and React Native: the points to draw (the opening, then each bid)
// and what the headline says (the current price, the change since the opening, the number of bids).

/** A bid: when (an ISO date-time or a `Date`) and how much, in money minor units. */
export interface Bid {
  readonly at: string | Date;
  readonly amount: number;
}

export interface TickerModel {
  readonly points: readonly { readonly at: string | Date; readonly amount: number }[];
  readonly current: number;
  readonly change: number;
  readonly ratio: number | null;
  readonly count: number;
}

/** The opening point (when `openedAt` is known), then the bids in time order. */
export function tickerModel(bids: readonly Bid[], opening: number, openedAt?: string | Date): TickerModel {
  const sorted = [...bids].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  const points = [...(openedAt ? [{ at: openedAt, amount: opening }] : []), ...sorted];
  const current = sorted.length > 0 ? sorted[sorted.length - 1].amount : opening;
  return { points, current, change: current - opening, ratio: opening > 0 ? current / opening - 1 : null, count: sorted.length };
}
