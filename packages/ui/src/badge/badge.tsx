// Server-safe: no hook, no context.
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";

// Status tones are soft (a tint, a coloured dot, a text role): the invariant status tokens are too light to carry
// small text on a light surface, or to sit under white text (WCAG AA).
export const badgeVariants = tv({
  // A label in the mono voice (BRAND.md §5: mono labels), its dot a node — the core of the marks, lit in the tone.
  base:
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono font-medium uppercase tracking-[0.06em] " +
    "[&>[data-dot]]:size-1.5 [&>[data-dot]]:rotate-45 [&>[data-dot]]:rounded-[1.5px]",
  variants: {
    tone: {
      neutral: "bg-surface-3 text-fg-secondary inset-ring inset-ring-border-default [&>[data-dot]]:bg-fg-muted",
      accent: "bg-accent-soft text-fg inset-ring inset-ring-accent/40 [&>[data-dot]]:bg-accent [&>[data-dot]]:shadow-[0_0_6px_var(--kz-accent)]",
      success: "bg-success-soft text-fg inset-ring inset-ring-success/40 [&>[data-dot]]:bg-success [&>[data-dot]]:shadow-[0_0_6px_var(--kz-success)]",
      warning: "bg-warning-soft text-fg inset-ring inset-ring-warning/40 [&>[data-dot]]:bg-warning [&>[data-dot]]:shadow-[0_0_6px_var(--kz-warning)]",
      danger: "bg-danger-soft text-fg inset-ring inset-ring-danger/40 [&>[data-dot]]:bg-danger [&>[data-dot]]:shadow-[0_0_6px_var(--kz-danger)]",
      /** On a media: veil and text invariant, identical in both themes. */
      scrim: "bg-scrim text-fg-on-media backdrop-blur-md [&>[data-dot]]:bg-fg-on-media",
    },
    size: { sm: "h-5 px-2 text-[10px]", md: "h-6 px-2.5 text-[11px]" },
    // `auto` (default): the griffe on a status — success, warning, danger are cut (`--kz-cut-shape`), the others pills.
    // `cut`: the Krizaka chamfer on any tone.
    shape: { auto: "rounded-full", pill: "rounded-full", cut: "rounded-(--kz-radius-xs) [corner-shape:bevel]" },
    pulse: { true: "[&>[data-dot]]:motion-safe:animate-pulse" },
  },
  compoundVariants: [{ tone: ["success", "warning", "danger"], shape: "auto", class: "rounded-(--kz-radius-xs) [corner-shape:var(--kz-cut-shape)]" }],
  defaultVariants: { tone: "neutral", size: "sm", shape: "auto" },
});

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
    /**
     * auto (the griffe on a status: success, warning and danger cut at 45°, the others pills) · pill · cut (any tone).
     * @default "auto"
     */
    shape?: BadgeVariants["shape"];
    /** Makes the `dot` pulse (stopped under reduced motion). */
    pulse?: BadgeVariants["pulse"];
    /** A node before the text — the core of the Krizaka marks, a small lit diamond in the tone's colour (pulsing with `pulse`). */
    dot?: boolean;
  };

export function Badge({ tone, size, shape, pulse, dot, className, children, ...props }: BadgeProps) {
  return (
    <span data-tone={tone ?? "neutral"} className={badgeVariants({ tone, size, shape, pulse, className })} {...props}>
      {dot && <span data-dot="" aria-hidden />}
      {children}
    </span>
  );
}
