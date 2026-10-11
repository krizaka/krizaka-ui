// The ready-made charts for React Native, with the web's names and props: EarningsChart, JobThroughput, LatencyChart,
// CreditUsage, GoalProgress, PriceTicker. Each one is a heading, its key figure in large (the first thing a phone
// shows: the number before the chart) and the native chart under it — the same arithmetic as the web (src/needs).
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { categoryFormatter, valueFormatter } from "../core/format";
import type { Accessor, CategoryFormat, Datum, SeriesSpec, Threshold, Tone, ValueFormat } from "../core/types";
import {
  CREDIT_LABELS,
  type CreditLabels,
  EARNINGS_LABELS,
  type EarningsLabels,
  GOAL_LABELS,
  type GoalLabels,
  LATENCY_LABELS,
  type LatencyLabels,
  THROUGHPUT_LABELS,
  type ThroughputLabels,
  TICKER_LABELS,
  type TickerLabels,
} from "../needs/labels";
import { addDays, daysLeft, direction, fillIn, formatDuration, lastChange, numberOf, quotaLevel, roundMoney, signedPercent, successRate, total } from "../needs/model";
import { DEFAULT_STATUSES, type JobStatus } from "../needs/statuses";
import { type Bid, tickerModel } from "../needs/ticker";
import { BarChart, LineChart, type NativeCartesianProps } from "./cartesian";
import { type NativeChartsSettings, type NativeFrameProps, type Resolved, useNativeSettings } from "./frame";
import { Gauge, Sparkline } from "./round";

const ARROW = { up: "M7 17 17 7M8 7h9v9", down: "M7 7l10 10M17 8v9H8", flat: "M5 12h14M13 6l6 6-6 6" } as const;

function toneColor(resolved: Resolved, tone: Tone) {
  return resolved.color(tone, 1);
}

