// Server-safe. A policy or terms (TocLayout): the hero with the date in force, then the sections in a narrow reading
// column with their contents beside — chips on a phone — and a summary in plain words first when there is one.
import { Page, Section } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import { Toc, TocLayout } from "@krizaka/ui/toc";
import type * as React from "react";

export interface LegalSection {
  /** The section's anchor. */
  id: string;
  /** Its title. */
  title: string;
  /** Its paragraphs. */
  children: React.ReactNode;
}

export type LegalPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The way back. */
  back?: { href: string; label: string };
  /** The page's `h1` (`Privacy policy`). */
  title: React.ReactNode;
  /** In force since (`Last updated: October 2026`). */
  updated?: React.ReactNode;
  /** The short version, in plain words, before the sections. */
  summary?: React.ReactNode;
  /** The contents' label (`On this page`). */
  tocLabel: string;
  /** The sections. */
  sections: readonly LegalSection[];
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A legal page: hero with the date, a plain-words summary, the sections with their contents. */
export function LegalPage({ back, title, updated, summary, tocLabel, sections, linkAs, ...props }: LegalPageProps) {
  return (
    <div {...props}>
      <PageHero back={back} linkAs={linkAs} title={title} lead={updated} backdrop="plain" />
      <Page className="kz-tpl-longform">
        <TocLayout toc={<Toc label={tocLabel} items={sections.map((s) => ({ id: s.id, label: s.title }))} />}>
          {summary && <div className="kz-cta kz-tpl-summary">{summary}</div>}
          {sections.map((s, i) => (
            <Section key={s.id} id={s.id} title={s.title} headingSize="sm" spacing="sm" size="narrow" divider={i > 0 || Boolean(summary)}>
              <div className="kz-tpl-prose">{s.children}</div>
            </Section>
          ))}
        </TocLayout>
      </Page>
    </div>
  );
}
