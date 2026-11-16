// Client (a Radix radio group). Recolours a tag from the closed palette of `TagChip`: its own file, so a page that wears tags
// without recolouring them does not pay for the picker.
import type { Marker } from "@krizaka/organize/contract";
import { RadioGroup as RadioPrimitive } from "radix-ui";

import { cn } from "../cn";
import { TAG_MARKERS } from "./markers";
import { markerVar } from "./tag-marker";

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
export function MarkerPicker({ label, names, value, defaultValue, onValueChange, markers = TAG_MARKERS, disabled, showNames, className }: Readonly<MarkerPickerProps>) {
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
            "inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border border-border-default bg-surface-1 transition-colors",
            showNames && "min-h-11 gap-2 px-3 text-xs",
            "hover:border-border-strong focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
            "data-[state=checked]:border-(--kz-marker) data-[state=checked]:bg-surface-2",
          )}
          style={{ ["--kz-marker" as string]: markerVar(marker) }}
        >
          <span aria-hidden className="relative inline-flex size-4 items-center justify-center rounded-full bg-(--kz-marker)">
            <RadioPrimitive.Indicator forceMount className="hidden size-full items-center justify-center data-[state=checked]:flex">
              {/* The tick is the second signal: a shape, not a colour (it reads in the page's text colour on the swatch's ring). */}
              <svg viewBox="0 0 24 24" className="size-3 text-surface-0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
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