/** The heading and the key figure of a ready-made chart: the value, what it is, the change in words (arrow decorative). */
function Headline({
  resolved,
  title,
  hideTitle,
  value,
  label,
  delta,
  way,
  tone = "neutral",
}: {
  resolved: Resolved;
  title: string;
  hideTitle?: boolean;
  value: string;
  label?: string;
  delta?: string | null;
  way?: "up" | "down" | "flat" | null;
  tone?: Tone;
}) {
  const { theme } = resolved;
  return (
    <View style={styles.head}>
      {!hideTitle ? (
        <Text role="heading" style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
      ) : null}
      <View style={styles.kpi}>
        <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
        {label ? <Text style={[styles.small, { color: theme.textSecondary }]}>{label}</Text> : null}
      </View>
      {delta ? (
        <View style={styles.delta}>
          {way ? (
            <Svg width={12} height={12} viewBox="0 0 24 24" aria-hidden>
              <Path d={ARROW[way]} fill="none" stroke={toneColor(resolved, tone)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : null}
          <Text style={[styles.small, styles.strong, { color: theme.textPrimary }]}>{delta}</Text>
        </View>
      ) : null}
    </View>
  );
}

const good = (way: "up" | "down" | "flat" | null, up: boolean): Tone => (!way || way === "flat" ? "neutral" : (way === "up") === up ? "success" : "danger");

type Base<T extends Datum> = Omit<NativeCartesianProps<T>, "y" | "yLabel" | "series" | "format" | "x" | "xFormat" | "thresholds" | "labels">;

export interface NativeEarningsChartProps<T extends Datum> extends Base<T> {
  /** The field (or function) of the period. Default `"month"`. */
  x?: Accessor<T, unknown>;
  /** The net amount of each period, in minor units. */
  net: Accessor<T, number | null | undefined>;
  /** The gross amount, drawn beside the net. */
  gross?: Accessor<T, number | null | undefined>;
  /** The ISO 4217 currency. */
  currency: string;
  /** How the periods are written. Default `"month"`. */
  period?: CategoryFormat;
  /** The payout threshold, drawn as a line. */
  payoutThreshold?: Threshold;
  /** The words, passed translated. */
  labels?: Partial<EarningsLabels>;
}

/** Earnings per period in money (React Native): the total and the change first, the bars under them. */
export function EarningsChart<T extends Datum>({ x = "month" as Accessor<T, unknown>, net, gross, currency, period = "month", payoutThreshold, labels: given, title, hideTitle, data, ...props }: NativeEarningsChartProps<T>) {
  const words = { ...EARNINGS_LABELS, ...given };
  const resolved = useNativeSettings(props);
  const format = { style: "money", currency } as const;
  const change = lastChange(data.map((row, i) => numberOf(row, net, i)));
  const way = direction(change);
  const series: SeriesSpec<T>[] = gross ? [{ key: gross, label: words.gross, color: 2 }, { key: net, label: words.net, color: 1 }] : [{ key: net, label: words.net, color: 1 }];
  return (
    <View style={styles.root}>
      <Headline
        resolved={resolved}
        title={title}
        hideTitle={hideTitle}
        value={valueFormatter(format, resolved.locale)(total(data, net))}
        label={fillIn(words.total, { count: data.length })}
        delta={change == null ? null : fillIn(words.change, { change: signedPercent(change, resolved.locale) })}
        way={way}
        tone={good(way, true)}
      />
      <BarChart {...props} title={title} hideTitle data={data} x={x} series={series} format={format} xFormat={period} thresholds={payoutThreshold ? [{ tone: "success", ...payoutThreshold }] : undefined} />
    </View>
  );
}

export interface NativeJobThroughputProps<T extends Datum> extends Base<T> {
  /** The field of the period. Default `"day"`. */
  x?: Accessor<T, unknown>;
  /** How the periods are written. Default `"day"`. */
  period?: CategoryFormat;
  /** The statuses, in stacking order. Default: completed, failed, running, queued. */
  statuses?: readonly JobStatus[];
  /** The words, passed translated. */
  labels?: Partial<ThroughputLabels>;
}

/** Jobs per period stacked by status (React Native): the total and the success rate first. */
export function JobThroughput<T extends Datum>({ x = "day" as Accessor<T, unknown>, period = "day", statuses = DEFAULT_STATUSES, labels: given, title, hideTitle, data, ...props }: NativeJobThroughputProps<T>) {
  const words = { ...THROUGHPUT_LABELS, ...given };
  const resolved = useNativeSettings(props);
  const sum = (outcome?: "succeeded" | "failed") => statuses.filter((s) => outcome === undefined || s.outcome === outcome).reduce((n, s) => n + total(data, s.key as Accessor<T, number>), 0);
  const rate = successRate(sum("succeeded"), sum("failed"));
  const series = statuses.map((s) => ({ key: s.key as Accessor<T, number | null | undefined>, label: s.label, color: s.tone }));
  return (
    <View style={styles.root}>
      <Headline
        resolved={resolved}
        title={title}
        hideTitle={hideTitle}
        value={valueFormatter("integer", resolved.locale)(sum())}
        label={fillIn(words.total, { count: data.length })}
        delta={rate == null ? null : fillIn(words.success, { rate: valueFormatter("percent", resolved.locale)(rate) })}
      />
      <BarChart {...props} title={title} hideTitle data={data} x={x} xFormat={period} series={series} format="integer" stacked />
    </View>
  );
}

export interface NativeLatencyChartProps<T extends Datum> extends Base<T> {
  /** The field naming what is measured. Default `"name"`. */
  x?: Accessor<T, unknown>;
  /** The median, in milliseconds. Default `"p50"`. */
  p50?: Accessor<T, number | null | undefined>;
  /** The 95th percentile, in milliseconds. Default `"p95"`; `null` for the median alone. */
  p95?: Accessor<T, number | null | undefined> | null;
  /** The service objective, in milliseconds. */
  objective?: { readonly value: number; readonly label: string };
  /** The words, passed translated. */
  labels?: Partial<LatencyLabels>;
}

/** Median and p95 latency per item (React Native, vertical bars): the slowest p95 first. */
export function LatencyChart<T extends Datum>({
  x = "name" as Accessor<T, unknown>,
  p50 = "p50" as Accessor<T, number | null | undefined>,
  p95 = "p95" as Accessor<T, number | null | undefined>,
  objective,
  labels: given,
  title,
  hideTitle,
  data,
  ...props
}: NativeLatencyChartProps<T>) {
  const words = { ...LATENCY_LABELS, ...given };
  const resolved = useNativeSettings(props);
  const tail = p95 ?? p50;
  const measured = data.map((row, i) => ({ row, i, value: numberOf(row, tail, i) ?? 0 }));
  const slowest = measured.reduce<(typeof measured)[number] | null>((a, m) => (!a || m.value > a.value ? m : a), null);
  const over = objective ? measured.filter((m) => m.value > objective.value).length : 0;
  const nameOf = (row: T, i: number) => String(typeof x === "function" ? x(row, i) : (row as Record<string, unknown>)[x]);
  const series: SeriesSpec<T>[] = [{ key: p50, label: words.p50, color: "neutral" }, ...(p95 ? [{ key: p95, label: words.p95, color: 1 as const }] : [])];
  return (
    <View style={styles.root}>
      <Headline
        resolved={resolved}
        title={title}
        hideTitle={hideTitle}
        value={slowest ? formatDuration(slowest.value, resolved.locale) : "—"}
        label={slowest ? fillIn(words.slowest, { name: nameOf(slowest.row, slowest.i) }) : undefined}
        delta={objective ? (over > 0 ? fillIn(words.over, { count: over }) : words.within) : null}
        way={objective ? (over > 0 ? "up" : "flat") : null}
        tone={over > 0 ? "danger" : "success"}
      />
      <BarChart
        {...props}
        title={title}
        hideTitle
        data={data}
        x={x}
        series={series}
        format={(value, l) => formatDuration(value, l)}
        thresholds={objective ? [{ ...objective, tone: "danger" }] : undefined}
      />
    </View>
  );
}

export interface NativeCreditUsageProps extends Omit<NativeChartsSettings, "labels"> {
  /** What the allowance is: the heading and the meter's name. */
  title: string;
  /** Hide the heading (it stays the accessible name). */
  hideTitle?: boolean;
  /** How much is used. */
  used: number;
  /** The allowance. */
  limit: number;
  /** How the amounts are written. Default `"integer"`. */
  format?: ValueFormat;
  /** The use of each recent day, oldest first. */
  daily?: readonly (number | null)[];
  /** When the allowance renews. */
  renewsAt?: string | Date;
  /** Today, for the projection. Default: now. */
  now?: Date;
  /** The shares where the meter turns to warning, then danger. Default `[0.8, 0.95]`. */
  levels?: readonly [number, number];
  /** The words, passed translated. */
  labels?: Partial<CreditLabels>;
  /** The style of the container (layout only). */
  style?: ViewStyle;
}

/** What is left of an allowance (React Native): the remaining amount, a meter in tones, the use per day, the run-out date. */
export function CreditUsage({ title, hideTitle, used, limit, format = "integer", daily, renewsAt, now, levels = [0.8, 0.95], labels: given, style, ...settings }: NativeCreditUsageProps) {
  const words = { ...CREDIT_LABELS, ...given };
  const resolved = useNativeSettings(settings);
  const { theme, locale } = resolved;
  const write = valueFormatter(format, locale);
  const date = categoryFormatter("date", locale);
  const ratio = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0;
  const level = quotaLevel(ratio, levels[0], levels[1]);
  const remaining = Math.max(0, limit - used);
  const usedText = fillIn(words.used, { used: write(used), percent: valueFormatter("percent", locale)(ratio) });
  const left = daily ? daysLeft(remaining, daily) : null;
  const runOut = left == null ? null : addDays(now ?? new Date(), left);
  const renews = renewsAt ? new Date(renewsAt) : null;
  const projection = daily ? (runOut && (!renews || runOut < renews) ? fillIn(words.runsOut, { date: date(runOut) }) : left == null ? words.steady : null) : null;
  const fill = level === "danger" ? theme.danger : level === "warning" ? theme.warning : theme.accent;
  return (
    <View style={[styles.root, style]}>
      <Headline resolved={resolved} title={title} hideTitle={hideTitle} value={write(remaining)} label={fillIn(words.remaining, { limit: write(limit) })} />
      <View
        role="meter"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(limit, Math.max(0, used))}
        aria-valuetext={usedText}
        accessible
        style={[styles.meter, { backgroundColor: theme.surface3 }]}
      >
        <View style={[styles.meterFill, { width: `${ratio * 100}%`, backgroundColor: fill }]} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.small, { color: theme.textSecondary }]}>{usedText}</Text>
        {renews ? <Text style={[styles.small, { color: theme.textSecondary }]}>{fillIn(words.renews, { date: date(renews) })}</Text> : null}
      </View>
      {daily && daily.length > 1 ? <Sparkline {...settings} title={words.daily} data={daily} variant="bar" format={format} height={36} /> : null}
      {projection ? <Text style={[styles.small, styles.strong, { color: theme.textPrimary }]}>{projection}</Text> : null}
    </View>
  );
}

