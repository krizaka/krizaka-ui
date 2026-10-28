// Server-safe: no hook. Removed and added lines of a proposal: each line carries a sign (− or +) AND a text label for
// screen readers, so the colour is never the only signal. Long lines wrap (a phone has no horizontal scroll).
import type * as React from "react";

import { cn } from "../cn";

export type DiffLine = {
  /** `removed` (−), `added` (+) or `context` (unchanged). */
  kind: "added" | "removed" | "context";
  /** The line's text, without its sign. */
  text: string;
};

export type DiffViewWords = {
  /** The group's accessible name: « Proposed changes ». */
  label: string;
  /** Read before an added line: « Added ». */
  added: string;
  /** Read before a removed line: « Removed ». */
  removed: string;
  /** Read before an unchanged line: « Unchanged ». */
  unchanged: string;
};

export type DiffViewProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The lines of the change, in order. */
  lines: readonly DiffLine[];
  /** The words, passed translated. */
  words: DiffViewWords;
};

const SIGN = { added: "+", removed: "−", context: " " } as const;
const TONE = {
  added: "bg-success/10 text-fg",
  removed: "bg-danger/10 text-fg",
  context: "text-fg-secondary",
} as const;

/** The lines of a change, signed and labelled; colour only reinforces. */
export function DiffView({ lines, words, className, ...props }: Readonly<DiffViewProps>) {
  const spoken = { added: words.added, removed: words.removed, context: words.unchanged } as const;
  return (
    <div role="group" aria-label={words.label} data-diff="" className={cn("overflow-hidden rounded-lg border border-border bg-surface-1 font-mono text-xs", className)} {...props}>
      {lines.map((line, index) => (
        <div key={`${index}-${line.kind}`} data-kind={line.kind} className={cn("flex gap-2 px-3 py-1", TONE[line.kind])}>
          <span aria-hidden className="w-3 shrink-0 select-none text-center font-semibold">
            {SIGN[line.kind]}
          </span>
          <span className="sr-only">{spoken[line.kind]}: </span>
          <span className="min-w-0 whitespace-pre-wrap break-words">{line.text}</span>
        </div>
      ))}
    </div>
  );
}
