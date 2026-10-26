// Server-safe. The blocks of a « Credits & usage » page: the balance on a Meter, the period switch (the address holds it),
// the figures on the strip, the activity stacked by outcome. Words are props (French by default for the few built in);
// figures are written with @krizaka/intl. Demo data only in the examples.
import { formatNumber } from "@krizaka/intl";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { BlockLink, type LinkComponent } from "../block-link";
import { Meter } from "../meter";
import { StatGrid } from "../stat";
import { periodHref, USAGE_PERIODS, type UsageBar, usageBars, type UsageDay, type UsageOutcome, usageTile,type UsageTileInput, type UsageTileOptions } from "./model";

export const usage = tv({
  slots: {
    credits: "flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-surface-1 p-5",
    creditsHead: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
    creditsTitle: "m-0 text-sm font-semibold text-fg-secondary",
    creditsFigure: "m-0 font-display text-3xl font-bold tabular-nums text-fg",
    creditsFoot: "m-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-fg-secondary",
    switchList: "m-0 inline-flex list-none gap-1 rounded-lg border border-border-default bg-surface-1 p-1",
    switchLink:
      "inline-flex min-h-9 min-w-11 items-center justify-center rounded-md px-3 text-sm font-semibold tabular-nums text-fg-secondary no-underline transition-colors " +
      "hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg",
    chart: "m-0 flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-surface-1 p-5",
    chartTitle: "text-sm font-semibold text-fg",
    plot: "flex h-40 w-full items-end gap-1",
    column: "flex h-full min-w-0 flex-1 flex-col justify-end",
    bar: "flex w-full flex-col-reverse overflow-hidden rounded-sm",
    legend: "m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-fg-secondary",
    swatch: "mr-1.5 inline-block h-2 w-2 rounded-full align-baseline",
    state: "m-0 flex h-40 items-center justify-center rounded-lg border border-dashed border-border-default px-4 text-center text-sm text-fg-secondary",
    skeleton: "h-40 w-full animate-pulse rounded-lg bg-surface-3 motion-reduce:animate-none",
  },
  variants: {
    tone: {
      accent: { swatch: "bg-accent" },
      success: { swatch: "bg-success" },
      warning: { swatch: "bg-warning" },
      danger: { swatch: "bg-danger" },
      muted: { swatch: "bg-border-strong" },
    },
  },
});

const FILL: Record<UsageOutcome["tone"], string> = { accent: "bg-accent", success: "bg-success", warning: "bg-warning", danger: "bg-danger", muted: "bg-border-strong" };

const CREDIT_WORDS = {
  fr: { of: "sur", left: "restants" },
  en: { of: "of", left: "left" },
} as const;

export type CreditsMeterProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** What the balance is (« Crédits »): the heading and the meter's name. */
  label: string;
  /** Credits left. */
  balance: number;
  /** The allowance of the period; the meter fills with what is left. */
  total: number;
  /** The renewal, written by the app (« Renouvelés le 1er novembre »). */
  renewal?: React.ReactNode;
  /** The way to buy more: a link or a button. */
  action?: React.ReactNode;
  /** Default `fr-CA`. */
  locale?: string;
};

/** The balance: the figure large, a meter that turns to warning then danger as it runs low, the renewal and the way to buy. */
export function CreditsMeter({ label, balance, total, renewal, action, locale = "fr-CA", className, ...props }: CreditsMeterProps) {
  const s = usage();
  const w = locale.toLowerCase().startsWith("en") ? CREDIT_WORDS.en : CREDIT_WORDS.fr;
  const write = (n: number) => formatNumber(n, { locale });
  const words = `${write(balance)} ${w.of} ${write(total)}`;
  return (
    <section aria-label={label} className={s.credits({ className })} {...props}>
      <div className={s.creditsHead()}>
        <h3 className={s.creditsTitle()}>{label}</h3>
        <p className={s.creditsFigure()}>
          {write(balance)} <span className="sr-only">{w.left}</span>
        </p>
      </div>
      <Meter label={label} value={balance} max={Math.max(1, total)} valueText={words} optimum="high" thresholds={{ low: 0.2, high: 0.5 }} size="lg" />
      <p className={s.creditsFoot()}>
        <span>{words}</span>
        {renewal ? <span>{renewal}</span> : null}
        {action}
      </p>
    </section>
  );
}

export type PeriodSwitchProps = Omit<React.ComponentProps<"nav">, "children"> & {
  /** The accessible name (« Période »). */
  label: string;
  /** The period shown, from `parsePeriod(searchParams.period)`. */
  value: number;
  /** The page's path (and any other parameters); each period is a link to it with `?period=`. */
  href: string;
  /** The periods offered, in days. Default 7 · 30 · 90. */
  periods?: readonly number[];
  /** The query parameter. Default `period`. */
  param?: string;
  /** The text of a period. Default `7 j` (`7 d` for an English locale). */
  periodLabel?: (days: number) => string;
  /** Default `fr-CA`. */
  locale?: string;
  /** The app's router link (Next's `Link`); default a plain `<a>`. */
  linkAs?: LinkComponent;
};

