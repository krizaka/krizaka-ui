// Server-safe. The backdrop of a page section in the brand's visual language (packages/tokens/BRAND.md).
import type * as React from "react";
import { tv } from "tailwind-variants";

export const sectionBackdropVariants = tv({
  slots: {
    root: "kz-backdrop",
    drift: "kz-backdrop-drift",
    dome: "kz-backdrop-dome",
    grid: "kz-backdrop-grid",
    media: "kz-backdrop-media",
  },
});

export interface SectionBackdropProps extends React.HTMLAttributes<HTMLElement> {
  /** The element: `section` (default), `header`, `footer` or `div`. */
  as?: "section" | "header" | "footer" | "div";
  /** Where the brand tint sits: `down` (default) starts tinted and ends on the page surface; `up` ends tinted (a closing call to action). */
  direction?: "down" | "up";
  /** The light dome above the content (the halo of a hero). Default true. */
  dome?: boolean;
  /** A floor of perspective lines under the content. Default false. */
  grid?: boolean;
  /** A foreground illustration or image, blurred for depth of field, behind the content (decorative: hidden from assistive technology). */
  media?: React.ReactNode;
  /** The very slow drift of the light (40 s); always still under prefers-reduced-motion. Default true. */
  animated?: boolean;
}

/**
 * A section of a page in the Krizaka visual language: the brand's section gradient (`--kz-brand-gradient-*`, so it
 * follows the brand theme and dark/light), a light dome, an optional perspective grid and a blurred foreground. Every
 * section ends on the page surface, so consecutive sections glide from one tint to the next. Text on it reads at AA
 * (tested in @krizaka/tokens).
 */
export function SectionBackdrop({ as: Tag = "section", direction = "down", dome = true, grid = false, media, animated = true, className, children, ...props }: SectionBackdropProps) {
  const s = sectionBackdropVariants();
  return (
    <Tag className={s.root({ className })} data-direction={direction} {...props}>
      {animated ? <div data-backdrop-layer aria-hidden className={s.drift()} /> : null}
      {dome ? <div data-backdrop-layer aria-hidden className={s.dome()} /> : null}
      {grid ? <div data-backdrop-layer aria-hidden className={s.grid()} /> : null}
      {media ? (
        <div data-backdrop-layer aria-hidden className={s.media()}>
          {media}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}
