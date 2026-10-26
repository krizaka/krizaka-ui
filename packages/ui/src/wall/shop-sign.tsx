"use client";

import * as React from "react";

import { cn } from "../cn";
import { rotationStyle } from "./attachment";

export interface ShopSignProps extends Omit<React.ComponentProps<"div">, "style"> {
  /** The shop's name as live text, in the sign's lettering: the page's heading (`as`). Prefer it to an image of the name. */
  children?: React.ReactNode;
  /** The element of the name: the page's `h1` by default, `h2`/`h3` for a second sign, `p` for none. A sign on a `Wall` is a `p` unless told otherwise. */
  as?: "h1" | "h2" | "h3" | "p";
  /** The owner's logo or wordmark, optional beside the name. Name an SVG/image accessibly, or use readable text. */
  logo?: React.ReactNode;
  /** Enamel plate and screws, softly glowing neon, a time-worn painted sign, or `none` (the name alone on paper). */
  variant?: "enamel" | "neon" | "painted" | "none";
  /** Deterministic tilt in degrees; defaults to zero. */
  rotation?: number;
  /** Allow one soft neon flicker the first time the sign is seen; defaults to true, never loops, respects reduced motion. */
  animated?: boolean;
}

/** The neon's first view: `waiting` until it is on screen, then `ready` once. Nothing under reduced motion or without observers. */
function useFirstView(enabled: boolean) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<"waiting" | "ready" | undefined>();
  React.useEffect(() => {
    if (!enabled || !ref.current || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    let observer: IntersectionObserver | undefined;
    const sync = () => {
      observer?.disconnect();
      if (preference.matches) {
        setState(undefined);
      } else if (!seen) {
        setState("waiting");
        observer = new IntersectionObserver((entries) => {
          if (seen || !entries.some((entry) => entry.isIntersecting)) return;
          seen = true;
          setState("ready");
          observer?.disconnect();
        }, { threshold: 0.3 });
        observer.observe(ref.current!);
      }
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { observer?.disconnect(); preference.removeEventListener("change", sync); };
  }, [enabled]);
  return [ref, state] as const;
}

/** A shop's own mark, as a plate, a neon, a painted sign, or the name alone. */
export function ShopSign({ children, as: Name = "h1", logo, variant = "enamel", rotation = 0, animated = true, className, ...props }: ShopSignProps) {
  const [ref, lit] = useFirstView(variant === "neon" && animated);
  return (
    <div {...props} ref={ref} className={cn("kz-shop-sign kz-wall-object", className)} style={rotationStyle(rotation)} data-variant={variant} data-animated={animated ? "" : undefined} data-lit={lit}>
      {variant === "enamel" && [0, 1, 2, 3].map((corner) => <span key={corner} aria-hidden="true" className="kz-shop-sign-screw" data-corner={corner} />)}
      {logo && <div className="kz-shop-sign-logo">{logo}</div>}
      {children && <Name className="kz-shop-sign-name">{children}</Name>}
    </div>
  );
}
