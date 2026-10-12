// Server-safe. What changed and why (blocks.css `.kz-tpl-log`): the hero, then the entries — the date and version
// sticking beside them while they scroll, a title, the changes by kind (added · changed · fixed · removed, in words and
// colour) — and, when a change was a decision, its reasons (a DecisionList) under it.
import { Page } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

export type ChangeKind = "added" | "changed" | "fixed" | "removed";

export interface ChangelogEntry {
  /** A stable key (the entry's anchor). */
  id: string;
  /** Its date, ISO (`2026-10-11`): shown as `dateLabel`. */
  date: string;
  /** The date as the reader reads it (`11 October 2026`). */
  dateLabel: React.ReactNode;
  /** The version or the release (`@krizaka/ui 2.6.0`): a fact beside the date. */
  version?: React.ReactNode;
  /** The entry's title. */
  title: React.ReactNode;
  /** The changes, each with its kind. */
  changes: readonly { kind: ChangeKind; text: React.ReactNode }[];
  /** Under the changes: why (a DecisionList, a quote), a link to the pull request. */
  children?: React.ReactNode;
}

export type ChangelogPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The way back. */
  back?: { href: string; label: string };
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One sentence under it. */
  lead?: React.ReactNode;
  /** In the hero: a subscribe action, the feed. */
  actions?: React.ReactNode;
  /** The words of the kinds: `{ added: "Added", … }`. */
  kindLabels: Record<ChangeKind, string>;
  /** The log's accessible name (`Changes`). */
  logLabel: string;
  /** The entries, newest first. */
  entries: readonly ChangelogEntry[];
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A changelog: entries with a sticky date and version, changes by kind, the reasons under them. */
export function ChangelogPage({ back, eyebrow, title, lead, actions, kindLabels, logLabel, entries, linkAs, ...props }: ChangelogPageProps) {
  return (
    <div {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} backdrop="plain">
        {actions}
      </PageHero>
      <Page className="kz-tpl-longform">
        <ol className="kz-tpl-log" aria-label={logLabel}>
          {entries.map((e) => (
            <li key={e.id} id={e.id} className="kz-tpl-log-entry">
              <div className="kz-tpl-log-when">
                <time dateTime={e.date}>{e.dateLabel}</time>
                {e.version && <span className="kz-fact">{e.version}</span>}
              </div>
              <div>
                <h2>{e.title}</h2>
                <ul className="kz-tpl-log-items">
                  {e.changes.map((c, i) => (
                    <li key={i}>
                      <span className="kz-tpl-log-kind" data-kind={c.kind}>
                        {kindLabels[c.kind]}
                      </span>
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>
                {e.children}
              </div>
            </li>
          ))}
        </ol>
      </Page>
    </div>
  );
}
