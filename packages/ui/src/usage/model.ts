// Headless: the arithmetic and the words of the usage blocks (period, tiles, chart rows), read by the web entry.
import { formatNumber, formatPercent } from "@krizaka/intl";
import type * as React from "react";

import type { StatStripItem, StatTrend } from "../stat";

/** The periods a usage page offers, in days. */
export const USAGE_PERIODS = [7, 30, 90] as const;
export type UsagePeriod = (typeof USAGE_PERIODS)[number];

/** Reads `?period=` back: anything but an offered period is the default, so the address can never break the page. */
export function parsePeriod(raw: string | string[] | null | undefined, allowed: readonly number[] = USAGE_PERIODS, fallback = 30): number {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  return allowed.includes(value) ? value : fallback;
}

/** The address of a period: the same path with `period` set, every other parameter kept. */
export function periodHref(base: string, period: number, param = "period"): string {
  const [path = "", query = ""] = base.split("?");
  const params = new URLSearchParams(query);
  params.set(param, String(period));
  return `${path}?${params.toString()}`;
}

const WORDS = {
  fr: { vsPrevious: "{change} vs période précédente", same: "stable", up: "en hausse", down: "en baisse" },
  en: { vsPrevious: "{change} vs previous period", same: "steady", up: "up", down: "down" },
} as const;

export type UsageWords = {
  /** The change against the previous period; `{change}` is replaced by the signed percentage. */
  vsPrevious: string;
  /** When the figure did not move. */
  same: string;
};

const FLAT = 0.005;

export interface UsageTileInput {
  id: string;
  label: string;
  value: number;
  /** The same figure for the previous period: the trend is computed from it. */
  previous?: number;
  /** Which direction is good news (latency, failures: `down`). Default `up`. */
  good?: "up" | "down";
  /** The shape of the period, rendered by the app (a `Sparkline` of @krizaka/charts, 64 × 18). */
  chart?: React.ReactNode;
  /** Digits of the figure. Default 0. */
  digits?: number;
}

export interface UsageTileOptions {
  /** Default `fr-CA`: French figures and words with no props. */
  /** The language of the figures and the words. Default `fr-CA`. */
  locale?: string;
  /** Your own words for the change: `{change}` is the percentage. */
  words?: Partial<UsageWords>;
}

const wordsOf = (locale: string): (typeof WORDS)[keyof typeof WORDS] => (locale.toLowerCase().startsWith("en") ? WORDS.en : WORDS.fr);

function direction(change: number | null): StatTrend | undefined {
  if (change === null) return undefined;
  if (Math.abs(change) < FLAT) return "flat";
  return change > 0 ? "up" : "down";
}

function changeOf(value: number, previous: number | undefined): number | null {
  if (previous === undefined) return null;
  if (previous === 0) return value === 0 ? 0 : null;
  return value / previous - 1;
}

/** One strip figure: the value written for the locale, the change against the previous period said in words. */
export function usageTile(input: UsageTileInput, { locale = "fr-CA", words }: UsageTileOptions = {}): StatStripItem {
  const w = { ...wordsOf(locale), ...words };
  const change = changeOf(input.value, input.previous);
  const trend = direction(change);
  const text = change === null ? undefined : trend === "flat" ? w.same : w.vsPrevious.replace("{change}", formatPercent(change, { locale, signDisplay: "exceptZero", maximumFractionDigits: 0 }));
  return {
    id: input.id,
    label: input.label,
    value: formatNumber(input.value, { locale, maximumFractionDigits: input.digits ?? 0 }),
    trend,
    trendLabel: text,
    chart: input.chart,
  };
}

/** One bar of the usage chart: a day, its counts by outcome. */
export interface UsageDay {
  /** The day, written by the app (`3 nov.`). */
  label: string;
  values: Readonly<Partial<Record<string, number>>>;
}

export interface UsageOutcome {
  id: string;
  label: string;
  /** `accent`, `success`, `warning`, `danger` or `muted`: tones of the tokens, never a colour. */
  tone: "accent" | "success" | "warning" | "danger" | "muted";
}

export interface UsageBar {
  label: string;
  total: number;
  /** Height of the whole bar, 0–1 of the tallest day. */
  height: number;
  segments: { id: string; value: number; share: number }[];
}

/** The bars of the chart: heights relative to the tallest day, segments as shares of their bar. */
export function usageBars(days: readonly UsageDay[], outcomes: readonly UsageOutcome[]): UsageBar[] {
  const totals = days.map((d) => outcomes.reduce((sum, o) => sum + (d.values[o.id] ?? 0), 0));
  const max = Math.max(1, ...totals);
  return days.map((d, i) => {
    const total = totals[i] ?? 0;
    return {
      label: d.label,
      total,
      height: total / max,
      segments: outcomes.map((o) => ({ id: o.id, value: d.values[o.id] ?? 0, share: total === 0 ? 0 : (d.values[o.id] ?? 0) / total })),
    };
  });
}
