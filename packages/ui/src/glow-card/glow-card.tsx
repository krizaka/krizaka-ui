// Client (the pointer). A card that answers light: a soft bloom of the brand accent follows the pointer across it, and
// its border is a ring of the brand gradient that turns slowly and brightens under the pointer or the focus. Composited
// properties only (CSS variables, opacity); no animation frame — the pointer writes two variables. Under reduced motion
// the ring rests at a fixed angle and the light stays where it is: a designed still frame, not a switched-off one.
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "../cn";

export type GlowCardProps = React.ComponentProps<"div"> & {
  /**
   * What answers: `border` (the turning gradient ring), `spotlight` (the bloom under the pointer), or `both`.
   * @default "both"
   */
  glow?: "border" | "spotlight" | "both";
  /** Renders your element (a link, an article) with the card's look and behaviour. */
  asChild?: boolean;
  /**
   * The ring turns slowly even at rest (a featured card). Otherwise it rests until hovered or focused.
   * @default false
   */
  alive?: boolean;
};

/** A card lit by the brand: a bloom that follows the pointer, a gradient ring that turns. Content is yours. */
export function GlowCard({ glow = "both", asChild, alive, className, onPointerMove, ...props }: GlowCardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-glow={glow}
      data-alive={alive ? "" : undefined}
      className={cn("kz-glow kz-loop relative isolate rounded-2xl border border-border-default bg-surface-1 p-6", className)}
      onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
        const box = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--kz-glow-x", `${e.clientX - box.left}px`);
        e.currentTarget.style.setProperty("--kz-glow-y", `${e.clientY - box.top}px`);
        onPointerMove?.(e);
      }}
      {...props}
    />
  );
}
