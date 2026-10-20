// Server-safe. The index of the Cahier (ADR-004, blocks.css): a book's index — groups, entries, a dotted leader and the
// page number at the end of the line — for a documentation's sidebar or a catalogue. The current entry is marked by the
// margin's arrow; the numbers are the reader's landmarks (`No. 042` on the component's page).
import type * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";

export interface IndexEntry {
  /** The entry: `Button`. */
  label: React.ReactNode;
  /** Where it leads. */
  href: string;
  /** Its number at the end of the line: `42`. */
  page?: React.ReactNode;
  /** The page the reader is on. */
  current?: boolean;
}

export interface IndexGroup {
  /** The group's heading, typed: `Actions`. */
  title: React.ReactNode;
  entries: readonly IndexEntry[];
}

export type PageIndexProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The groups, in reading order. */
  groups: readonly IndexGroup[];
  /** The accessible name of the navigation. @default "Index" */
  label?: string;
  /** The app's router link (Next's `Link`), so internal entries prefetch. */
  linkAs?: LinkComponent;
};

/** A book's index: headings, entries, a dotted leader and the page number; the current entry marked in the margin. */
export function PageIndex({ groups, label = "Index", linkAs, className, ...props }: PageIndexProps) {
  return (
    <nav aria-label={label} className={cn("kz-index", className)} {...props}>
      {groups.map((g, gi) => (
        <section key={gi} className="kz-index-group">
          <h4 className="kz-index-title">{g.title}</h4>
          <ul>
            {g.entries.map((e, i) => (
              <li key={i}>
                <BlockLink href={e.href} linkAs={linkAs} className="kz-index-entry" aria-current={e.current ? "page" : undefined}>
                  <span className="kz-index-label">{e.label}</span>
                  <span className="kz-index-leader" aria-hidden />
                  {e.page !== undefined && <span className="kz-index-page">{e.page}</span>}
                </BlockLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
