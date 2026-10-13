// Server-safe. Facts about one thing, as term and value: a job's details, a payout's breakdown, a profile. A real
// `<dl>` (each pair in a `<div>`, as HTML allows): stacked, inline (term beside its value) or a grid of cards
// (`KeyValueGrid`). Every word is a prop.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const descriptionList = tv({
  slots: {
    root: "m-0 w-full",
    pair: "min-w-0",
    term: "text-xs font-semibold text-fg-secondary",
    details: "m-0 min-w-0 break-words text-sm text-fg",
    hint: "mt-0.5 block text-xs text-fg-secondary",
  },
  variants: {
    layout: {
      stacked: { root: "flex flex-col gap-4", details: "mt-1" },
      inline: {
        root: "divide-y divide-border-subtle",
        pair: "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5 first:pt-0 last:pb-0",
        term: "text-sm font-normal",
        details: "text-right font-medium tabular-nums",
      },
      grid: {
        root: "grid grid-cols-[repeat(auto-fill,minmax(var(--kz-kv-min,10rem),1fr))] gap-3",
        pair: "rounded-xl border border-border-default bg-surface-1 px-4 py-3",
        term: "uppercase tracking-wider",
        details: "mt-1 font-display text-lg font-bold tabular-nums",
      },
    },
  },
  defaultVariants: { layout: "stacked" },
});

export type DescriptionItem = {
  /** The term (“Status”, “Credits”) — passed translated. */
  term: React.ReactNode;
  /** The value: text, a `Badge`, a link. */
  details: React.ReactNode;
  /** A line under the value (a date, a unit). */
  hint?: React.ReactNode;
  /** A stable key, when the terms are not unique strings. */
  id?: string;
};

export type DescriptionListProps = Omit<React.ComponentProps<"dl">, "children"> & {
  /** The pairs, in reading order. */
  items: readonly DescriptionItem[];
  /** stacked (default: a details panel) · inline (term left, value right: a receipt, a summary) · grid (cards). */
  layout?: "stacked" | "inline" | "grid";
};

/** Term and value pairs — a job's details, a payout's breakdown — stacked, inline like a receipt, or as cards. */
export function DescriptionList({ items, layout, className, ...props }: DescriptionListProps) {
  const s = descriptionList({ layout });
  return (
    <dl className={s.root({ className })} {...props}>
      {items.map((item, i) => (
        <div key={item.id ?? (typeof item.term === "string" ? item.term : i)} className={s.pair()}>
          <dt className={s.term()}>{item.term}</dt>
          <dd className={s.details()}>
            {item.details}
            {item.hint ? <span className={s.hint()}>{item.hint}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export type KeyValueGridProps = Omit<DescriptionListProps, "layout"> & {
  /** The narrowest a card may be before the grid wraps, in rem. Default 10. */
  minWidth?: number;
};

/** Key figures as a grid of cards that wraps with the width: a job's numbers, an account's limits. */
export function KeyValueGrid({ minWidth = 10, style, ...props }: KeyValueGridProps) {
  return <DescriptionList layout="grid" style={{ ...style, ["--kz-kv-min" as string]: `${minWidth}rem` }} {...props} />;
}
