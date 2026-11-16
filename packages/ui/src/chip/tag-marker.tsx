// Server-safe: no hook, no context. The marker of a tag — a dot or Verikora's ribbon — drawn from a name of the closed palette
// (`--kz-tag-<name>`), decorative. `TagChip`, `MarkerPicker` and the chip links wear it.
import type { Marker } from "@krizaka/organize/contract";
import type * as React from "react";

import { cn } from "../cn";

/** The marker's shape: a `dot`, or the `ribbon` (a bookmark: a rectangle with a notch at the bottom). */
export type MarkerShape = "dot" | "ribbon";

/** The CSS custom property the marker reads its colour from: `--kz-tag-<name>`. */
export const markerVar = (marker: Marker) => `var(--kz-tag-${marker})`;

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
export function TagMarker({ marker, shape = "dot", className, style, ...props }: Readonly<TagMarkerProps>) {
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

