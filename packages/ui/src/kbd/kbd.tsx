// Server-safe. A key, or a shortcut of several (`<Kbd>⌘</Kbd><Kbd>K</Kbd>`).
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";

export const kbdVariants = tv({
  base:
    // A key: raised, lit on its top edge, its base a shade deeper (BRAND.md §6).
    "inline-flex shrink-0 items-center justify-center rounded-(--kz-radius-xs) border border-border-default border-b-[3px] border-b-border-strong bg-surface-2 bg-sheen " +
    "font-mono font-medium text-fg-secondary shadow-raised inset-shadow-edge",
  variants: { size: { sm: "h-5 min-w-5 px-1 text-[10px]", md: "h-6 min-w-6 px-1.5 text-xs" } },
  defaultVariants: { size: "md" },
});

export type KbdProps = React.ComponentProps<"kbd"> & {
  /**
   * sm · md.
   * @default "md"
   */
  size?: VariantProps<typeof kbdVariants>["size"];
};

export function Kbd({ size, className, ...props }: KbdProps) {
  return <kbd className={kbdVariants({ size, className })} {...props} />;
}