/** 7 · 30 · 90 d: links, so the address holds the period (`?period=30`) and the server renders it. */
export function PeriodSwitch({ label, value, href, periods = USAGE_PERIODS, param = "period", periodLabel, locale = "fr-CA", linkAs, className, ...props }: PeriodSwitchProps) {
  const s = usage();
  const unit = locale.toLowerCase().startsWith("en") ? "d" : "j";
  const text = periodLabel ?? ((days: number) => `${days} ${unit}`);
  return (
    <nav aria-label={label} className={className} {...props}>
      <ul className={s.switchList()}>
        {periods.map((days) => (
          <li key={days}>
            <BlockLink href={periodHref(href, days, param)} linkAs={linkAs} className={s.switchLink()} aria-current={days === value ? "page" : undefined}>
              {text(days)}
            </BlockLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type UsageTilesProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 2 to 4 figures. */
  tiles: readonly UsageTileInput[];
  /** The period switch, above the row. */
  period?: React.ReactNode;
  /** The data is on its way: the row keeps its height. */
  loading?: boolean;
} & UsageTileOptions;

/** The figures of the period on the strip, each compared with the previous period in words. */
export function UsageTiles({ tiles, period, loading, locale, words, className, ...props }: UsageTilesProps) {
  const s = usage();
  if (loading) return <div aria-busy="true" className={s.skeleton({ className: ["h-20", className].filter(Boolean).join(" ") })} {...props} />;
  return <StatGrid variant="strip" items={tiles.map((t) => usageTile(t, { locale, words }))} period={period} className={className} {...props} />;
}

export type UsageChartProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** What it draws (« Activité par résultat »). */
  title: string;
  /** The days, oldest first. */
  days: readonly UsageDay[];
  /** The outcomes stacked in each bar, bottom first. */
  outcomes: readonly UsageOutcome[];
  /** Said when there is nothing in the period. */
  emptyLabel: string;
  /** The text version's column headings: the day, the total. */
  columns: { day: string; total: string };
  /** The data is on its way: a skeleton keeps the height. */
  loading?: boolean;
  /** Default `fr-CA`. */
  locale?: string;
};

function Column({ bar, outcomes }: { bar: UsageBar; outcomes: readonly UsageOutcome[] }) {
  const s = usage();
  return (
    <div className={s.column()}>
      <div className={s.bar()} style={{ height: `${bar.height * 100}%` }}>
        {bar.segments.map((seg, i) =>
          seg.value > 0 ? <span key={seg.id} className={FILL[outcomes[i]?.tone ?? "muted"]} style={{ height: `${seg.share * 100}%` }} /> : null,
        )}
      </div>
    </div>
  );
}

/** The activity of the period, one bar per day stacked by outcome — with its legend and its text version (a table). */
export function UsageChart({ title, days, outcomes, emptyLabel, columns, loading, locale = "fr-CA", className, ...props }: UsageChartProps) {
  const s = usage();
  const bars = usageBars(days, outcomes);
  const sum = (id: string) => days.reduce((n, d) => n + (d.values[id] ?? 0), 0);
  const empty = bars.every((b) => b.total === 0);
  const write = (n: number) => formatNumber(n, { locale });
  return (
    <figure aria-busy={loading || undefined} className={s.chart({ className })} {...props}>
      <figcaption className={s.chartTitle()}>{title}</figcaption>
      {loading ? (
        <div className={s.skeleton()} />
      ) : empty ? (
        <p className={s.state()}>{emptyLabel}</p>
      ) : (
        <>
          <div aria-hidden className={s.plot()}>
            {bars.map((bar) => (
              <Column key={bar.label} bar={bar} outcomes={outcomes} />
            ))}
          </div>
          <ul className={s.legend()}>
            {outcomes.map((o) => (
              <li key={o.id}>
                <span aria-hidden className={s.swatch({ tone: o.tone })} />
                {o.label} <span className="tabular-nums text-fg">{write(sum(o.id))}</span>
              </li>
            ))}
          </ul>
          <table className="sr-only">
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{columns.day}</th>
                {outcomes.map((o) => (
                  <th key={o.id} scope="col">
                    {o.label}
                  </th>
                ))}
                <th scope="col">{columns.total}</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d.label}>
                  <th scope="row">{d.label}</th>
                  {outcomes.map((o) => (
                    <td key={o.id}>{write(d.values[o.id] ?? 0)}</td>
                  ))}
                  <td>{write(bars[i]?.total ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </figure>
  );
}
