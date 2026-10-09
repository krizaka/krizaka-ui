// Server-safe. An indeterminate wait: an SVG ring, announced as a status with its `label`.
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const spinnerVariants = tv({
  base: "shrink-0 text-accent motion-safe:animate-spin",
  variants: { size: { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" } },
  defaultVariants: { size: "md" },
});

export type SpinnerProps = Omit<React.ComponentProps<"svg">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    /** The accessible name of the wait, e.g. "Loading" — passed translated. */
    label: string;
  };

/** A turning ring with `role="status"` (it stops turning under prefers-reduced-motion). */
export function Spinner({ label, size, className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      data-size={size ?? "md"}
      className={spinnerVariants({ size, className })}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
