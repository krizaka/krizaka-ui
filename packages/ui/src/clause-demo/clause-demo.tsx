// The page's one interactive moment (krizaka-internal#4693): the lines of a document the visitor hovers, taps or reaches with
// the keyboard, and beside them what the check said of that line — its verdict, the words it quotes and the reference it
// cites. Real data passed by the host, no network. It opens on the first `danger` line. Client: the open line is state.
import { Badge } from "@krizaka/ui/badge";
import * as React from "react";

import { cn } from "../cn";
import { CahierSheet } from "../product-page/cahier-sheet";

/** The verdict's colour: a closed set of status roles. */
export type ClauseTone = "danger" | "warning" | "success" | "neutral";

export interface ClauseFinding {
  /** The verdict, as the product says it (`To check`): data, never typed in the block. */
  verdict: string;
  tone: ClauseTone;
  /** What the check found, in one sentence. */
  title: string;
  /** The words of the line it relies on. */
  quote?: string;
  /** The reference it cites (an article, a rule). */
  reference: string;
}

export interface ClauseLine {
  id: string;
  text: string;
  /** What the check said of this line; a line without one is quiet text. */
  finding?: ClauseFinding;
}

export type ClauseDemoProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The invitation (`Touch a clause.`): the section's `h2`. */
  title: React.ReactNode;
  /** A tag on the paper (`Fictional lease`). */
  tag?: React.ReactNode;
  /** The document's lines, in order; those with a `finding` are the controls. */
  lines: readonly ClauseLine[];
};

function firstOpen(lines: readonly ClauseLine[]): number {
  const danger = lines.findIndex((l) => l.finding?.tone === "danger");
  return danger >= 0 ? danger : Math.max(0, lines.findIndex((l) => l.finding));
}

function Answer({ finding }: Readonly<{ finding: ClauseFinding }>) {
  return (
    <div className="kz-clause-answer">
      <Badge tone={finding.tone} className="self-start">
        {finding.verdict}
      </Badge>
      <p className="kz-clause-title">{finding.title}</p>
      {finding.quote && <blockquote className="kz-clause-quote">{finding.quote}</blockquote>}
      <p className="kz-clause-ref">{finding.reference}</p>
    </div>
  );
}

/** A document whose lines answer the hand: hover, tap or Tab to a line, read its verdict, quote and reference. */
export function ClauseDemo({ title, tag, lines, className, ...props }: Readonly<ClauseDemoProps>) {
  const [open, setOpen] = React.useState(() => firstOpen(lines));
  const ids = React.useId();
  const finding = lines[open]?.finding;
  return (
    <section className={cn("kz-clause", className)} aria-labelledby={`${ids}-title`} {...props}>
      <div className="kz-clause-grid">
        <div className="kz-clause-doc">
          <h2 id={`${ids}-title`}>{title}</h2>
          <CahierSheet
            tag={tag}
            lines={lines.map((l, i) => ({ text: l.text, flagged: i === open }))}
            renderLine={(line, i) =>
              lines[i]?.finding ? (
                <button
                  type="button"
                  className="kz-clause-line"
                  aria-pressed={i === open}
                  aria-controls={`${ids}-answer`}
                  data-tone={lines[i]?.finding?.tone}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(i)}
                >
                  {line.text}
                </button>
              ) : (
                <span className="kz-sheet-ink" data-quiet="">
                  {line.text}
                </span>
              )
            }
          />
        </div>
        <div id={`${ids}-answer`} className="kz-clause-panel" aria-live="polite">
          {finding && <Answer key={open} finding={finding} />}
        </div>
      </div>
    </section>
  );
}
