// Server-safe. The specimen tag of the Cahier (ADR-004, blocks.css): a manila tag with an eyelet, a typed catalogue
// number, a name, a stamp for the status and the fields of a record — the way a naturalist labels what was observed.
// It carries a product's or a component's status and meta; the stamp says the truth (`ok`, `wip`, `construction`).
import type * as React from "react";

import { cn } from "../cn";

export type StampTone = "ok" | "wip" | "construction" | "neutral";

export type StampProps = React.HTMLAttributes<HTMLSpanElement> & {
  /**
   * `ok` — released or usable today (green ink); `wip` — in development (pencil); `construction` — not open yet (the
   * margin's red); `neutral` — a fact.
   * @default "neutral"
   */
  tone?: StampTone;
};

/** A rubber stamp: a short status pressed on a tag or a page, double-ruled, slightly askew. */
export function Stamp({ tone = "neutral", className, ...props }: StampProps) {
  return <span className={cn("kz-stamp", className)} data-tone={tone} {...props} />;
}

export interface SpecimenField {
  /** The field's name, typed in lower case: `seen on`, `since`. */
  label: React.ReactNode;
  /** Its value: `web · iOS · Android`, `3.34.0`. */
  value: React.ReactNode;
}

export type SpecimenTagProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The catalogue number, typed at the top: `KZ-02`, `No. 042`. */
  code?: React.ReactNode;
  /** What the tag labels: a product's name, a component's. Set in the display face. */
  title?: React.ReactNode;
  /** The element of the title (`h3` in a grid of tags under a section's `h2`). @default "h3" */
  titleAs?: "h2" | "h3" | "h4" | "p" | "span";
  /** Beside the title: a product's mark, a bird (decorative). */
  mark?: React.ReactNode;
  /** The status, stamped: `{ label: "In development", tone: "wip" }`. */
  status?: { label: React.ReactNode; tone?: StampTone };
  /** The record: a label and a value per line, typed. */
  fields?: readonly SpecimenField[];
  /** What the tag says beyond its fields: one or two sentences. */
  children?: React.ReactNode;
  /** The foot of the tag: links (the site, the source), a note. */
  footer?: React.ReactNode;
  /**
   * `hang` — the tag hangs from a string (a row of tags on one wire); `pin` — pinned flat, no string.
   * @default "pin"
   */
  mount?: "hang" | "pin";
};

/**
 * A specimen tag: the eyelet, a typed number, a name, a stamp, the record's fields, a sentence and a foot — the status
 * and meta of a product or a component, labelled the way a field guide labels what it saw.
 */
export function SpecimenTag({ code, title, titleAs: Title = "h3", mark, status, fields, children, footer, mount = "pin", className, ...props }: SpecimenTagProps) {
  return (
    <article className={cn("kz-tag", className)} data-mount={mount} {...props}>
      <span className="kz-tag-eyelet" aria-hidden />
      {(code || status) && (
        <div className="kz-tag-head">
          {code && <span className="kz-tag-code">{code}</span>}
          {status && <Stamp tone={status.tone}>{status.label}</Stamp>}
        </div>
      )}
      {title && (
        <Title className="kz-tag-title">
          <span>{title}</span>
          {mark && <span className="kz-tag-mark" aria-hidden>{mark}</span>}
        </Title>
      )}
      {children && <div className="kz-tag-body">{children}</div>}
      {fields && fields.length > 0 && (
        <dl className="kz-tag-fields">
          {fields.map((f, i) => (
            <div key={i}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {footer && <div className="kz-tag-foot">{footer}</div>}
    </article>
  );
}
