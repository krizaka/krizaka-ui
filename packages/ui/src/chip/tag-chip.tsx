// Client (a Radix radio group, and `Chip`'s context). The tags of a workspace (krizaka-ts#89, `@krizaka/organize`): a name
// with a colour marker beside it. The marker is a NAME of the closed palette (`MARKERS`: blue · green · amber · red ·
// violet · gray), mapped to `--kz-tag-<name>` — a dot (≥ 3:1) or Yomizaka's bookmark ribbon. It sits beside the name and
// never fills the chip, and the name is always written: the colour is never the only signal.
import type { Marker } from "@krizaka/organize/contract";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../cn";
import { Chip, type ChipProps } from "./chip";
import { TAG_MARKERS } from "./markers";

/** The six names of the closed palette (`@krizaka/organize` `MARKERS`; a test keeps them equal). */
export const MARKERS: readonly Marker[] = TAG_MARKERS;
export type { Marker };

/** The marker's shape: a `dot`, or the `ribbon` (a bookmark: a rectangle with a notch at the bottom). */
export type MarkerShape = "dot" | "ribbon";

/** The CSS custom property the marker reads its colour from: `--kz-tag-<name>`. */
const markerVar = (marker: Marker) => `var(--kz-tag-${marker})`;

export type TagMarkerProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** A name of the closed palette. */
  marker: Marker;
  /**
   * dot · ribbon.
   * @default "dot"
   */
  shape?: MarkerShape;
};

/** The marker alone, decorative (`aria-hidden`): put the tag's name beside it. */
export function TagMarker({ marker, shape = "dot", className, style, ...props }: TagMarkerProps) {
  return (
    <span
      aria-hidden
      data-marker={marker}
      data-shape={shape}
      className={cn(
        "inline-block shrink-0 bg-(--kz-marker) data-[shape=dot]:h-2.5 data-[shape=dot]:w-2.5 data-[shape=dot]:rounded-full",
        "data-[shape=ribbon]:h-3.5 data-[shape=ribbon]:w-2.5 data-[shape=ribbon]:[clip-path:polygon(0_0,100%_0,100%_100%,50%_72%,0_100%)]",
        className,
      )}
      style={{ ...style, ["--kz-marker" as string]: markerVar(marker) }}
      {...props}
    />
  );
}

export type TagChipProps = ChipProps & {
  /** The tag's marker: a name of the closed palette (`blue · green · amber · red · violet · gray`). */
  marker: Marker;
  /**
   * dot · ribbon.
   * @default "dot"
   */
  shape?: MarkerShape;
};

/**
 * A tag: its marker and its name. Alone a toggle (a filter), inside `Chip.Group` an item, or `removable` (a tag worn by a
 * file) — the behaviour of `Chip`, with the marker before the name.
 */
export function TagChip({ marker, shape, children, ...props }: TagChipProps) {
  const content = (
    <>
      <TagMarker marker={marker} shape={shape} />
      {children}
    </>
  );
  return <Chip {...(props as ChipProps)}>{content}</Chip>;
}

export type MarkerPickerProps = {
  /** The group's accessible name ("Colour of the tag"), passed translated. */
  label: string;
  /** The name of each colour, passed translated: `{ blue: "Blue", … }`. The swatches are named, never colour alone. */
  names: Readonly<Record<Marker, string>>;
  /** The colour chosen (controlled). */
  value?: Marker;
  /** The colour chosen at first, uncontrolled. */
  defaultValue?: Marker;
  /** Called with the colour chosen. */
  onValueChange?: (value: Marker) => void;
  /** The colours offered (default: the six). */
  markers?: readonly Marker[];
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

/** Recolours a tag from the closed palette: a radio group of swatches (arrow keys), the chosen one ticked and named. */
export function MarkerPicker({ label, names, value, defaultValue, onValueChange, markers = MARKERS, disabled, className }: MarkerPickerProps) {
  return (
    <RadioPrimitive.Root
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as Marker)}
      disabled={disabled}
      orientation="horizontal"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      {markers.map((marker) => (
        <RadioPrimitive.Item
          key={marker}
          value={marker}
          aria-label={names[marker]}
          title={names[marker]}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-surface-1 transition-colors",
            "hover:border-border-strong focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
            "data-[state=checked]:border-(--kz-marker) data-[state=checked]:bg-surface-2",
          )}
          style={{ ["--kz-marker" as string]: markerVar(marker) }}
        >
          <span aria-hidden className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-(--kz-marker)">
            <RadioPrimitive.Indicator forceMount className="hidden h-full w-full items-center justify-center data-[state=checked]:flex">
              {/* The tick is the second signal: a shape, not a colour (it reads in the page's text colour on the swatch's ring). */}
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-surface-0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </RadioPrimitive.Indicator>
          </span>
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}
