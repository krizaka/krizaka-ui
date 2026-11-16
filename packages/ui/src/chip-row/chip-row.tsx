// Client (arrow-key focus only). A row of chip links that scrolls sideways with scroll-snap on a phone (the trailing edge
// fades, no scrollbar) and wraps from `md`: an audience picker, the filters of a page. Each item is a `ChipLink`-style
// link at least 44 px high; the current one carries `aria-current`. Tab goes through the links; ← → Home End move between them.
import type { Marker } from "@krizaka/organize/contract";
import { Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { TagMarker } from "../chip/tag-marker";
import { chipVariants } from "../chip-link";

export const chipRow = tv({
  slots: {
    root: "flex w-full flex-col gap-2",
    hint: "text-xs text-fg-muted",
    list:
      "m-0 flex list-none snap-x snap-proximity gap-2 overflow-x-auto p-0 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
      "[mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)] md:flex-wrap md:overflow-visible md:pb-0 md:[mask-image:none]",
    item: "snap-start",
    count: "font-medium tabular-nums text-fg-muted",
    badge: "rounded-sm bg-surface-3 px-1.5 py-0.5 text-[0.625rem] font-semibold leading-none text-fg-muted",
  },
});

const s = chipRow();

export type ChipRowProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** What the links choose among ("For whom?"): the row's accessible name, passed translated. */
  label: string;
  /** A line under the label that says how to choose; read with the row. */
  hint?: React.ReactNode;
};

/** A scroll-snap row of chip links; wraps from `md`. Items: `ChipRow.Item`. */
function ChipRowRoot({ label, hint, className, children, ...props }: Readonly<ChipRowProps>) {
  const id = React.useId();
  const list = React.useRef<HTMLUListElement>(null);
  const move = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const links = [...(list.current?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") ?? [])];
    const at = links.indexOf(event.target as HTMLElement);
    if (at < 0) return;
    const last = links.length - 1;
    const to = event.key === "Home" ? 0 : event.key === "End" ? last : Math.min(last, Math.max(0, at + (event.key === "ArrowRight" ? 1 : -1)));
    event.preventDefault();
    links[to]?.focus();
    links[to]?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  };
  return (
    <nav aria-label={label} aria-describedby={hint ? `${id}-hint` : undefined} className={s.root({ className })} {...props}>
      {hint ? (
        <p id={`${id}-hint`} className={s.hint()}>
          {hint}
        </p>
      ) : null}
      <ul ref={list} className={s.list()} onKeyDown={move}>
        {children}
      </ul>
    </nav>
  );
}

export type ChipRowItemProps = React.ComponentProps<"a"> & {
  /** A leading colour marker (a name of the closed palette), decorative: the dot carries the colour, the chip is not tinted. The link is named by its label then its count; an `aria-label` must start with that visible text. */
  marker?: Marker;
  /** A muted, tabular count after the label. */
  count?: number;
  /** The current choice: the accent and `aria-current`. */
  selected?: boolean;
  /** What `aria-current` says when selected.
   * @default "page" */
  current?: "page" | "true";
  /** A small tag after the label ("Soon"), passed translated. */
  badge?: React.ReactNode;
  /** Renders your router's `<Link>` as the chip; put the label (and the badge) in your link's children yourself; `marker` and `count` still wrap it. */
  asChild?: boolean;
};

/** One link of the row. */
function ChipRowItem({ selected = false, current = "page", badge, asChild, marker, count, className, children, ...props }: Readonly<ChipRowItemProps>) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <li className={s.item()}>
      <Comp
        data-state={selected ? "on" : "off"}
        aria-current={selected ? current : undefined}
        className={chipVariants({ selected, className: ["min-h-11", className] })}
        {...props}
      >
        {marker ? <TagMarker marker={marker} /> : null}
        {/* With asChild the label is your link's own children: the Slottable keeps the marker and the count inside it. */}
        {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
        {count === undefined ? null : <span className={s.count()}>{count}</span>}
        {!asChild && badge ? <span className={s.badge()}>{badge}</span> : null}
      </Comp>
    </li>
  );
}

export const ChipRow = Object.assign(ChipRowRoot, { Item: ChipRowItem });
