// Server-safe. The invitation at the end of a section or a page (blocks.css): a title, why it matters, the ways to
// answer — in the hue of the page.
import type * as React from "react";

import { cn } from "../cn";

export type CtaPanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** The id of the title (an anchor others link to: `#discuss`). */
  id?: string;
  /** The invitation: `Something to say about it?`. */
  title: React.ReactNode;
  /** Why it matters, in one or two sentences. */
  body?: React.ReactNode;
  /** The ways to answer: an `ActionBar`, buttons. */
  children?: React.ReactNode;
  /**
   * The title's level.
   * @default 2
   */
  level?: 2 | 3;
  /** Rises once into place (`[data-reveal]`). Never on the first screen. */
  reveal?: boolean;
};

/** A call to act: title, why, the actions — the closing panel of a section or a page. */
export function CtaPanel({ id, title, body, children, level = 2, reveal, className, ...props }: CtaPanelProps) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className={cn("kz-cta", className)} data-reveal={reveal ? "" : undefined} {...props}>
      <div className="kz-cta-text">
        <H id={id} className="kz-cta-title">
          {title}
        </H>
        {body && <p className="kz-cta-body">{body}</p>}
      </div>
      {children && <div className="kz-cta-actions">{children}</div>}
    </div>
  );
}
