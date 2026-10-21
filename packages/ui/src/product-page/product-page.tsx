// Server-safe. A product's overview: the hero with the product's mark, its promise, facts and main action beside a live
// window of the product; the traps it removes as compact argument cards; its decisions with their cost; the promise a
// bird keeps; the closing call. Under the product's brand (`brand` → `.brand-<id>`).
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { type Decision, DecisionList } from "@krizaka/ui/decision-list";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import type { MascotBird } from "@krizaka/ui/mascots";
import { type Fact, Facts, Page, Section } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import type * as React from "react";

import { cn } from "../cn";

export interface ProductReason {
  /** A stable key (the card's anchor). */
  id: string;
  /** Its name. */
  title: React.ReactNode;
  /** The trap elsewhere, in one line. */
  trap: React.ReactNode;
  /** The signature icon. */
  icon?: React.ReactNode;
  /** The bird in the corner (whose rule it is). */
  mark?: React.ReactNode;
  /** Where the long version lives (a page) — or nothing, and the card stays its face. */
  href?: string;
}

export type ProductPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The product's brand (`orazaka`, `orochia`…): the page wears `.brand-<id>`. */
  brand?: string;
  /** The product's mark and name, above the title. */
  mark?: React.ReactNode;
  /** The promise: the page's `h1`. */
  title: React.ReactNode;
  /** One or two sentences under it. */
  lead?: React.ReactNode;
  /** Facts under the lead (open source, a law it keeps). */
  facts?: readonly Fact[];
  /** The hero's actions. */
  actions?: React.ReactNode;
  /** The product alive, in a window beside the words. */
  visual?: React.ReactNode;
  /** The window's caption. */
  visualLabel?: React.ReactNode;
  /** The reasons' section heading. */
  reasonsHeading: { eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode };
  /** The words of the cards: the trap's label (read, not shown) and the way in. */
  reasonLabels: { trap: string; more: React.ReactNode };
  /** The traps it removes. */
  reasons: readonly ProductReason[];
  /** The decisions' section: heading, decisions and their four labels. */
  decisions?: { eyebrow?: React.ReactNode; title: React.ReactNode; items: readonly Decision[]; labels: { chose: React.ReactNode; refused: React.ReactNode; because: React.ReactNode; cost: React.ReactNode } };
  /** The promise a bird keeps, under the decisions. */
  promise?: { bird: MascotBird; label: React.ReactNode; text: React.ReactNode };
  /** More sections between the decisions and the closing call (the tour, the platform, a comparison). */
  children?: React.ReactNode;
  /** The closing call. */
  closing?: { title: React.ReactNode; body?: React.ReactNode; actions: React.ReactNode };
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A product's overview: split hero, traps as compact cards, decisions with their cost, the bird's promise, closing call. */
export function ProductPage({ brand, mark, title, lead, facts, actions, visual, visualLabel, reasonsHeading, reasonLabels, reasons, decisions, promise, closing, linkAs, className, children, ...props }: ProductPageProps) {
  return (
    <div className={cn(brand && "brand-" + brand, className)} {...props}>
      <SectionBackdrop as="header" grid className="kz-hero">
        <Page>
          <div className={visual ? "kz-tpl-split" : undefined}>
            <div className="kz-hero-text">
              {mark && <p className="kz-eyebrow">{mark}</p>}
              <h1 className="kz-hero-title">{title}</h1>
              {lead && <p className="kz-hero-lead">{lead}</p>}
              {(facts || actions) && (
                <div className="kz-hero-extra">
                  {facts && <Facts items={facts} />}
                  {actions && <div className="kz-tpl-actions">{actions}</div>}
                </div>
              )}
            </div>
            {visual && (
              <figure className="kz-tpl-stage">
                <div className="kz-tpl-stage-bar" aria-hidden>
                  {visualLabel && <span>{visualLabel}</span>}
                </div>
                {visual}
              </figure>
            )}
          </div>
        </Page>
      </SectionBackdrop>
      <Section id="why" eyebrow={reasonsHeading.eyebrow} title={reasonsHeading.title} lead={reasonsHeading.lead} reveal>
        <CardGrid min={260} fit="fit">
          {reasons.map((r) => (
            <ArgumentCard
              key={r.id}
              id={`why-${r.id}`}
              icon={r.icon}
              title={r.title}
              mark={r.mark}
              hook={{ label: reasonLabels.trap, text: r.trap }}
              more={r.href ? { href: r.href, label: reasonLabels.more } : undefined}
              linkAs={linkAs}
            />
          ))}
        </CardGrid>
      </Section>
      {decisions && (
        <Section id="decisions" eyebrow={decisions.eyebrow} title={decisions.title} divider reveal>
          <DecisionList decisions={decisions.items} labels={decisions.labels} />
          {promise && (
            <div className="kz-tpl-promise">
              <MascotQuote variant="callout" bird={promise.bird} mood="welcome" label={promise.label}>
                {promise.text}
              </MascotQuote>
            </div>
          )}
        </Section>
      )}
      {children}
      {closing && (
        <Section spacing="sm" aria-labelledby="product-closing">
          <CtaPanel id="product-closing" title={closing.title} body={closing.body} reveal>
            {closing.actions}
          </CtaPanel>
        </Section>
      )}
    </div>
  );
}
