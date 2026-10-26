import type * as React from "react";

import { cn } from "../cn";
import { Stuck } from "../stuck";
import type { WallObjectProps } from "./attachment";

export interface PinnedNoteProps extends Omit<React.ComponentProps<"article">, "children" | "style">, WallObjectProps {
  /** The short message; capped at 140 Unicode code points without an ellipsis. */
  text: string;
  /** The optional author's signature, written in the handwriting role. */
  signature?: string;
  /** The ink of the pen: blue ink, the margin's red, or the page's hue. @default "blue" */
  ink?: "blue" | "margin" | "hue";
  /** How the note is held, through `Stuck`: a strip of tape or a pin. Takes over `attachment`. @default "tape" */
  hold?: "tape" | "pin";
  /** The lines of the text box, fixed so a late font never shifts the page (the text is read in full by assistive technology). @default 4 */
  lines?: number;
}

/** A short word on a cut-corner card, stuck into the notebook. */
export function PinnedNote({ text, signature, rotation = 0, attachment, attachmentRotation: _attachmentRotation, ink = "blue", hold, lines = 4, className, ...props }: PinnedNoteProps) {
  const rows = Math.max(1, Math.round(Number.isFinite(lines) ? lines : 4));
  return (
    <Stuck hold={hold ?? attachment ?? "tape"} tilt={Number.isFinite(rotation) ? rotation : 0} className="kz-wall-object kz-pinned-stuck">
      <article {...props} className={cn("kz-pinned-note", className)} data-shape="cut" data-ink={ink} style={{ "--kz-note-lines": rows } as React.CSSProperties}>
        <div className="kz-pinned-note-paper">
          <p className="kz-pinned-note-text">{Array.from(text).slice(0, 140).join("")}</p>
          {signature && <p className="kz-pinned-note-signature">{signature}</p>}
        </div>
      </article>
    </Stuck>
  );
}
