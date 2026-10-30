"use client";

import * as React from "react";

import { tv } from "../../tv";

export const mapSheet = tv({
  slots: {
    root: "absolute inset-x-0 bottom-0 z-10 flex max-h-full flex-col rounded-t-2xl border border-border-subtle bg-surface-1 text-fg shadow-lg transition-[height] duration-200 motion-reduce:transition-none md:inset-y-3 md:left-3 md:right-auto md:max-h-none md:w-[22rem] md:rounded-2xl",
    handle: "flex h-6 w-full shrink-0 items-center justify-center md:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus",
    grip: "h-1 w-10 rounded-full bg-border-default",
    body: "min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:pt-4",
  },
  variants: {
    snap: {
      peek: { root: "h-24 md:h-auto" },
      half: { root: "h-1/2 md:h-auto" },
      full: { root: "h-[92%] md:h-auto" },
    },
  },
  defaultVariants: { snap: "peek" },
});

export type MapSheetSnap = "peek" | "half" | "full";
export const MAP_SHEET_SNAPS: readonly MapSheetSnap[] = ["peek", "half", "full"];

export type MapSheetProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** What the sheet is, passed translated: its accessible name ("Place details"). */
  label: string;
  /** The content: an info card, a route card, a list. */
  children: React.ReactNode;
  /** The snap point, when controlled. */
  snap?: MapSheetSnap;
  /** The snap point at the start, when not controlled. Default "peek". */
  defaultSnap?: MapSheetSnap;
  /** Called with the new snap point (the handle: a press cycles, ArrowUp / ArrowDown step, Home / End jump). */
  onSnapChange?: (snap: MapSheetSnap) => void;
  /** The handle's name, translated ("Resize the panel"). */
  handleLabel: string;
};

/**
 * A NON-modal sheet over a map: the map stays alive and reachable behind it (no scrim, no focus trap, nothing made
 * inert). On a phone it rises from the bottom with three snap points; from the `md` breakpoint it is a card at the
 * side and the handle disappears. Place it in the map's positioned container.
 */
export function MapSheet({ label, children, snap, defaultSnap = "peek", onSnapChange, handleLabel, className, ...props }: MapSheetProps) {
  const [inner, setInner] = React.useState<MapSheetSnap>(defaultSnap);
  const current = snap ?? inner;
  const set = (next: MapSheetSnap) => {
    if (snap === undefined) setInner(next);
    onSnapChange?.(next);
  };
  const step = (by: number) => set(MAP_SHEET_SNAPS[Math.min(MAP_SHEET_SNAPS.length - 1, Math.max(0, MAP_SHEET_SNAPS.indexOf(current) + by))]!);
  const s = mapSheet({ snap: current });
  return (
    <section {...props} aria-label={label} data-snap={current} className={s.root({ className })}>
      <button
        type="button"
        className={s.handle()}
        aria-label={handleLabel}
        aria-expanded={current !== "peek"}
        onClick={() => set(MAP_SHEET_SNAPS[(MAP_SHEET_SNAPS.indexOf(current) + 1) % MAP_SHEET_SNAPS.length]!)}
        onKeyDown={(e) => {
          const move = { ArrowUp: () => step(1), ArrowDown: () => step(-1), Home: () => set("peek"), End: () => set("full") }[e.key];
          if (!move) return;
          e.preventDefault();
          move();
        }}
      >
        <span className={s.grip()} aria-hidden />
      </button>
      <div className={s.body()}>{children}</div>
    </section>
  );
}
