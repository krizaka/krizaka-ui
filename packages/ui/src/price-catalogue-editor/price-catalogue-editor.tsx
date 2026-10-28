"use client";
// Client (the open row, the draft, the folds). An administrator edits a product's price entries: one row per entry, a
// change that takes effect from a date (today by default, never the past) and says that current subscriptions keep their
// price, the scheduled changes and the history folded. Fed by `describePrices()` of @krizaka/settings (JSON-safe); the
// block never fetches, saves or reads the clock: the host passes `onSchedule`, `loadHistory` and `today`. Words are props.
import { currencyDigits } from "@krizaka/intl";
import * as React from "react";

import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { cn } from "../cn";
import { Field, Input, Select } from "../field/field";
import { MoneyInput } from "../money-input/money-input";

/** The figures of a price: what one version of an entry holds. */
export interface PriceFigures {
  /** Integer cents; `null` is « on quote ». */
  amountCents: number | null;
  unit: string;
  availability: string;
  /** Named integers the product reads (`included`, `founderCap`…). */
  limits: Record<string, number>;
}

/** A change a host scheduled, still waiting for its date. */
export interface PriceScheduledView extends PriceFigures {
  versionId: string;
  /** ISO date-time. */
  effectiveFrom: string;
}

/** An entry as `describePrices()` returns it. */
export interface PriceEntryView extends PriceFigures {
  key: string;
  product: string;
  plan: string;
  currency: string;
  versionId: string;
  effectiveFrom: string;
  upcoming: PriceScheduledView[];
}

/** The catalogue as `describePrices()` returns it: the enumerations the fields offer, and the entries. */
export interface PricesView {
  units: string[];
  availabilities: string[];
  entries: PriceEntryView[];
}

/** One line of an entry's history: who, when, before → after, from when. */
export interface PriceHistoryEntry {
  versionId: string;
  /** ISO date-time the change was made. */
  at: string;
  actorLabel: string;
  effectiveFrom: string;
  before: PriceFigures | null;
  after: PriceFigures;
}

/** The result the host returns after saving. */
export type PriceScheduleResult = { ok: true } | { ok: false; message: string };

/** The words, passed translated. `{name}` placeholders are filled by the block. */
export interface PriceCatalogueWords {
  /** « Change » — opens an entry's form. */
  edit: string;
  /** « Amount » */
  amount: string;
  /** « On quote » — an entry with no figure. */
  onQuote: string;
  /** « plus taxes » */
  plusTaxes: string;
  /** « Unit » */
  unit: string;
  /** « Availability » */
  availability: string;
  /** « Limits » */
  limits: string;
  /** « From » — the date the change takes effect. */
  from: string;
  /** « Current subscriptions keep their price. » */
  keepsPrice: string;
  /** « Schedule the change » */
  save: string;
  cancel: string;
  /** « Leave empty for “on quote”. » */
  emptyIsQuote: string;
  /** « Scheduled changes ({count}) » */
  scheduled: string;
  /** « History » */
  history: string;
  /** « No change yet. » */
  historyEmpty: string;
  /** « Loading… » */
  loading: string;
  /** « {actor}, {at}: {before} → {after}, from {from} » */
  historyLine: string;
  /** « from {from} » — a scheduled change. */
  scheduledLine: string;
  /** « Saved. » — announced after a change is scheduled. */
  saved: string;
  /** The unit's name by id: `{ month: "per month" }`. A missing id shows the id. */
  units: Record<string, string>;
  /** The availability's name by id: `{ public: "Public" }`. */
  availabilities: Record<string, string>;
  /** The limit's name by key: `{ founderCap: "First customers" }`. A missing key shows the key. */
  limitNames?: Record<string, string>;
}

export interface PriceCatalogueEditorProps extends Omit<React.ComponentProps<"section">, "children"> {
  /** The catalogue as `describePrices()` returns it: the enumerations the fields offer, and the entries. */
  prices: PricesView;
  /** The words, passed translated (see `PriceCatalogueWords`). */
  words: PriceCatalogueWords;
  /** BCP 47 locale for the amounts and the dates: `"fr-CA"`. */
  locale: string;
  /** Today as `YYYY-MM-DD`: the earliest date a change may start from (the block never reads the clock). */
  today: string;
  /** Saves a change from a date (`YYYY-MM-DD`). The host validates and returns the refusal in words. */
  onSchedule: (key: string, change: PriceFigures, effectiveFrom: string) => Promise<PriceScheduleResult>;
  /** The history of an entry, asked when its fold opens. Omitted: no history fold. */
  loadHistory?: (key: string) => Promise<PriceHistoryEntry[]>;
  /** Heading level of an entry's name. @default 3 */
  headingLevel?: 2 | 3 | 4;
}

