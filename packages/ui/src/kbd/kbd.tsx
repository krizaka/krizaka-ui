// Server-safe. A key, or a shortcut of several (`<Kbd>⌘</Kbd><Kbd>K</Kbd>`).
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const kbdVariants = tv({
  base:
    "inline-flex shrink-0 items-center justify-center rounded-md border border-border-default border-b-2 bg-surface-2 " +
    "font-mono font-semibold text-fg-secondary",
  variants: { size: { sm: "h-5 min-w-5 px-1 text-[10px]", md: "h-6 min-w-6 px-1.5 text-xs" } },
  defaultVariants: { size: "md" },
});

export type KbdProps = React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>;

export function Kbd({ size, className, ...props }: KbdProps) {
  return <kbd className={kbdVariants({ size, className })} {...props} />;
}
