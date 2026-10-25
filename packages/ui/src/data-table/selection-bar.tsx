// Client (a polite live region). The bar of a selection (krizaka-ts#89, bulk actions): how many rows are chosen, the actions
// the PRODUCT gives for them (tag, untag, move status, move to a collection, export…), « Clear selection », and what the last
// bulk change did (« 3 moved, 1 skipped »), announced politely. It is sticky at the bottom of its list; on a phone it docks
// above the tab bar (`--kz-dock-offset`, the bar's height, set by the shell that has one). The service takes at most `max`
// ids per call: past it the bar says so and the actions rest. `DataTable` draws it itself with `bulkActions`.
import * as React from "react";

import { cn } from "../cn";

export type SelectionBarLabels = {
  /** The bar's accessible name ("Actions on the selection"). */
  bar: string;
  /** The count: `(n) => n + " selected"`. */
  selected: (count: number) => string;
  /** "Clear selection". */
  clear: string;
  /** Said when the selection is bigger than the service takes: `(max) => "At most " + max + " at a time"`. */
  tooMany: (max: number) => string;
};

export const selectionBarLabels: SelectionBarLabels = {
  bar: "Actions on the selection",
  selected: (count) => `${count.toLocaleString("en")} selected`,
  clear: "Clear selection",
  tooMany: (max) => `At most ${max.toLocaleString("en")} at a time`,
};

export type SelectionBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** How many rows are chosen. The bar is not drawn at 0. */
  count: number;
  /** The actions the product gives (`Button`s). They rest when the selection is over `max`. */
  children?: React.ReactNode;
  /** Clears the selection. */
  onClear: () => void;
  /** The most the service takes at a time (200 for `@krizaka/organize`): the bar says so past it. */
  max?: number;
  /** What the last bulk change did ("3 moved, 1 skipped — 1 has no right to this move"), announced politely. */
  result?: string;
  /** The words, passed translated (English by default). */
  labels?: Partial<SelectionBarLabels>;
};

/** The count, the product's bulk actions, « Clear selection » and the result of the last change — sticky, docked on a phone. */
export function SelectionBar({ count, children, onClear, max, result, labels: given, className, ...props }: SelectionBarProps) {
  const labels = { ...selectionBarLabels, ...given };
  const over = max !== undefined && count > max;
  // The live region exists before its text changes, so a screen reader hears the count and the result.
  return (
    <div
      role="toolbar"
      aria-label={labels.bar}
      data-over={over ? "" : undefined}
      hidden={count === 0}
      className={cn(
        "sticky bottom-(--kz-dock-offset,0px) z-20 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border-default bg-surface-1 px-3 py-2.5 shadow-md",
        "max-md:rounded-b-none max-md:pb-[max(0.625rem,env(safe-area-inset-bottom))]",
        "[&_[role=toolbar]]:contents",
        className,
      )}
      {...props}
    >
      <p className="m-0 text-sm font-semibold text-fg tabular-nums" aria-live="polite" aria-atomic>
        {count > 0 ? labels.selected(count) : ""}
        {over && max !== undefined ? <span className="ml-2 font-normal text-fg-danger">{labels.tooMany(max)}</span> : null}
      </p>
      <div className={cn("flex flex-wrap items-center gap-2", over && "pointer-events-none opacity-40")} inert={over || undefined}>
        {children}
      </div>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto inline-flex h-9 items-center rounded-md px-2.5 text-xs font-semibold text-fg-accent hover:bg-surface-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        {labels.clear}
      </button>
      <p className="m-0 basis-full text-xs text-fg-secondary empty:hidden" aria-live="polite" aria-atomic>
        {result}
      </p>
    </div>
  );
}
