// Server-safe. A line between groups: decorative by default (hidden from assistive technology), or a real
// `role="separator"` with `decorative={false}`.
import { Separator as SeparatorPrimitive } from "radix-ui";
import type * as React from "react";
import { tv } from "tailwind-variants";

export const separatorVariants = tv({
  base: "shrink-0 bg-border-default",
  variants: { orientation: { horizontal: "h-px w-full", vertical: "h-full w-px self-stretch" } },
  defaultVariants: { orientation: "horizontal" },
});

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root>;

export function Separator({ orientation = "horizontal", decorative = true, className, ...props }: SeparatorProps) {
  return <SeparatorPrimitive.Root orientation={orientation} decorative={decorative} className={separatorVariants({ orientation, className })} {...props} />;
}
