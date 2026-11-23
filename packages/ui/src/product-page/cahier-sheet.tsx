// A page of a document as a paper object in the Cahier hand: ink, the red margin, a § per line, faint ruling. With `reading`,
// each line is read in turn (a beam of the brand's light passes, an ink caret writes at its end) and the flagged line keeps the
// pen's mark. Decorative motion only: the text is real and stays text. Server-safe; a host may make a line a control.
import type * as React from "react";

import { cn } from "../cn";

/** A line of the document; `flagged`: the one the product found. */
export type SheetLine = { text: string; flagged?: boolean };

export type CahierSheetProps = {
  /** The document's lines, in order; the `flagged` one keeps the pen's mark. */
  lines: readonly SheetLine[];
  /** A tag on the paper's edge (`Fictional lease`). */
  tag?: React.ReactNode;
  /** The reading beam passes over each line, then the pen marks the flagged one. */
  reading?: boolean;
  /** Draws a line as something else (a button): the host's control, inside the line's `§`. */
  renderLine?: (line: SheetLine, index: number) => React.ReactNode;
  /** Classes of the paper, merged last. */
  className?: string;
};

/** A document's page on paper, its lines numbered in the red margin. */
export function CahierSheet({ lines, tag, reading, renderLine, className }: Readonly<CahierSheetProps>) {
  return (
    <div className={cn("kz-sheet", className)} data-reading={reading ? "" : undefined}>
      {tag && <span className="kz-sheet-tag">{tag}</span>}
      <ol className="kz-sheet-lines">
        {lines.map((line, i) => (
          <li key={`${i}-${line.text}`} className="kz-sheet-line" data-flag={line.flagged ? "" : undefined} style={{ "--i": i } as React.CSSProperties}>
            <span className="kz-sheet-par" aria-hidden>
              §{i + 1}
            </span>
            {renderLine ? renderLine(line, i) : <span className="kz-sheet-ink">{line.text}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
