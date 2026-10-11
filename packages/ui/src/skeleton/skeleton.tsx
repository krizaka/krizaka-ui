// Server-safe. A placeholder for content on its way: decorative, so hidden from assistive technology. One reflection of
// the brand light crosses every skeleton of the page together (`background-attachment: fixed`), instead of each one
// pulsing on its own; under reduced motion they rest, tinted.
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const skeletonVariants = tv({
  base: "kz-skeleton block bg-surface-3",
  variants: {
    shape: { text: "h-3 w-full rounded-sm", circle: "aspect-square h-10 rounded-full", rect: "h-24 w-full rounded-lg" },
  },
  defaultVariants: { shape: "text" },
});

export type SkeletonProps = React.ComponentProps<"span"> & {
  /**
   * text (a line) · circle (an avatar; give it a height) · rect (a media; give it a height).
   * @default "text"
   */
  shape?: VariantProps<typeof skeletonVariants>["shape"];
};

/** A shape the size of what is loading. Announce the wait elsewhere (`LoadingRegion` does it, with `aria-busy`). */
export function Skeleton({ shape, className, ...props }: SkeletonProps) {
  return <span aria-hidden data-shape={shape ?? "text"} className={skeletonVariants({ shape, className })} {...props} />;
}

export type SkeletonTextProps = React.ComponentProps<"span"> & {
  /**
   * How many lines.
   * @default 3
   */
  lines?: number;
};

/** A paragraph on its way: `lines` lines, the last one shorter — like text that wraps. */
export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <span aria-hidden className={["flex w-full flex-col gap-2", className].filter(Boolean).join(" ")} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={i === lines - 1 && lines > 1 ? "w-3/5" : undefined} />
      ))}
    </span>
  );
}

export type SkeletonShapeProps = React.ComponentProps<"div">;

/**
 * The skeleton of the real thing: render your component with placeholder data inside, and its text, images and icons
 * become skeleton shapes in place — the exact layout, nothing to draw twice. Inert and hidden from assistive technology.
 */
export function SkeletonShape({ className, children, ...props }: SkeletonShapeProps) {
  return (
    <div aria-hidden inert className={["kz-skeleton-shape", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}
