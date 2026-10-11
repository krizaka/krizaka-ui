"use client";
// Latency per capability, model or kind of job (the console's supervision, Orazaka's "time to result"): the median
// and the 95th percentile side by side in horizontal bars, durations written in the unit that fits (ms, s, min), the
// service objective as a line, the slowest p95 and how many go past the objective written above.
import { useMemo } from "react";

import { BarChart } from "../bar/bar-chart";
import type { CartesianProps } from "../cartesian/cartesian";
import type { Accessor, Datum, SeriesSpec } from "../core/types";
import { Kpi } from "../needs/kpi";
import { LATENCY_LABELS, type LatencyLabels } from "../needs/labels";
import { fillIn, formatDuration, numberOf } from "../needs/model";
import { useSettings } from "../web/frame";

export interface LatencyChartProps<T extends Datum>
  extends Omit<CartesianProps<T>, "y" | "yLabel" | "series" | "format" | "x" | "xFormat" | "thresholds" | "labels"> {
  /** The field (or function) naming what is measured (a capability, a model). Default `"name"`. */
  x?: Accessor<T, unknown>;
  /** The median, in milliseconds. Default `"p50"`. */
  p50?: Accessor<T, number | null | undefined>;
  /** The 95th percentile, in milliseconds. Default `"p95"`; `null` to draw the median alone. */
  p95?: Accessor<T, number | null | undefined> | null;
  /** The service objective, in milliseconds: a line, and the count of what goes past it (by p95). */
  objective?: { readonly value: number; readonly label: string };
  /** Vertical bars instead of horizontal ones (few, short names). */
  vertical?: boolean;
  /** Hide the slowest p95 and the count over the objective. */
  hideSummary?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<LatencyLabels>;
}

/** Median and p95 latency per item, durations in the unit that fits, against a service objective. */
export function LatencyChart<T extends Datum>({
  x = "name" as Accessor<T, unknown>,
  p50 = "p50" as Accessor<T, number | null | undefined>,
  p95 = "p95" as Accessor<T, number | null | undefined>,
  objective,
  vertical,
  hideSummary,
  labels: given,
  description,
  data,
  ...props
}: LatencyChartProps<T>) {
  const words = { ...LATENCY_LABELS, ...given };
  const { locale } = useSettings(props as CartesianProps<T>);
  const series = useMemo<SeriesSpec<T>[]>(
    () => [{ key: p50, label: words.p50, color: "neutral" }, ...(p95 ? [{ key: p95, label: words.p95, color: 1 as const }] : [])],
    [p50, p95, words.p50, words.p95],
  );
  const tail = p95 ?? p50;
  const measured = data.map((row, i) => ({ row, i, value: numberOf(row, tail, i) })).filter((m) => m.value != null);
  const slowest = measured.reduce<(typeof measured)[number] | null>((a, m) => (!a || (m.value ?? 0) > (a.value ?? 0) ? m : a), null);
  const over = objective ? measured.filter((m) => (m.value ?? 0) > objective.value).length : 0;
  const nameOf = (row: T, i: number) => String(typeof x === "function" ? x(row, i) : (row as Record<string, unknown>)[x]);
  const summary =
    hideSummary || !slowest ? null : (
      <Kpi
        value={formatDuration(slowest.value ?? 0, locale)}
        label={fillIn(words.slowest, { name: nameOf(slowest.row, slowest.i) })}
        delta={objective ? (over > 0 ? fillIn(words.over, { count: over }) : words.within) : null}
        direction={objective ? (over > 0 ? "up" : "flat") : null}
        tone={over > 0 ? "danger" : "success"}
      />
    );
  return (
    <BarChart
      {...props}
      data={data}
      x={x}
      series={series}
      format={(value, l) => formatDuration(value, l)}
      horizontal={!vertical}
      thresholds={objective ? [{ ...objective, tone: "danger" }] : undefined}
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
