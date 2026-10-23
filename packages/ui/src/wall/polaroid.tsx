"use client";

import * as React from "react";

import { cn } from "../cn";
import { TapedPhoto } from "../taped-photo";
import { Attachment, finite, type WallObjectProps } from "./attachment";

export interface PolaroidProps extends Omit<React.ComponentProps<"figure">, "children" | "style">, WallObjectProps {
  /** The photo slot: an img or next/image, including fill inside this positioned frame. Supply its alt text. */
  img: React.ReactNode;
  /** A short handwritten caption, using the --kz-font-cahier role. */
  caption?: React.ReactNode;
  /** Enable the first-view develop effect; defaults to true, never runs under reduced motion. */
  develop?: boolean;
}

/** A photo held to the wall by tape or a pin, with a handwritten caption. */
export function Polaroid({ img, caption, rotation = 0, attachment = "tape", attachmentRotation = 0, develop = true, className, ...props }: PolaroidProps) {
  const ref = React.useRef<HTMLDivElement>(null);
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
    <TapedPhoto {...props} className={cn("kz-polaroid", className)} tilt={finite(rotation)} tape={attachment === "pin" ? "none" : "top"} caption={caption}
      style={{ "--kz-wall-attachment-rotation": `${finite(attachmentRotation)}deg` } as React.CSSProperties} data-develop={develop ? state : undefined}>
      {attachment === "pin" && <Attachment attachment="pin" attachmentRotation={attachmentRotation} />}
      <div ref={ref} className="kz-polaroid-photo">{img}</div>
    </TapedPhoto>
  );
}
