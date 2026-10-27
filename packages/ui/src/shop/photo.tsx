// Server-safe. A photo in a box of one fixed ratio (CLS 0): the box is the ratio, the image fills it (ADR-007 §6).
import type * as React from "react";

import { cn } from "../cn";
import type { ShopPhoto } from "./frame";

const RATIOS = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
} as const;
export type ShopRatio = keyof typeof RATIOS;

export type PhotoProps = Omit<React.ComponentProps<"div">, "children"> & {
  photo: ShopPhoto;
  ratio: ShopRatio;
  /** The `sizes` of the image for this variant (ADR-007 §6). */
  sizes?: string;
  /** The first screen's image: high priority, never lazy. */
  priority?: boolean;
};

/** A photo in a fixed-ratio box; the look preset's grade and radius apply (`data-shop-photo`). */
export function Photo({ photo, ratio, sizes, priority, className, ...props }: PhotoProps) {
  return (
    <div data-shop-photo="" data-ratio={ratio} className={cn("relative w-full overflow-hidden bg-media", RATIOS[ratio], className)} {...props}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={photo.srcSet ? sizes : undefined}
        alt={photo.alt}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
