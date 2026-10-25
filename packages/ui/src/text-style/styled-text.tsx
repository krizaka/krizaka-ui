// Server-safe: a text drawn with a stored text style. Whatever is passed as `value` goes through `parseTextStyle`.
import * as React from "react";

import { cx } from "../cx";
import { textStyleProps } from "./text-style";

export type StyledTextProps<T extends React.ElementType = "p"> = {
  /** The element drawn: `h1`…`h6`, `p`, `span`, `div`. */
  as?: T;
  /** The stored text style — validated here: anything invalid draws the default. */
  value?: unknown;
  /** Merged after the style's own class. */
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "value" | "className" | "style" | "children">;

/** A text role drawn from a `TextStyle`: its font, size, weight, spacing, alignment, case and tone, all from CSS variables. */
export function StyledText<T extends React.ElementType = "p">({ as, value, className, children, ...rest }: StyledTextProps<T>) {
  const Tag: React.ElementType = as ?? "p";
  const props = textStyleProps(value);
  return (
    <Tag {...rest} className={cx(props.className, className)} style={props.style}>
      {children}
    </Tag>
  );
}
