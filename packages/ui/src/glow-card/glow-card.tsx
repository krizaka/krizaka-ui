// Client (the pointer). A card that answers light: a soft bloom of the brand accent follows the pointer across it, and
// its border is a ring of the brand gradient that turns slowly and brightens under the pointer or the focus. Composited
// properties only (CSS variables, opacity); no animation frame — the pointer writes two variables. Under reduced motion
// the ring rests at a fixed angle and the light stays where it is: a designed still frame, not a switched-off one.
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "../cn";

export type GlowCardProps = React.ComponentProps<"div"> & {
  /**
   * `border` (a still hairline ring of the brand gradient) or `both`. `spotlight` (the bloom under the pointer) is
   * deprecated since 3.31 (krizaka-ui#393) and draws nothing.
   * @default "both"
   */
  glow?: "border" | "spotlight" | "both";
  /** Renders your element (a link, an article) with the card's look and behaviour. */
  asChild?: boolean;
  /**
   * A featured card: the ring is fuller at rest. It never turns.
   * @default false
   */
  alive?: boolean;
};

/** A card ringed by the brand: a still hairline of its gradient, a step brighter under the pointer. Content is yours. */
export function GlowCard({ glow = "both", asChild, alive, className, ...props }: GlowCardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-glow={glow}
      data-alive={alive ? "" : undefined}
      className={cn("kz-glow relative isolate rounded-2xl border border-border-default bg-surface-1 p-6", className)}
      {...props}
    />
  );
}
