// Server-safe. A catalogue or an index (blocks.css `.kz-tpl-catalogue`): the hero, then the filters in a sticky column
// beside the results — folded into a disclosure above them on a phone — the count of what matches and the sort, and
// the results (a CardGrid of LinkCards, a list). The filters live in the address: a link per choice, no client state.
import { Page } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { Meter, type MeterProps } from "../meter";

const plan = tv({
  slots: {
    root: "mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-border-default bg-surface-1 p-4",
    figures: "m-0 flex min-w-0 flex-wrap gap-x-8 gap-y-2",
    figure: "flex min-w-0 flex-col",
    value: "font-display text-2xl font-extrabold tabular-nums text-fg",
    label: "text-xs text-fg-secondary",
    meter: "min-w-40 flex-1",
  },
});

export type PlanFigure = { id: string; label: string; value: React.ReactNode };

export type PlanStripProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** Names the strip (`Your plan`). */
  label: string;
  /** Two or three figures (`12 clients`, `3 invoices to send`). */
  figures: readonly PlanFigure[];
  /** The measure of the plan beside them (`Meter`): clients used of the plan, storage. */
  meter?: MeterProps;
};

/** The plan strip of a catalogue: two or three figures and a `Meter` — where the account stands, at a glance. */
export function PlanStrip({ label, figures, meter, className, ...props }: PlanStripProps) {
  const p = plan();
  return (
    <section aria-label={label} className={p.root({ className })} {...props}>
      <dl className={p.figures()}>
        {figures.slice(0, 3).map((f) => (
          <div key={f.id} className={p.figure()}>
            <dd className={p.value()}>{f.value}</dd>
            <dt className={p.label()}>{f.label}</dt>
          </div>
        ))}
      </dl>
      {meter && <Meter {...meter} className={p.meter({ className: meter.className })} />}
    </section>
  );
}

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
  /** Above the results: the plan strip (`PlanStrip`) — where the account stands. */
  plan?: React.ReactNode;
  /** Above the count: the binder dividers (tabs of the shelves: all · active · archived). */
  dividers?: React.ReactNode;
  /** After the results (the bar docks itself at the bottom edge): the selection bar (`SelectionBar`, `DataTable bulkActions`). */
  selection?: React.ReactNode;
  /** What matches, in words (`24 components`). */
  count?: React.ReactNode;
  /** On the right of the count: the sort, a view switch. */
  toolbar?: React.ReactNode;
  /** The results: a CardGrid, a list, an empty state. */
  children: React.ReactNode;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
  /**
   * From which window width the filters stay in their column beside the results. `default`: 900 px and above. `wide`:
   * 1280 px and above — a wide table (DataTable) needs the room; under it the filters are a bar above the results.
   */
  railFrom?: "default" | "wide";
};

/** A catalogue: hero, sticky filters beside the results (folded on a phone), the count, the results. */
export function CataloguePage({ back, eyebrow, title, lead, search, filters, filtersLabel, plan, dividers, selection, count, toolbar, linkAs, railFrom = "default", children, ...props }: CataloguePageProps) {
  return (
    <div {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} backdrop="plain">
        {search}
      </PageHero>
      <Page className="kz-tpl-catalogue-frame">
        <div className="kz-tpl-catalogue" data-rail={railFrom}>
          <details className="kz-tpl-catalogue-filters" open>
            <summary>{filtersLabel}</summary>
            <div>{filters}</div>
          </details>
          <div className="min-w-0">
            {plan}
            {dividers}
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
            {selection && <div className="mt-3">{selection}</div>}
          </div>
        </div>
      </Page>
    </div>
  );
}
