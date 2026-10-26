// Server-safe. A line between groups: decorative by default (hidden from assistive technology), or a real
// `role="separator"` with `decorative={false}`. `variant="hand"` draws it by hand (Cahier): three shapes, one inline SVG
// path stretched to the width, 6 px tall.
import { Separator as SeparatorPrimitive } from "radix-ui";
import type * as React from "react";
import { tv } from "tailwind-variants";

export const separatorVariants = tv({
  base: "shrink-0 bg-border-default",
  variants: { orientation: { horizontal: "h-px w-full", vertical: "h-full w-px self-stretch" } },
  defaultVariants: { orientation: "horizontal" },
});

const handVariants = tv({
  base: "block h-1.5 w-full shrink-0 overflow-hidden",
  variants: {
    tone: {
      hue: "text-[color-mix(in_srgb,var(--kz-hue,var(--kz-accent))_60%,transparent)]",
      ink: "text-fg",
    },
  },
  defaultVariants: { tone: "hue" },
});

/** The three hand-drawn shapes, in a 100 x 6 box that is stretched to the width: fixed paths, so the same shape always draws the same line. */
export const HAND_SHAPES = {
  stroke: "M0 3.4C9 2.1 17 4.4 28 3.2S47 1.9 58 3.3 79 4.4 89 2.9L100 3.1",
  wave: "M0 3Q4 0.6 8 3T16 3 24 3 32 3 40 3 48 3 56 3 64 3 72 3 80 3 88 3 96 3 100 3",
  dash: "M1 3.2H11M16 2.8H31M36 3.3H44M50 2.9H67M72 3.2H80M86 2.8H99",
} as const;
export type HandShape = keyof typeof HAND_SHAPES;

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  /**
   * `line` — a hairline; `hand` — drawn by hand (horizontal only).
   * @default "line"
   */
  variant?: "line" | "hand";
  /**
   * `variant="hand"`: the stroke's shape.
   * @default "stroke"
   */
  shape?: HandShape;
  /**
   * `variant="hand"`: the page's hue at 60 %, or the ink.
   * @default "hue"
   */
  tone?: "hue" | "ink";
};

export function Separator({ orientation = "horizontal", decorative = true, variant = "line", shape = "stroke", tone = "hue", className, ...props }: SeparatorProps) {
  if (variant === "hand") {
    return (
      <SeparatorPrimitive.Root orientation="horizontal" decorative={decorative} data-variant="hand" data-shape={shape} data-tone={tone} className={handVariants({ tone, className })} {...props}>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" className="block h-1.5 w-full">
          <path d={HAND_SHAPES[shape]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
        </svg>
      </SeparatorPrimitive.Root>
    );
  }
  return <SeparatorPrimitive.Root orientation={orientation} decorative={decorative} className={separatorVariants({ orientation, className })} {...props} />;
}
