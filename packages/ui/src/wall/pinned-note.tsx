import type * as React from "react";

import { cn } from "../cn";
import { Attachment, rotationStyle, type WallObjectProps } from "./attachment";

export interface PinnedNoteProps extends Omit<React.ComponentProps<"article">, "children" | "style">, WallObjectProps {
  /** The short message; capped at 140 Unicode code points without an ellipsis. */
  text: string;
  /** The optional author's signature, written in the handwriting role. */
  signature?: string;
}

/** A short word on a cut-corner card. */
export function PinnedNote({ text, signature, rotation = 0, attachment, attachmentRotation, className, ...props }: PinnedNoteProps) {
  return (
    <article {...props} className={cn("kz-pinned-note kz-wall-object", className)} style={rotationStyle(rotation)} data-shape="cut">
      <Attachment attachment={attachment} attachmentRotation={attachmentRotation} />
      <div className="kz-pinned-note-paper">
        <p className="kz-pinned-note-text">{Array.from(text).slice(0, 140).join("")}</p>
        {signature && <p className="kz-pinned-note-signature">{signature}</p>}
      </div>
    </article>
  );
}