export interface NativeGoalProgressProps extends Omit<NativeFrameProps, "loading" | "empty" | "labels"> {
  /** The amount raised, in minor units. */
  raised: number;
  /** The goal, in minor units. */
  goal: number;
  /** The ISO 4217 currency. */
  currency: string;
  /** How many people chipped in. */
  supporters?: number;
  /** The time left, written by the app (“2 days”). */
  timeLeft?: string;
  /** The words, passed translated. */
  labels?: Partial<GoalLabels>;
}

/** A pot towards its goal, in money (React Native): the arc fills, the words say how much of what. */
export function GoalProgress({ raised, goal, currency, supporters, timeLeft, labels: given, ...props }: NativeGoalProgressProps) {
  const words = { ...GOAL_LABELS, ...given };
  const resolved = useNativeSettings(props);
  const format = roundMoney(currency);
  const reached = goal > 0 && raised >= goal;
  const facts = [
    supporters != null ? fillIn(words.supporters, { count: valueFormatter("integer", resolved.locale)(supporters) }) : null,
    reached ? words.reached : null,
    timeLeft ? fillIn(words.left, { time: timeLeft }) : null,
  ].filter(Boolean);
  return (
    <View style={styles.root}>
      <Gauge {...props} value={raised} max={goal} format={format} caption={fillIn(words.raised, { goal: valueFormatter(format, resolved.locale)(goal) })} tone={reached ? "success" : "accent"} />
      {facts.length > 0 ? <Text style={[styles.small, { color: resolved.theme.textSecondary, textAlign: "center" }]}>{facts.join(" · ")}</Text> : null}
    </View>
  );
}

