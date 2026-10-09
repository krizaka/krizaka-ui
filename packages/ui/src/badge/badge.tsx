// Server-safe: no hook, no context.
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

// Status tones are soft (a tint, a coloured dot, a text role): the invariant status tokens are too light to carry
// small text on a light surface, or to sit under white text (WCAG AA).
export const badgeVariants = tv({
  base: "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-semibold uppercase tracking-wider",
  variants: {
    tone: {
      neutral: "bg-surface-3 text-fg-secondary",
      accent: "bg-accent-soft text-fg ring-1 ring-inset ring-accent/40 [&>[data-dot]]:bg-accent",
      success: "bg-success/15 text-fg ring-1 ring-inset ring-success/40 [&>[data-dot]]:bg-success",
      warning: "bg-warning/15 text-fg ring-1 ring-inset ring-warning/40 [&>[data-dot]]:bg-warning",
      danger: "bg-danger/15 text-fg ring-1 ring-inset ring-danger/40 [&>[data-dot]]:bg-danger",
      /** On a media: veil and text invariant, identical in both themes. */
      scrim: "bg-scrim text-fg-on-media backdrop-blur-md",
    },
    size: { sm: "px-2 py-0.5 text-[10px]", md: "px-2.5 py-1 text-[11px]" },
    pulse: { true: "[&>[data-dot]]:motion-safe:animate-pulse" },
  },
  defaultVariants: { tone: "neutral", size: "sm" },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export type BadgeProps = React.ComponentProps<"span"> &
  BadgeVariants & {
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
