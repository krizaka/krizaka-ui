// Client (the pointer's light). A responsive grid of cards (blocks.css): one column on a phone, the cells of a row
// share their height, each card rises once as it enters the viewport — staggered by column — and the pointer carries a
// light over the card it is on.
import * as React from "react";

import { cn } from "../cn";
import { POINTER_LIGHT_TARGET, usePointerLight } from "../pointer-light/pointer-light";

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
  /**
   * The light that follows the pointer over the cards (`[data-kz-light]`).
   * @default true
   */
  light?: boolean;
  /** `ul` when the cards are a list (each cell an `li`). */
  as?: "div" | "ul" | "ol";
};

/** A responsive grid of cards: equal rows, a staggered reveal, the pointer's light. */
export function CardGrid({ children, min = 300, fit = "fill", align = "stretch", reveal = true, columns = 3, light = true, as: Tag = "div", className, style, ...props }: CardGridProps) {
  const ref = React.useRef<HTMLElement>(null);
  usePointerLight(light ? ref : NO_REF, POINTER_LIGHT_TARGET);
  const Cell = Tag === "div" ? "div" : "li";
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("kz-cards", className)}
      data-fit={fit === "fit" ? "" : undefined}
      data-align={align === "start" ? "start" : undefined}
      style={{ "--kz-cards-min": `${min}px`, ...style } as React.CSSProperties}
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
}

const NO_REF: React.RefObject<HTMLElement | null> = { current: null };
