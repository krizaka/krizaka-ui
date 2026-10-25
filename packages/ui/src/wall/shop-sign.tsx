import type * as React from "react";

import { cn } from "../cn";
import { rotationStyle } from "./attachment";

export interface ShopSignProps extends Omit<React.ComponentProps<"div">, "children" | "style"> {
  /** The owner's logo or wordmark. Name an SVG/image accessibly, or use readable text. */
  logo: React.ReactNode;
  /** Enamel plate and screws, softly glowing neon, or a time-worn painted sign. */
  variant?: "enamel" | "neon" | "painted";
  /** Deterministic tilt in degrees; defaults to zero. */
  rotation?: number;
  /** Allow a single soft neon flicker on mount; defaults to true and respects reduced motion. */
  animated?: boolean;
}

/** A shop's own mark, as a plate, a neon, or a painted sign. */
export function ShopSign({ logo, variant = "enamel", rotation = 0, animated = true, className, ...props }: ShopSignProps) {
  return (
    <div {...props} className={cn("kz-shop-sign kz-wall-object", className)} style={rotationStyle(rotation)} data-variant={variant} data-animated={animated ? "" : undefined}>
      {variant === "enamel" && [0, 1, 2, 3].map((corner) => <span key={corner} aria-hidden="true" className="kz-shop-sign-screw" data-corner={corner} />)}
      <div className="kz-shop-sign-logo">{logo}</div>
    </div>
  );
}
