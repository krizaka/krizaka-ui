"use client";
// A creator's earnings per period (a creator platform's earnings page, a console's treasury): bars of the net amount in money minor
// units, the total and the last period's change written above, the payout threshold as a line. A BarChart preset:
// the money format, the period format and the words are chosen for the need.
import { useMemo } from "react";

import { BarChart } from "../bar/bar-chart";
import type { CartesianProps } from "../cartesian/cartesian";
import { valueFormatter } from "../core/format";
import type { Accessor, CategoryFormat, Datum, SeriesSpec, Threshold } from "../core/types";
import { Kpi, toneOf } from "../needs/kpi";
import { EARNINGS_LABELS, type EarningsLabels } from "../needs/labels";
import { direction, fillIn, lastChange, numberOf, signedPercent, total } from "../needs/model";
import { useSettings } from "../web/frame";

export interface EarningsChartProps<T extends Datum>
  extends Omit<CartesianProps<T>, "y" | "yLabel" | "series" | "format" | "x" | "xFormat" | "thresholds" | "labels"> {
  /** The field (or function) of the period: an ISO month (`"2026-04"`), a day. Default `"month"`. */
  x?: Accessor<T, unknown>;
  /** The net amount of each period, in **minor units** (cents), as the ledger stores it. */
  net: Accessor<T, number | null | undefined>;
  /** The gross amount (before fees), drawn beside the net when given. */
  gross?: Accessor<T, number | null | undefined>;
  /** The ISO 4217 currency (`"USD"`, `"EUR"`). */
  currency: string;
  /** How the periods are written. Default `"month"` (`Apr 2026`). */
  period?: CategoryFormat;
  /** The minimum to withdraw, drawn as a line: `{ value: 5000, label: "Payout threshold" }`. */
  payoutThreshold?: Threshold;
  /** Hide the total and the change above the bars. */
  hideSummary?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<EarningsLabels>;
}

/** Earnings per period in money — the total, the change of the last period, the payout threshold. */
export function EarningsChart<T extends Datum>({
  x = "month" as Accessor<T, unknown>,
  net,
  gross,
  currency,
  period = "month",
  payoutThreshold,
  hideSummary,
  labels: given,
  description,
  data,
  ...props
}: EarningsChartProps<T>) {
  const words = { ...EARNINGS_LABELS, ...given };
  const { locale } = useSettings(props as CartesianProps<T>);
  const format = { style: "money", currency } as const;
  const series = useMemo<SeriesSpec<T>[]>(
    () => (gross ? [{ key: gross, label: words.gross, color: 2 }, { key: net, label: words.net, color: 1 }] : [{ key: net, label: words.net, color: 1 }]),
    [gross, net, words.gross, words.net],
  );
  const values = data.map((row, i) => numberOf(row, net, i));
  const change = lastChange(values);
  const way = direction(change);
  const summary = hideSummary ? null : (
    <Kpi
      value={valueFormatter(format, locale)(total(data, net))}
      label={fillIn(words.total, { count: data.length })}
      delta={change == null ? null : fillIn(words.change, { change: signedPercent(change, locale) })}
      direction={way}
      tone={toneOf(way, "up")}
    />
  );
  return (
    <BarChart
      {...props}
      data={data}
      x={x}
      series={series}
      format={format}
      xFormat={period}
      thresholds={payoutThreshold ? [{ tone: "success", ...payoutThreshold }] : undefined}
      description={
        description || summary ? (
          <>
            {description}
            {description && summary ? <br /> : null}
            {summary}
          </>
        ) : undefined
      }
    />
  );
}
