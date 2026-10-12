// Server-safe. A catalogue or an index (blocks.css `.kz-tpl-catalogue`): the hero, then the filters in a sticky column
// beside the results — folded into a disclosure above them on a phone — the count of what matches and the sort, and
// the results (a CardGrid of LinkCards, a list). The filters live in the address: a link per choice, no client state.
import { Page } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

export type CataloguePageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The way back. */
  back?: { href: string; label: string };
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One sentence under it. */
  lead?: React.ReactNode;
  /** In the hero: a search field. */
  search?: React.ReactNode;
  /** The filters (groups of ChipLinks, a FilterBar): sticky on a desktop. */
  filters: React.ReactNode;
  /** On a phone, the words that open the filters (`Filters`). */
  filtersLabel: string;
  /** What matches, in words (`24 components`). */
  count?: React.ReactNode;
  /** On the right of the count: the sort, a view switch. */
  toolbar?: React.ReactNode;
  /** The results: a CardGrid, a list, an empty state. */
  children: React.ReactNode;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A catalogue: hero, sticky filters beside the results (folded on a phone), the count, the results. */
export function CataloguePage({ back, eyebrow, title, lead, search, filters, filtersLabel, count, toolbar, linkAs, children, ...props }: CataloguePageProps) {
  return (
    <div {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} backdrop="plain">
        {search}
      </PageHero>
      <Page className="kz-tpl-catalogue-frame">
        <div className="kz-tpl-catalogue">
          <details className="kz-tpl-catalogue-filters" open>
            <summary>{filtersLabel}</summary>
            <div>{filters}</div>
          </details>
          <div className="min-w-0">
            {(count || toolbar) && (
              <div className="kz-tpl-catalogue-head">
                {count && (
                  <p className="kz-tpl-count" aria-live="polite">
                    {count}
                  </p>
                )}
                {toolbar}
              </div>
            )}
            {children}
          </div>
        </div>
      </Page>
    </div>
  );
}
