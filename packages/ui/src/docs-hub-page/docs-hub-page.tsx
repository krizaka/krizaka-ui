// Server-safe. The entry of a documentation (blocks.css `.kz-tpl-hub-*`, `.kz-tpl-collections`): the search in the
// middle of the hero, the collections each in its product's brand with its quick links, the quick starts beside the
// most read pages, what is new from the registries, and the owl's promise. One column on a phone, the search first.
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Section } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import * as React from "react";

export interface DocsCollection {
  /** A stable key. */
  id: string;
  /** The product's brand (`orazaka`…): the panel wears `.brand-<id>`. */
  brand?: string;
  /** The product's mark. */
  mark?: React.ReactNode;
  /** The collection's name: a link to its home. */
  title: string;
  /** Where it starts. */
  href: string;
  /** What it covers, in one sentence. */
  description?: React.ReactNode;
  /** Its most useful pages (three or four). */
  links?: readonly { href: string; label: string }[];
}

export interface DocsHubLink {
  /** Where it leads. */
  href: string;
  /** The page's title. */
  title: React.ReactNode;
  /** On the right, in mono: a collection, a version, a date. */
  meta?: React.ReactNode;
}

export type DocsHubPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One sentence under it. */
  lead?: React.ReactNode;
  /** The search, front and centre (a SearchField, a button that opens the command palette). */
  search?: React.ReactNode;
  /** Under the search: what people look for (a few links or keys). */
  searchHints?: React.ReactNode;
  /** The collections' heading. */
  collectionsTitle: React.ReactNode;
  /** The collections, each in its brand. */
  collections: readonly DocsCollection[];
  /** The quick starts: a title and their samples (CodeBlocks, CodeTabs). */
  quickstarts?: { title: React.ReactNode; children: React.ReactNode };
  /** The most read pages. */
  popular?: { title: React.ReactNode; items: readonly DocsHubLink[] };
  /** What is new (releases from the registries, published pages). */
  whatsNew?: { title: React.ReactNode; items: readonly DocsHubLink[] };
  /** The owl's promise at the foot: what this documentation guarantees. */
  promise?: { label: React.ReactNode; text: React.ReactNode };
  /** The app's link component (Next's `Link`) for internal addresses. */
  linkAs?: LinkComponent;
};

function List({ items, linkAs: Link = "a" }: { items: readonly DocsHubLink[]; linkAs?: LinkComponent }) {
  const L = Link as React.ElementType;
  return (
    <ul className="kz-tpl-links">
      {items.map((item, i) => (
        <li key={`${i}:${item.href}`}>
          <L href={item.href}>
            <strong>{item.title}</strong>
            {item.meta && <small>{item.meta}</small>}
          </L>
        </li>
      ))}
    </ul>
  );
}

/** A documentation hub: search first, the collections in their brand, quick starts, popular and new pages. */
export function DocsHubPage({ eyebrow, title, lead, search, searchHints, collectionsTitle, collections, quickstarts, popular, whatsNew, promise, linkAs, ...props }: DocsHubPageProps) {
  const L = (linkAs ?? "a") as React.ElementType;
  return (
    <div {...props}>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} align="center" backdrop="grid">
        {(search || searchHints) && (
          <div className="kz-tpl-hub-search">
            {search}
            {searchHints && <div className="kz-tpl-hub-hints">{searchHints}</div>}
          </div>
        )}
      </PageHero>
      <Section id="collections" title={collectionsTitle} headingSize="sm" spacing="sm">
        <ul className="kz-tpl-collections">
          {collections.map((c) => (
            <li key={c.id} className={c.brand ? "brand-" + c.brand : undefined}>
              <div className="kz-tpl-collection">
                <div className="kz-tpl-collection-head">
                  {c.mark && <span aria-hidden>{c.mark}</span>}
                  <L href={c.href}>{c.title}</L>
                </div>
                {c.description && <p>{c.description}</p>}
                {c.links && c.links.length > 0 && (
                  <ul aria-label={c.title}>
                    {c.links.map((l) => (
                      <li key={l.href}>
                        <L href={l.href}>{l.label}</L>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>
      {(quickstarts || popular) && (
        <Section spacing="sm" divider aria-label={typeof quickstarts?.title === "string" ? quickstarts.title : undefined}>
          <div className="kz-tpl-two">
            {quickstarts && (
              <div className="kz-tpl-stack">
                <h2 className="kz-heading-title kz-tpl-h2">{quickstarts.title}</h2>
                {quickstarts.children}
              </div>
            )}
            {popular && (
              <div className="kz-tpl-stack">
                <h2 className="kz-heading-title kz-tpl-h2">{popular.title}</h2>
                <List items={popular.items} linkAs={linkAs} />
              </div>
            )}
          </div>
        </Section>
      )}
      {whatsNew && (
        <Section id="whats-new" title={whatsNew.title} headingSize="sm" spacing="sm" divider>
          <List items={whatsNew.items} linkAs={linkAs} />
        </Section>
      )}
      {promise && (
        <Section spacing="sm" aria-label={typeof promise.label === "string" ? promise.label : undefined}>
          <MascotQuote variant="callout" bird="owl" mood="welcome" label={promise.label}>
            {promise.text}
          </MascotQuote>
        </Section>
      )}
    </div>
  );
}
