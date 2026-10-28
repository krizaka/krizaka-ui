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
  /** The colour of the paper: the page's own, or a real post-it (butter, rose, mint, sky), pale in both themes with the pen dark on it. @default "plain" */
  paper?: "plain" | "butter" | "rose" | "mint" | "sky";
  /** A small action under the words (a link, a button) kept inside the note and reachable by keyboard; it is never part of the capped text. */
  action?: React.ReactNode;
  /** How many Unicode code points of `text` are kept (a flyer longer than a word is read whole). @default 140 */
  limit?: number;
  /** The lines of the text box, fixed so a late font never shifts the page (the text is read in full by assistive technology). @default 4 */
  lines?: number;
}

/** A short word on a cut-corner card, stuck into the notebook. */
export function PinnedNote({ text, signature, rotation = 0, attachment, attachmentRotation: _attachmentRotation, ink = "blue", paper = "plain", action, limit = 140, hold, lines = 4, className, ...props }: PinnedNoteProps) {
  const rows = Math.max(1, Math.round(Number.isFinite(lines) ? lines : 4));
  return (
    <Stuck hold={hold ?? attachment ?? "tape"} tilt={Number.isFinite(rotation) ? rotation : 0} className="kz-wall-object kz-pinned-stuck">
      <article {...props} className={cn("kz-pinned-note", className)} data-shape="cut" data-ink={ink} data-paper={paper === "plain" ? undefined : paper} style={{ "--kz-note-lines": rows } as React.CSSProperties}>
        <div className="kz-pinned-note-paper">
          <p className="kz-pinned-note-text">{Array.from(text).slice(0, Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 140).join("")}</p>
          {signature && <p className="kz-pinned-note-signature">{signature}</p>}
          {action && <div className="kz-pinned-note-action">{action}</div>}
        </div>
      </article>
    </Stuck>
  );
}
