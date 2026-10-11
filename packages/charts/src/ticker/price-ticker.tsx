"use client";
// The price of a live auction (Orochia's auction room, web and mobile): the current bid in large, what it gained since
// the opening and how many bids, the price as steps over time (a bid holds until the next), the reserve as a line.
// `live` by default: new bids redraw without an entrance and without announcing every point.
import { valueFormatter } from "../core/format";
import type { CategoryFormat, Threshold } from "../core/types";
import { LineChart, type LineChartProps } from "../line/line-chart";
import { Kpi, toneOf } from "../needs/kpi";
import { TICKER_LABELS, type TickerLabels } from "../needs/labels";
import { direction, fillIn, signedPercent } from "../needs/model";
import { type Bid, tickerModel } from "../needs/ticker";
import { useSettings } from "../web/frame";

type Point = { at: string | Date; amount: number };

export interface PriceTickerProps
  extends Omit<LineChartProps<Point>, "data" | "x" | "y" | "yLabel" | "series" | "format" | "xFormat" | "thresholds" | "curve" | "labels"> {
  /** The bids, in any order: when and how much (minor units). */
  bids: readonly Bid[];
  /** The opening price, in minor units. */
  opening: number;
  /** When the auction opened: the first point of the line. */
  openedAt?: string | Date;
  /** The ISO 4217 currency. */
  currency: string;
  /** The reserve price, drawn as a line until it is met. */
  reserve?: number;
  /** How the times are written. Default `"time"` (`14:30`); `"datetime"` for auctions over several days. */
  timeFormat?: CategoryFormat;
  /** The words, passed translated; English by default. */
  labels?: Partial<TickerLabels>;
}

/** A live auction's price: the current bid, the change since the opening, the steps of the bids, the reserve. */
export function PriceTicker({ bids, opening, openedAt, currency, reserve, timeFormat = "time", labels: given, description, live = true, ...props }: PriceTickerProps) {
  const words = { ...TICKER_LABELS, ...given };
  const { locale } = useSettings(props);
  const format = { style: "money", currency } as const;
  const write = valueFormatter(format, locale);
  const model = tickerModel(bids, opening, openedAt);
  const way = model.count > 0 ? direction(model.ratio) : null;
  const signed = `${model.change > 0 ? "+" : ""}${write(model.change)}`;
  const thresholds: Threshold[] = reserve != null && model.current < reserve ? [{ value: reserve, label: words.reserve, tone: "warning" }] : [];
  const kpi = (
    <Kpi
      value={write(model.current)}
      label={model.count > 0 ? words.current : words.opening}
      delta={
        model.count > 0
          ? fillIn(words.change, { change: model.ratio == null ? signed : `${signed} (${signedPercent(model.ratio, locale)})`, count: model.count })
          : null
      }
      direction={way}
      tone={toneOf(way, "up")}
    />
  );
  return (
    <LineChart
      {...props}
      live={live}
      data={model.points as Point[]}
      x="at"
      y="amount"
      yLabel={words.price}
      xFormat={timeFormat}
      format={format}
      curve="step"
      dots
      zero={false}
      thresholds={thresholds}
      description={
        <>
          {description}
          {description ? <br /> : null}
          {kpi}
        </>
      }
    />
  );
}
