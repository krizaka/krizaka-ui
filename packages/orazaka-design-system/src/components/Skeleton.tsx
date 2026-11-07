import { cn } from "@krizaka/ui/cn";
import { Skeleton as KzSkeleton, type SkeletonProps as KzSkeletonProps, skeletonVariants } from "@krizaka/ui/skeleton";

export { skeletonVariants };

/** Props of {@link Skeleton}: the @krizaka/ui skeleton, plus the 1.x shorthands. */
export type SkeletonProps = KzSkeletonProps & {
  /** @deprecated Since 2.0 — use `shape` (same names). */
  variant?: NonNullable<KzSkeletonProps["shape"]>;
  /** @deprecated Since 2.0 — size it with a `className` (`w-32`) or `style`. */
  width?: string;
  /** @deprecated Since 2.0 — size it with a `className` (`h-4`) or `style`. */
  height?: string;
};

/**
 * The @krizaka/ui skeleton (`shape` text · circle · rect, pulsing, hidden from assistive technology). The 1.x
 * `variant`, `width` and `height` are kept as deprecated shorthands; the default shape stays `rect`.
 *
 * @param props - {@link SkeletonProps}
 * @returns A loading placeholder.
 */
export function Skeleton({ variant, shape, width, height, style, ...props }: SkeletonProps) {
  const sized = width || height ? { width, height, ...style } : style;
  return <KzSkeleton shape={shape ?? variant ?? "rect"} style={sized} {...props} />;
}

/** Props of {@link SkeletonGroup}. */
export interface SkeletonGroupProps {
  /** The number of text lines; the last one is shorter. Default 3. */
  lines?: number;
  /** Extra classes on the group (its width), merged last. */
  className?: string;
}

/**
 * A paragraph of text skeletons; the last line is shorter.
 *
 * @param props - `lines` (default 3) and `className`.
 * @returns A group of text skeletons.
 */
export function SkeletonGroup({ lines = 3, className }: Readonly<SkeletonGroupProps>) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} shape="text" className={i === lines - 1 ? "w-3/5" : undefined} />
      ))}
    </div>
  );
}
