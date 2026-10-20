// Server-safe. The footnote and the caption of the Cahier (ADR-004, blocks.css): what a page says in small print. A
// `Caption` names a figure (`fig. 2 — The owl reads every line`); a `FootnoteRef` is the superscript number in the text,
// linked to its note; `Footnotes` lists the notes at the foot, each with its way back to the text.
import type * as React from "react";

import { cn } from "../cn";

export type CaptionProps = React.HTMLAttributes<HTMLElement> & {
  /** The figure's number, typed before the text: `fig. 2`. */
  figure?: React.ReactNode;
  /** `figcaption` inside a `<figure>`, `p` elsewhere. @default "figcaption" */
  as?: "figcaption" | "p";
};

/** A caption in the typewriter face: the figure's number, a dash, what it shows. */
export function Caption({ figure, as: Tag = "figcaption", className, children, ...props }: CaptionProps) {
  return (
    <Tag className={cn("kz-caption", className)} {...props}>
      {figure && <b className="kz-caption-figure">{figure}</b>}
      {figure && " — "}
      {children}
    </Tag>
  );
}

export type FootnoteRefProps = Omit<React.HTMLAttributes<HTMLElement>, "id"> & {
  /** The note's number. */
  n: number;
  /** The prefix of the ids, when a page has several sets of notes. @default "fn" */
  prefix?: string;
};

/** The superscript number in the text, linked to its note (and the note's link back lands here). */
export function FootnoteRef({ n, prefix = "fn", className, ...props }: FootnoteRefProps) {
  return (
    <sup id={`${prefix}-ref-${n}`} className={cn("kz-fnref", className)} {...props}>
      <a href={`#${prefix}-${n}`} aria-label={`Note ${n}`}>
        {n}
      </a>
    </sup>
  );
}

export type FootnotesProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The notes, in order: the first is note 1. */
  notes: readonly React.ReactNode[];
  /** The prefix of the ids (the same as the refs'). @default "fn" */
  prefix?: string;
  /** The heading of the notes, for assistive technology (visually a rule). @default "Notes" */
  label?: string;
  /** The label of the way back to the text. @default "Back to the text" */
  backLabel?: string;
};

/** The notes at the foot of a page: a short rule, numbered notes in small print, each with its way back to the text. */
export function Footnotes({ notes, prefix = "fn", label = "Notes", backLabel = "Back to the text", className, ...props }: FootnotesProps) {
  return (
    <aside aria-label={label} className={cn("kz-footnotes", className)} {...props}>
      <ol>
        {notes.map((note, i) => (
          <li key={i} id={`${prefix}-${i + 1}`}>
            {note}{" "}
            <a href={`#${prefix}-ref-${i + 1}`} className="kz-fn-back" aria-label={`${backLabel} (${i + 1})`}>
              ↩
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
