// Server-safe. A long read — a story, an essay, a case (blocks.css `.kz-tpl-chapters`): the hero, then chapters, each
// with its big outlined number, its title, its text in a reading column, a pull quote in the margin and a figure that
// breaks out to the margin's width; the contents as chips on a phone. Editorial, not cards.
import { Page } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

import { cn } from "../cn";

export interface LongformChapter {
  /** The chapter's anchor. */
  id: string;
  /** Its title. */
  title: React.ReactNode;
  /** Its text (paragraphs). */
  children: React.ReactNode;
  /** A sentence pulled into the margin. */
  pull?: React.ReactNode;
  /** A figure under the text (an image, a schema, a quote by a bird). */
  figure?: React.ReactNode;
}

export type LongformPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The brand the page wears (`.brand-<id>`). */
  brand?: string;
  /** The way back. */
  back?: { href: string; label: string };
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** The standfirst. */
  lead?: React.ReactNode;
  /** Beside the hero: the page's bird, an illustration. */
  aside?: React.ReactNode;
  /** The chapters, in order. */
  chapters: readonly LongformChapter[];
  /** After the chapters: the end note, a call. */
  children?: React.ReactNode;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A long read: hero, then numbered chapters with pull quotes in the margin and figures that break out. */
export function LongformPage({ brand, back, eyebrow, title, lead, aside, chapters, linkAs, className, children, ...props }: LongformPageProps) {
  return (
    <div className={cn(brand && "brand-" + brand, className)} {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} aside={aside} />
      <Page className="kz-tpl-longform">
        <div className="kz-tpl-chapters">
          {chapters.map((c, i) => (
            <section key={c.id} className="kz-tpl-chapter" aria-labelledby={c.id} data-reveal="">
              <span className="kz-tpl-chapter-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="kz-tpl-chapter-body">
                <h2 id={c.id}>{c.title}</h2>
                {c.children}
              </div>
              {c.pull && (
                <aside className="kz-tpl-chapter-aside">
                  <p className="kz-tpl-pull">{c.pull}</p>
                </aside>
              )}
              {c.figure && <figure className="kz-tpl-chapter-figure">{c.figure}</figure>}
            </section>
          ))}
        </div>
        {children}
      </Page>
    </div>
  );
}
