// Server-safe. A placeholder for content on its way: decorative, so hidden from assistive technology.
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const skeletonVariants = tv({
  base: "block bg-surface-3 motion-safe:animate-pulse",
  variants: {
    shape: { text: "h-3 w-full rounded-sm", circle: "aspect-square h-10 rounded-full", rect: "h-24 w-full rounded-lg" },
  },
  defaultVariants: { shape: "text" },
});

export type SkeletonProps = React.ComponentProps<"span"> & VariantProps<typeof skeletonVariants>;

/** A pulsing shape the size of what is loading. Announce the wait elsewhere (aria-busy on the region, a Spinner). */
export function Skeleton({ shape, className, ...props }: SkeletonProps) {
  return <span aria-hidden data-shape={shape ?? "text"} className={skeletonVariants({ shape, className })} {...props} />;
}
