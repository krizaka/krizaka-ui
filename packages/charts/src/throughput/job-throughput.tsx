"use client";
// Jobs per period, stacked by status (Orazaka insights, the console's supervision, the mobile Jobs screen): the total
// and the success rate of the finished jobs written above, `live` for a stream. A stacked BarChart preset.
import { useMemo } from "react";

import { BarChart } from "../bar/bar-chart";
import type { CartesianProps } from "../cartesian/cartesian";
import { valueFormatter } from "../core/format";
import type { Accessor, CategoryFormat, Datum, SeriesSpec } from "../core/types";
import { Kpi } from "../needs/kpi";
import { THROUGHPUT_LABELS, type ThroughputLabels } from "../needs/labels";
import { fillIn, successRate, total } from "../needs/model";
import { DEFAULT_STATUSES, type JobStatus } from "../needs/statuses";
import { useSettings } from "../web/frame";

export interface JobThroughputProps<T extends Datum>
  extends Omit<CartesianProps<T>, "y" | "yLabel" | "series" | "format" | "x" | "xFormat" | "labels"> {
  /** The field (or function) of the period. Default `"day"`. */
  x?: Accessor<T, unknown>;
  /** How the periods are written. Default `"day"` (`Oct 11`); `"time"` for hours. */
  period?: CategoryFormat;
  /** The statuses, in stacking order, with their field, name and tone. Default: completed, failed, running, queued. */
  statuses?: readonly JobStatus[];
  /** Hide the total and the success rate above the bars. */
  hideSummary?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<ThroughputLabels>;
}

/** Jobs per period, stacked by status, with the total and the success rate. */
export function JobThroughput<T extends Datum>({
  x = "day" as Accessor<T, unknown>,
  period = "day",
  statuses = DEFAULT_STATUSES,
  hideSummary,
  labels: given,
  description,
  data,
  ...props
}: JobThroughputProps<T>) {
  const words = { ...THROUGHPUT_LABELS, ...given };
  const { locale } = useSettings(props as CartesianProps<T>);
  const series = useMemo<SeriesSpec<T>[]>(
    () => statuses.map((s) => ({ key: s.key as Accessor<T, number | null | undefined>, label: s.label, color: s.tone })),
    [statuses],
  );
  const sum = (outcome?: "succeeded" | "failed") =>
    statuses.filter((s) => outcome === undefined || s.outcome === outcome).reduce((n, s) => n + total(data, s.key as Accessor<T, number>), 0);
  const rate = successRate(sum("succeeded"), sum("failed"));
  const summary = hideSummary ? null : (
    <Kpi
      value={valueFormatter("integer", locale)(sum())}
      label={fillIn(words.total, { count: data.length })}
      delta={rate == null ? null : fillIn(words.success, { rate: valueFormatter("percent", locale)(rate) })}
    />
  );
  return (
    <BarChart
      {...props}
      data={data}
      x={x}
      xFormat={period}
      series={series}
      format="integer"
      stacked
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
