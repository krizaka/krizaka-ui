// The taped photo of the Cahier (ADR-004, blocks.css): a print stuck in the notebook — slightly tilted, a thin white print
// border, a soft paper shadow (layered, never a glow), strips of tape. Whatever it holds (an image, a video, a live scene)
// is its picture; the tilt is a transform, so nothing shifts and the picture keeps its own box. Server-safe: no state.
import type * as React from "react";

import { cn } from "../cn";

export type TapedPhotoProps = React.HTMLAttributes<HTMLElement> & {
  /** The picture: an `img`, a `video`, a scene. It fills the print. */
  children: React.ReactNode;
  /** A line written under the picture, on the print. */
  caption?: React.ReactNode;
  /** The tilt in degrees (negative leans left); eased on a phone. @default -1.6 */
  tilt?: number;
  /** Where the tape holds it: two opposite `corners`, one strip at the `top`, or `none`. @default "corners" */
  tape?: "corners" | "top" | "none";
};

/** A print taped in the notebook: tilted, a white border, a paper shadow, tape at two corners or at the top. */
export function TapedPhoto({ children, caption, tilt = -1.6, tape = "corners", className, style, ...props }: TapedPhotoProps) {
  return (
    <figure
      className={cn("kz-taped", className)}
      data-tape={tape === "corners" ? undefined : tape}
      style={{ ...style, ["--kz-taped-tilt" as string]: `${tilt}deg` }}
      {...props}
    >
      <div className="kz-taped-picture">{children}</div>
      {caption ? <figcaption className="kz-taped-caption">{caption}</figcaption> : null}
    </figure>
  );
}
