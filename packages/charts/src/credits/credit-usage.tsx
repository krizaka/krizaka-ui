"use client";
// What is left of a credit allowance (Orazaka's billing meter, the console's quotas, Orochia's storage plan): the
// remaining amount in large, a meter that turns to warning then danger, the use per day as a sparkline, and the day it
// runs out at the current pace. A `meter` for assistive technology, its value said in words.
import { type CSSProperties, type ReactNode, useId } from "react";

import { categoryFormatter, valueFormatter } from "../core/format";
import type { ValueFormat } from "../core/types";
import { Kpi } from "../needs/kpi";
import { CREDIT_LABELS, type CreditLabels } from "../needs/labels";
import { addDays, daysLeft, fillIn, quotaLevel } from "../needs/model";
import { Sparkline } from "../sparkline/sparkline";
import type { ChartsSettings } from "../web/context";
import { useSettings } from "../web/frame";
import { cx } from "../web/parts";
import { ChartStyles } from "../web/styles";

export interface CreditUsageProps extends Omit<ChartsSettings, "labels"> {
  /** What the allowance is (“Credits this month”): the heading and the meter's name. */
  title: string;
  /** A line under the title: the plan, the period. */
  description?: ReactNode;
  /** Visually hide the title (it stays the accessible name). */
  hideTitle?: boolean;
  /** How much is used. */
  used: number;
  /** The allowance. */
  limit: number;
  /** How the amounts are written. Default `"integer"`; a `{ style: "unit", unit: "gigabyte" }` for storage. */
  format?: ValueFormat;
  /** The use of each recent day, oldest first: the sparkline and the projection. */
  daily?: readonly (number | null)[];
  /** The days of `daily` (ISO dates), for the sparkline's summary. */
  days?: readonly unknown[];
  /** When the allowance renews (an ISO date or a `Date`). */
  renewsAt?: string | Date;
  /** Today, for the projection (pass it from the server to render the same date on both sides). Default: now. */
  now?: Date;
  /** The share where the meter turns to warning, then danger. Default `[0.8, 0.95]`. */
  levels?: readonly [number, number];
  /** The data is on its way. */
  loading?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<CreditLabels>;
  /** A class on the figure (layout). */
  className?: string;
  /** Inline style on the figure (layout only). */
  style?: CSSProperties;
}

/** What is left of an allowance: the remaining amount, a meter in tones, the use per day and the run-out date. */
export function CreditUsage({
  title,
  description,
  hideTitle,
  used,
  limit,
  format = "integer",
  daily,
  days,
  renewsAt,
  now,
  levels = [0.8, 0.95],
  loading,
  labels: given,
  className,
  style,
  ...settings
}: CreditUsageProps) {
  const words = { ...CREDIT_LABELS, ...given };
  const { locale, brand } = useSettings({ title, ...settings });
  const uid = useId();
  const write = valueFormatter(format, locale);
  const date = categoryFormatter("date", locale);
  const ratio = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0;
  const level = quotaLevel(ratio, levels[0], levels[1]);
  const remaining = Math.max(0, limit - used);
  const percent = valueFormatter("percent", locale)(ratio);
  const usedText = fillIn(words.used, { used: write(used), percent });
  const left = daily ? daysLeft(remaining, daily) : null;
  const today = now ?? new Date();
  const runOut = left == null ? null : addDays(today, left);
  const renews = renewsAt ? new Date(renewsAt) : null;
  // The run-out date only matters when it comes before the renewal.
  const projection = daily ? (runOut && (!renews || runOut < renews) ? fillIn(words.runsOut, { date: date(runOut) }) : left == null ? words.steady : null) : null;
  return (
    <figure className={cx("kzc", className)} style={style} data-kzc="" data-brand={brand} data-kind="credits" aria-labelledby={`${uid}-t`} aria-busy={loading || undefined}>
      <ChartStyles />
      <div className="kzc-heading">
        <p id={`${uid}-t`} className={hideTitle ? "kzc-sr" : "kzc-title"}>
          {title}
        </p>
        {description ? <p className="kzc-desc">{description}</p> : null}
      </div>
      <p className="kzc-desc">
        <Kpi value={loading ? "—" : write(remaining)} label={fillIn(words.remaining, { limit: write(limit) })} />
      </p>
      <div
        role="meter"
        aria-labelledby={`${uid}-t`}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(limit, Math.max(0, used))}
        aria-valuetext={usedText}
        className="kzc-meter"
        data-tone={level === "ok" ? undefined : level}
      >
        <i style={{ width: loading ? 0 : `${ratio * 100}%` }} />
      </div>
      <p className="kzc-row">
        <span>{usedText}</span>
        {renews ? <span>{fillIn(words.renews, { date: date(renews) })}</span> : null}
      </p>
      {daily && daily.length > 1 ? (
        <Sparkline title={words.daily} data={daily} categories={days} variant="bar" format={format} height={36} loading={loading} />
      ) : null}
      {projection && !loading ? (
        <p className="kzc-row">
          <b>{projection}</b>
        </p>
      ) : null}
    </figure>
  );
}
