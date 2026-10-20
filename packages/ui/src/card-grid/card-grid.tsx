// A responsive grid of cards (blocks.css): one column on a phone, the cells of a row share their height, each card rises
// once as it enters the viewport — staggered by column. The hover is the cards' own quiet one (krizaka-ui#393).
import * as React from "react";

import { cn } from "../cn";
import type { CardHover } from "../link-card/link-card";

const STEP_MS = 70;

export type CardGridProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The cards: one cell each. */
  children: React.ReactNode;
  /**
   * The narrowest a column may be, in pixels: the grid fits as many columns as the width allows.
   * @default 300
   */
  min?: number;
  /**
   * `fill` keeps empty tracks (a lone card keeps its width); `fit` stretches the cards of a short row across the width.
   * @default "fill"
   */
  fit?: "fill" | "fit";
  /**
   * `stretch` gives the cells of a row one height; `start` lets each card keep its own (cards that open a panel).
   * @default "stretch"
   */
  align?: "stretch" | "start";
  /**
   * The cards rise once into place (`[data-reveal]`, MotionObserver), staggered by column. `false` on the first screen.
   * @default true
   */
  reveal?: boolean;
  /**
   * The columns the stagger counts (the delay restarts on every row).
   * @default 3
   */
  columns?: number;
  /** @deprecated Since 3.31 (krizaka-ui#393): does nothing — no light follows the pointer. Removed in 4.0. */
  light?: boolean;
  /** `ul` when the cards are a list (each cell an `li`). */
  as?: "div" | "ul" | "ol";
  /**
   * A foundation: one wide card that the cards of the grid stand on (an engine, a platform, a shared service). It spans
   * the full width beside the grid, and a hairline joins it to a frame around the cards — "everything inside runs on it".
   * The frame takes the hue of `className` (a `data-hue` or a brand class on the grid sets it for the whole block).
   */
  foundation?: React.ReactNode;
  /**
   * Where the foundation sits: above the cards, or under them.
   * @default "start"
   */
  foundationPosition?: "start" | "end";
  /** A short mono label on the frame's edge, naming the relation (`Powered by Orazaka`). Only with `foundation`. */
  foundationLabel?: React.ReactNode;
  /** @deprecated Since 3.31 (krizaka-ui#393): does nothing — every card has the one quiet hover. Removed in 4.0. */
  hover?: CardHover;
};

/** A responsive grid of cards: equal rows, a staggered reveal. */
export function CardGrid({
  children,
  min = 300,
  fit = "fill",
  align = "stretch",
  reveal = true,
  columns = 3,
  light: _light,
  as: Tag = "div",
  foundation,
  foundationPosition = "start",
  foundationLabel,
  hover: _hover,
  className,
  style,
  ...props
}: CardGridProps) {
  const Cell = Tag === "div" ? "div" : "li";
  const grid = (
    <Tag
      className={cn("kz-cards", !foundation && className)}
      data-fit={fit === "fit" ? "" : undefined}
      data-align={align === "start" ? "start" : undefined}
      style={{ "--kz-cards-min": `${min}px`, ...(foundation ? null : style) } as React.CSSProperties}
      {...props}
    >
      {React.Children.toArray(children).map((child, i) => {
        const step = Math.min(i % Math.max(columns, 1), 5);
        return (
          <Cell
            key={React.isValidElement(child) && child.key != null ? child.key : i}
            className="kz-cards-cell"
            data-reveal={reveal ? "" : undefined}
            style={reveal && step ? ({ "--kz-delay": `${step * STEP_MS}ms` } as React.CSSProperties) : undefined}
          >
            {child}
          </Cell>
        );
      })}
    </Tag>
  );
  if (!foundation) return grid;
  return (
    <div className={cn("kz-foundation", className)} data-position={foundationPosition} style={style}>
      <div className="kz-foundation-base" data-reveal={reveal ? "" : undefined}>
        {foundation}
      </div>
      <div className="kz-foundation-group">
        {foundationLabel && <span className="kz-foundation-label">{foundationLabel}</span>}
        {grid}
      </div>
    </div>
  );
}

