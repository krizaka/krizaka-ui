// Server-safe. Plans and what they cost (blocks.css `.kz-tpl-plans`, `.kz-tpl-compare`, `.kz-tpl-faq`): the hero, the
// plans side by side — the featured one lifted, lit by the brand — the comparison as a table that scrolls on a phone,
// what a credit buys, and the questions people ask, folded.
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

import { cn } from "../cn";
import { CheckGlyph } from "../glyphs";

export interface PricingPlan {
  /** A stable key. */
  id: string;
  /** Its name. */
  name: React.ReactNode;
  /** Its price (`€29`, `Free`, `Custom`). */
  price: React.ReactNode;
  /** Under the price: the unit (`per month · 12,000 credits`). */
  unit?: React.ReactNode;
  /** What it includes, a few lines. */
  features: readonly React.ReactNode[];
  /** Its action (a cut Button or link; the featured one primary). */
  action: React.ReactNode;
  /** The plan most people choose: lifted and lit. */
  featured?: boolean;
  /** Its badge (`Most chosen`). */
  badge?: React.ReactNode;
}

export type PricingPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The brand the page wears (`.brand-<id>`). */
  brand?: string;
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One sentence under it. */
  lead?: React.ReactNode;
  /** Above the plans: a period switch (monthly · yearly), a currency. */
  toolbar?: React.ReactNode;
  /** The plans' accessible name (`Plans`). */
  plansLabel: string;
  /** The plans. */
  plans: readonly PricingPlan[];
  /** The comparison: its caption, columns (the plans' names) and rows (a feature and a cell per plan). */
  compare?: { caption: React.ReactNode; columns: readonly React.ReactNode[]; rows: readonly { feature: React.ReactNode; cells: readonly React.ReactNode[] }[] };
  /** What a credit buys, the credits left: a Meter, a sentence. */
  credits?: { title: React.ReactNode; children: React.ReactNode };
  /** The questions, folded. */
  faq?: { title: React.ReactNode; items: readonly { question: React.ReactNode; answer: React.ReactNode }[] };
};

/** A pricing page: plans (the featured one lifted), the comparison, credits, the questions. */
export function PricingPage({ brand, eyebrow, title, lead, toolbar, plansLabel, plans, compare, credits, faq, className, ...props }: PricingPageProps) {
  return (
    <div className={cn(brand && "brand-" + brand, className)} {...props}>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} align="center" backdrop="plain">
        {toolbar}
      </PageHero>
      <Section aria-label={plansLabel} spacing="sm">
        <ul className="kz-tpl-plans">
          {plans.map((p) => (
            <li key={p.id}>
              <div className="kz-tpl-plan" data-featured={p.featured ? "" : undefined}>
                <div className="kz-tpl-collection-head">
                  <h2>{p.name}</h2>
                  {p.badge && <span className="kz-fact" data-tone="ok">{p.badge}</span>}
                </div>
                <p className="kz-tpl-price">
                  {p.price}
                  {p.unit && <small>{p.unit}</small>}
                </p>
                <ul>
                  {p.features.map((f, i) => (
                    <li key={i}>
                      <CheckGlyph className="h-4 w-4" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div>{p.action}</div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      {compare && (
        <Section aria-label={typeof compare.caption === "string" ? compare.caption : undefined} spacing="sm" divider>
          <div className="kz-tpl-scroll" tabIndex={0}>
            <table className="kz-tpl-compare">
              <caption className="kz-label kz-tpl-caption">{compare.caption}</caption>
              <thead>
                <tr>
                  <td />
                  {compare.columns.map((c, i) => (
                    <th key={i} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">{r.feature}</th>
                    {r.cells.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
      {credits && (
        <Section id="credits" title={credits.title} headingSize="sm" spacing="sm" divider>
          {credits.children}
        </Section>
      )}
      {faq && (
        <Section id="faq" title={faq.title} headingSize="sm" spacing="sm" divider>
          <div className="kz-tpl-faq">
            {faq.items.map((q, i) => (
              <details key={i}>
                <summary>{q.question}</summary>
                <div>{q.answer}</div>
              </details>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