const fill = (template: string, vars: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ""));

const availabilityTone = (id: string) => (id === "public" ? "success" : id === "founder-limited" ? "accent" : id === "preparing" ? "warning" : "neutral");

/** « 9,99 $ » / « $9.99 » by locale, or the « on quote » word. Cents are bounded integers, so the division is exact for display. */
function amountText(cents: number | null, currency: string, locale: string, onQuote: string): string {
  if (cents === null) return onQuote;
  const digits = currencyDigits(currency);
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(cents / 10 ** digits);
}

const dateText = (iso: string, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso));
const figuresText = (f: PriceFigures | null, currency: string, locale: string, w: PriceCatalogueWords) =>
  f === null ? "—" : `${amountText(f.amountCents, currency, locale, w.onQuote)} ${w.units[f.unit] ?? f.unit}`;

function EntryForm({ entry, prices, words, locale, today, onSchedule, onDone }: { entry: PriceEntryView; prices: PricesView; words: PriceCatalogueWords; locale: string; today: string; onSchedule: PriceCatalogueEditorProps["onSchedule"]; onDone: () => void }) {
  const id = React.useId();
  const [cents, setCents] = React.useState<number | null>(entry.amountCents);
  const [unit, setUnit] = React.useState(entry.unit);
  const [availability, setAvailability] = React.useState(entry.availability);
  const [limits, setLimits] = React.useState<Record<string, string>>(() => Object.fromEntries(Object.entries(entry.limits).map(([k, v]) => [k, String(v)])));
  const [from, setFrom] = React.useState(today);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const limitKeys = Object.keys(entry.limits);
  const dateInvalid = from < today;
  return (
    <form
      aria-label={`${words.edit} — ${entry.product} · ${entry.plan}`}
      className="mt-4 grid gap-4 border-t border-border pt-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (dateInvalid || busy) return;
        setBusy(true);
        const next: Record<string, number> = {};
        for (const key of limitKeys) next[key] = Number.parseInt(limits[key] ?? "0", 10) || 0;
        const result = await onSchedule(entry.key, { amountCents: cents, unit, availability, limits: next }, from);
        setBusy(false);
        if (result.ok) onDone();
        else setError(result.message);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field.Root>
          <Field.Label htmlFor={`${id}-amount`}>{words.amount}</Field.Label>
          <MoneyInput id={`${id}-amount`} value={cents} onValueChange={setCents} currency={entry.currency} locale={locale} aria-describedby={`${id}-amount-hint`} />
          <Field.Hint id={`${id}-amount-hint`}>{words.emptyIsQuote}</Field.Hint>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor={`${id}-unit`}>{words.unit}</Field.Label>
          <Select id={`${id}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)}>
            {prices.units.map((u) => (
              <option key={u} value={u}>
                {words.units[u] ?? u}
              </option>
            ))}
          </Select>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor={`${id}-availability`}>{words.availability}</Field.Label>
          <Select id={`${id}-availability`} value={availability} onChange={(e) => setAvailability(e.target.value)}>
            {prices.availabilities.map((a) => (
              <option key={a} value={a}>
                {words.availabilities[a] ?? a}
              </option>
            ))}
          </Select>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor={`${id}-from`}>{words.from}</Field.Label>
          <Input id={`${id}-from`} type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} invalid={dateInvalid} />
        </Field.Root>
      </div>
      {limitKeys.length > 0 && (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 text-xs font-semibold text-fg-secondary">{words.limits}</legend>
          {limitKeys.map((key) => (
            <Field.Root key={key}>
              <Field.Label htmlFor={`${id}-limit-${key}`}>{words.limitNames?.[key] ?? key}</Field.Label>
              <Input id={`${id}-limit-${key}`} inputMode="numeric" pattern="[0-9]*" value={limits[key] ?? ""} onChange={(e) => setLimits({ ...limits, [key]: e.target.value.replace(/\D/g, "") })} />
            </Field.Root>
          ))}
        </fieldset>
      )}
      <p className="text-sm text-fg-secondary">{words.keepsPrice}</p>
      {error && <Field.Error>{error}</Field.Error>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" variant="primary" disabled={busy || dateInvalid}>
          {words.save}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          {words.cancel}
        </Button>
      </div>
    </form>
  );
}

function HistoryFold({ entry, words, locale, loadHistory }: { entry: PriceEntryView; words: PriceCatalogueWords; locale: string; loadHistory: NonNullable<PriceCatalogueEditorProps["loadHistory"]> }) {
  const [lines, setLines] = React.useState<PriceHistoryEntry[] | null>(null);
  const asked = React.useRef(false);
  return (
    <details
      className="group"
      onToggle={(event) => {
        if (!(event.currentTarget as HTMLDetailsElement).open || asked.current) return;
        asked.current = true;
        void loadHistory(entry.key).then(setLines);
      }}
    >
      <summary className="cursor-pointer text-sm font-medium text-fg-secondary hover:text-fg">{words.history}</summary>
      {lines === null ? (
        <p className="mt-2 text-sm text-fg-secondary">{words.loading}</p>
      ) : lines.length === 0 ? (
        <p className="mt-2 text-sm text-fg-secondary">{words.historyEmpty}</p>
      ) : (
        <ol className="mt-2 grid gap-1.5 text-sm text-fg-secondary">
          {lines.map((line) => (
            <li key={line.versionId}>
              {fill(words.historyLine, {
                actor: line.actorLabel,
                at: dateText(line.at, locale),
                before: figuresText(line.before, entry.currency, locale, words),
                after: figuresText(line.after, entry.currency, locale, words),
                from: dateText(line.effectiveFrom, locale),
              })}
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}

/** The price entries of a product, each editable from a date, with what is scheduled and its history folded. */
export function PriceCatalogueEditor({ prices, words, locale, today, onSchedule, loadHistory, headingLevel = 3, className, ...props }: PriceCatalogueEditorProps) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const Heading = `h${headingLevel}` as "h3";
  return (
    <section data-price-catalogue="" className={cn("grid gap-3", className)} {...props}>
      <ul className="grid gap-3">
        {prices.entries.map((entry) => (
          <li key={entry.key} data-availability={entry.availability} className="rounded-xl border border-border bg-surface-1 p-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <Heading className="text-sm font-semibold text-fg">
                  {entry.product} · {entry.plan}
                </Heading>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-fg">
                  <span className="text-xl font-semibold tabular-nums">{amountText(entry.amountCents, entry.currency, locale, words.onQuote)}</span>
                  {entry.amountCents !== null && (
                    <span className="text-sm text-fg-secondary">
                      {words.units[entry.unit] ?? entry.unit} · {words.plusTaxes}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={availabilityTone(entry.availability)} dot>
                  {words.availabilities[entry.availability] ?? entry.availability}
                </Badge>
                {open !== entry.key && (
                  <Button type="button" size="sm" variant="secondary" aria-label={`${words.edit} — ${entry.product} · ${entry.plan}`} onClick={() => (setOpen(entry.key), setSaved(false))}>
                    {words.edit}
                  </Button>
                )}
              </div>
            </div>
            {Object.keys(entry.limits).length > 0 && (
              <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-secondary">
                {Object.entries(entry.limits).map(([key, value]) => (
                  <div key={key} className="flex gap-1.5">
                    <dt>{words.limitNames?.[key] ?? key}</dt>
                    <dd className="font-medium tabular-nums text-fg">{new Intl.NumberFormat(locale).format(value)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {open === entry.key && (
              <EntryForm
                entry={entry}
                prices={prices}
                words={words}
                locale={locale}
                today={today}
                onSchedule={onSchedule}
                onDone={() => {
                  setOpen(null);
                  setSaved(true);
                }}
              />
            )}
            {(entry.upcoming.length > 0 || loadHistory) && (
              <div className="mt-3 grid gap-2">
                {entry.upcoming.length > 0 && (
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-fg-secondary hover:text-fg">{fill(words.scheduled, { count: entry.upcoming.length })}</summary>
                    <ul className="mt-2 grid gap-1.5 text-sm text-fg-secondary">
                      {entry.upcoming.map((v) => (
                        <li key={v.versionId}>
                          {figuresText(v, entry.currency, locale, words)} · {fill(words.scheduledLine, { from: dateText(v.effectiveFrom, locale) })}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {loadHistory && <HistoryFold entry={entry} words={words} locale={locale} loadHistory={loadHistory} />}
              </div>
            )}
          </li>
        ))}
      </ul>
      <p role="status" className="sr-only">
        {saved ? words.saved : ""}
      </p>
    </section>
  );
}
