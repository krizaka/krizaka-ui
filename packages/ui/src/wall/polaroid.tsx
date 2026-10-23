"use client";

import * as React from "react";

import { cn } from "../cn";
import { Attachment, rotationStyle, type WallObjectProps } from "./attachment";

export interface PolaroidProps extends Omit<React.ComponentProps<"figure">, "children" | "style">, WallObjectProps {
  /** The photo slot: an img or next/image, including fill inside this positioned frame. Supply its alt text. */
  img: React.ReactNode;
  /** A short handwritten caption, using the --kz-font-cahier role. */
  caption?: React.ReactNode;
  /** Enable the first-view develop effect; defaults to true, never runs under reduced motion. */
  develop?: boolean;
}

/** A photo held to the wall by tape or a pin, with a handwritten caption. */
export function Polaroid({ img, caption, rotation = 0, attachment, attachmentRotation, develop = true, className, ...props }: PolaroidProps) {
  const ref = React.useRef<HTMLElement>(null);
  const [state, setState] = React.useState<"waiting" | "ready" | undefined>();
  React.useEffect(() => {
    if (!develop || !ref.current || typeof IntersectionObserver === "undefined" || typeof matchMedia === "undefined") return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    let observer: IntersectionObserver | undefined;
    const sync = () => {
      observer?.disconnect();
      if (preference.matches) {
        seen = true;
        setState(undefined);
      } else if (!seen) {
        setState("waiting");
        observer = new IntersectionObserver((entries) => {
          if (seen || !entries.some((entry) => entry.isIntersecting)) return;
          seen = true;
          setState("ready");
          observer?.disconnect();
        }, { threshold: 0.15 });
        observer.observe(ref.current!);
      }
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { observer?.disconnect(); preference.removeEventListener("change", sync); };
  }, [develop]);
  return (
    <figure {...props} ref={ref} className={cn("kz-polaroid kz-wall-object", className)} style={rotationStyle(rotation)} data-develop={develop ? state : undefined}>
      <Attachment attachment={attachment} attachmentRotation={attachmentRotation} />
      <div className="kz-polaroid-photo">{img}</div>
      {caption && <figcaption className="kz-polaroid-caption">{caption}</figcaption>}
    </figure>
  );
}