export interface NativePriceTickerProps extends Omit<NativeFrameProps, "loading" | "labels"> {
  /** The bids, in any order. */
  bids: readonly Bid[];
  /** The opening price, in minor units. */
  opening: number;
  /** When the auction opened. */
  openedAt?: string | Date;
  /** The ISO 4217 currency. */
  currency: string;
  /** The reserve price, drawn as a line until it is met. */
  reserve?: number;
  /** How the times are written. Default `"time"`. */
  timeFormat?: CategoryFormat;
  /** The words, passed translated. */
  labels?: Partial<TickerLabels>;
}

/** A live auction's price (React Native): the current bid in large, the change since the opening, the steps of the bids. */
export function PriceTicker({ bids, opening, openedAt, currency, reserve, timeFormat = "time", labels: given, title, hideTitle, ...props }: NativePriceTickerProps) {
  const words = { ...TICKER_LABELS, ...given };
  const resolved = useNativeSettings(props);
  const format = { style: "money", currency } as const;
  const write = valueFormatter(format, resolved.locale);
  const model = tickerModel(bids, opening, openedAt);
  const way = model.count > 0 ? direction(model.ratio) : null;
  const signed = `${model.change > 0 ? "+" : ""}${write(model.change)}`;
  const change = model.ratio == null ? signed : `${signed} (${signedPercent(model.ratio, resolved.locale)})`;
  return (
    <View style={styles.root}>
      <Headline
        resolved={resolved}
        title={title}
        hideTitle={hideTitle}
        value={write(model.current)}
        label={model.count > 0 ? words.current : words.opening}
        delta={model.count > 0 ? fillIn(words.change, { change, count: model.count }) : null}
        way={way}
        tone={good(way, true)}
      />
      <LineChart
        {...props}
        title={title}
        hideTitle
        data={model.points as { at: string | Date; amount: number }[]}
        x="at"
        y="amount"
        yLabel={words.price}
        xFormat={timeFormat}
        format={format}
        curve="step"
        thresholds={reserve != null && model.current < reserve ? [{ value: reserve, label: words.reserve, tone: "warning" }] : undefined}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  root: { gap: 8 },
  head: { gap: 2 },
  title: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  kpi: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", columnGap: 8 },
  value: { fontSize: 24, lineHeight: 30, fontWeight: "800", fontVariant: ["tabular-nums"] },
  delta: { flexDirection: "row", alignItems: "center", gap: 4 },
  small: { fontSize: 12, lineHeight: 16, fontVariant: ["tabular-nums"] },
  strong: { fontWeight: "600" },
  meter: { height: 10, borderRadius: 999, overflow: "hidden" },
  meterFill: { height: "100%", borderRadius: 999 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", columnGap: 12 },
});
