// Client (a Radix radio group, and `Chip`'s context). The tags of a workspace (krizaka-ts#89, `@krizaka/organize`): a name
// with a colour marker beside it. The marker is a NAME of the closed palette (`MARKERS`: blue · green · amber · red ·
// violet · gray), mapped to `--kz-tag-<name>` — a dot (≥ 3:1) or Verikora's bookmark ribbon. It sits beside the name and
// never fills the chip, and the name is always written: the colour is never the only signal.
import type { Marker } from "@krizaka/organize/contract";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../cn";
import { Chip, type ChipProps } from "./chip";
import { TAG_MARKERS } from "./markers";
import { type MarkerShape, markerVar, TagMarker } from "./tag-marker";

/** The six names of the closed palette (`@krizaka/organize` `MARKERS`; a test keeps them equal). */
export const MARKERS: readonly Marker[] = TAG_MARKERS;

export { type MarkerShape, TagMarker, type TagMarkerProps } from "./tag-marker";

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
export function TagChip({ marker, shape, children, ...props }: Readonly<TagChipProps>) {
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
  /**
   * Writes each colour's name beside its swatch (44 px targets, wrapping): a sighted person who cannot tell two hues apart still reads « red » and « amber ».
   * @default false
   */
  showNames?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

/** Recolours a tag from the closed palette: a radio group of swatches (arrow keys), the chosen one ticked and named. */
export function MarkerPicker({ label, names, value, defaultValue, onValueChange, markers = MARKERS, disabled, showNames, className }: Readonly<MarkerPickerProps>) {
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
            "inline-flex items-center justify-center rounded-full border border-border-default bg-surface-1 transition-colors",
            showNames ? "min-h-11 gap-2 px-3 text-xs" : "h-8 w-8",
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
          {showNames && names[marker]}
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}

export { type Marker } from "@krizaka/organize/contract";