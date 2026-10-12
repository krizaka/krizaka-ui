// Client (the bird has an id per instance). A rule, a promise or a decision told by a bird (blocks.css): the sentence in
// a speech bubble — an opening quote mark, the hue around it — and under its tail the bird and who speaks. One bird per
// idea (Mascot's rule): the falcon watches, the owl reads, the duck builds, the flamingo answers or gets paid, the
// pigeon delivers, the lovebird introduces, the crane listens.
import type * as React from "react";

import { cn } from "../cn";
import { type MascotBird, type MascotMood } from "../mascots/geometry";
import { Mascot } from "../mascots/mascot";

export type MascotQuoteProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The bird that speaks — the one whose idea it is. */
  bird: MascotBird;
  /**
   * Its mood.
   * @default "thinking"
   */
  mood?: MascotMood;
  /** Who speaks, under the bubble: `The falcon's rule`. */
  label: React.ReactNode;
  /** The sentence: the rule, the promise. */
  children: React.ReactNode;
  /**
   * `inline` inside a card (small, the bird answers the pointer); `callout` alone in a section (larger, the bird alive).
   * @default "inline"
   */
  variant?: "inline" | "callout";
  /** The bird's idle loop (it pauses off screen and stops under reduced motion). Defaults to `true` for a callout. */
  animated?: boolean;
};

/** A sentence told by a bird: a speech bubble, the bird under its tail, who speaks. The bird is decorative. */
export function MascotQuote({ bird, mood = "thinking", label, children, variant = "inline", animated, className, ...props }: MascotQuoteProps) {
  const callout = variant === "callout";
  return (
    <figure className={cn("kz-quote", className)} data-variant={callout ? "callout" : undefined} {...props}>
      <blockquote>
        <p>{children}</p>
      </blockquote>
      <figcaption>
        <Mascot bird={bird} mood={mood} size={callout ? 72 : 44} animated={animated ?? callout} className="kz-quote-bird" aria-hidden />
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}
