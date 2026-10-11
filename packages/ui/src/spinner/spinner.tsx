// Server-safe. An indeterminate wait: the Krizaka loader glyph (a hexagon traced by light around a node), announced as
// a status with its `label`. For a wait with a delay, a value, an ETA or an ending, see `@krizaka/ui/loader`.
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";
import { LoaderGlyph } from "./glyph";

export const spinnerVariants = tv({
  base: "shrink-0 text-accent",
  variants: { size: { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" } },
  defaultVariants: { size: "md" },
});

export type SpinnerProps = Omit<React.ComponentProps<"svg">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    /**
     * sm · md · lg.
     * @default "md"
     */
    size?: VariantProps<typeof spinnerVariants>["size"];
    /** The accessible name of the wait, e.g. "Loading" — passed translated. */
    label: string;
    /** Between 0 and 1: the trace grows to the value (a determinate wait). Absent: it travels around. */
    value?: number | null;
  };

/**
 * The Krizaka spinner: a hexagon traced by a segment of light around a breathing node, in `currentColor` (the accent by
 * default). `role="status"`, named by `label`. Under prefers-reduced-motion it rests — a segment and the node lit.
 */
export function Spinner({ label, size, value, className, ...props }: SpinnerProps) {
  return (
    <LoaderGlyph
      role="status"
      aria-label={label}
      aria-hidden={undefined}
      value={value}
      data-size={size ?? "md"}
      className={spinnerVariants({ size, className })}
      {...props}
    />
  );
}
