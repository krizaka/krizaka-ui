// Server-safe. Numbered items with margin notes for product reading pages: the number in the left margin, the note in the right
// margin from 64 rem and folded under the item below. An ordered list, so the order a screen reader hears is number, text, note.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const marginLayoutStyles = tv({
  slots: {
    root: "m-0 flex list-none flex-col gap-8 p-0",
    item: "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 lg:grid-cols-[4rem_minmax(0,1fr)_16rem] lg:gap-x-8",
    number: "font-display text-2xl font-bold leading-none tabular-nums text-fg-accent lg:text-3xl",
    body: "col-start-2 min-w-0 text-fg",
    note: "col-start-2 min-w-0 border-l-2 border-border pl-3 text-sm text-fg-secondary lg:col-start-3 lg:row-start-1",
  },
});

export type MarginLayoutProps = Omit<React.ComponentProps<"ol">, "children"> & {
  /** The `MarginItem`s, in reading order. */
  children: React.ReactNode;
};

/** The list of numbered items. */
export function MarginLayout({ className, children, ...props }: MarginLayoutProps) {
  return (
    <ol className={marginLayoutStyles().root({ className })} {...props}>
      {children}
    </ol>
  );
}

export type MarginItemProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** The number shown in the left margin (« 1 », « 02 »). Decorative: the list already announces the position. */
  number: React.ReactNode;
  /** The note shown in the right margin from 64 rem, and under the item below it (the article cited, « See in the document »). */
  note?: React.ReactNode;
  /** The item's content. */
  children: React.ReactNode;
};

/** One item: its number, its content and, optionally, its margin note. */
export function MarginItem({ number, note, className, children, ...props }: MarginItemProps) {
  const s = marginLayoutStyles();
  return (
    <li className={s.item({ className })} {...props}>
      <span aria-hidden className={s.number()}>
        {number}
      </span>
      <div className={s.body()}>{children}</div>
      {note ? <div data-slot="note" className={s.note()}>{note}</div> : null}
    </li>
  );
}
