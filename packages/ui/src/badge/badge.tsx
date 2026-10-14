// Server-safe: no hook, no context.
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { badgeRecipe } from "./recipe";

// Status tones are soft (a tint, a coloured dot, a text role): the invariant status tokens are too light to carry
// small text on a light surface, or to sit under white text (WCAG AA).
export const badgeVariants = tv(badgeRecipe);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export type BadgeProps = React.ComponentProps<"span"> &
  BadgeVariants & {
    /**
     * neutral · accent · success · warning · danger (soft tints, the text stays a text role) · scrim (on a media).
     * @default "neutral"
     */
    tone?: BadgeVariants["tone"];
    /**
     * sm · md.
     * @default "sm"
     */
    size?: BadgeVariants["size"];
    /** Makes the `dot` pulse (stopped under reduced motion). */
    pulse?: BadgeVariants["pulse"];
    /** A small dot before the text, in the tone's colour (pulsing with `pulse`). */
    dot?: boolean;
  };

export function Badge({ tone, size, pulse, dot, className, children, ...props }: BadgeProps) {
  return (
    <span data-tone={tone ?? "neutral"} className={badgeVariants({ tone, size, pulse, className })} {...props}>
      {dot && <span data-dot="" aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
