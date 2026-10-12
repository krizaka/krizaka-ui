// Server-safe. A documentation article in the docs frame (DocsLayout): the pages on the left, the breadcrumb, the
// title, its lead and facts (updated, reading time), the reading column, the contents on the right, the previous and
// next pages at the foot. On a phone the pages fold above the article and the contents become chips.
import { DocsLayout } from "@krizaka/ui/docs-layout";
import { type Fact, Facts } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { Toc } from "@krizaka/ui/toc";
import type * as React from "react";

export type DocsArticlePageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The documentation's pages (a nav of links). */
  sidebar: React.ReactNode;
  /** On a phone, the words that open the pages. */
  sidebarLabel: string;
  /** Where the page sits: `{ href, label }` from the hub down. */
  breadcrumb?: readonly { href: string; label: string }[];
  /** The breadcrumb's accessible name (`Breadcrumb`). */
  breadcrumbLabel?: string;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One or two sentences under it. */
  lead?: React.ReactNode;
  /** Facts under the lead: updated on, reading time, the version it documents. */
  facts?: readonly Fact[];
  /** The contents (its `h2`s): `{ id, label }`, and its label (`On this page`). */
  toc?: { label: string; items: readonly { id: string; label: string }[] };
  /** The previous and next pages, and their labels. */
  pager?: { previous?: { href: string; title: string }; next?: { href: string; title: string }; labels: { previous: string; next: string } };
  /** The article's body (prose, code blocks, diagrams). */
  children: React.ReactNode;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A documentation article: pages · breadcrumb, title, lead, facts, the reading column · contents; previous and next. */
export function DocsArticlePage({ sidebar, sidebarLabel, breadcrumb, breadcrumbLabel = "Breadcrumb", title, lead, facts, toc, pager, linkAs, children, ...props }: DocsArticlePageProps) {
  const L = (linkAs ?? "a") as React.ElementType;
  return (
    <DocsLayout sidebar={sidebar} sidebarLabel={sidebarLabel} toc={toc && <Toc label={toc.label} items={toc.items} />} {...props}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label={breadcrumbLabel}>
          <ol className="kz-tpl-crumbs">
            {breadcrumb.map((c) => (
              <li key={c.href}>
                <L href={c.href}>{c.label}</L>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="kz-tpl-article-title">{title}</h1>
      {lead && <p className="kz-tpl-article-lead">{lead}</p>}
      {facts && facts.length > 0 && <Facts className="kz-tpl-article-meta" items={facts} />}
      <div className="kz-tpl-prose">{children}</div>
      {pager && (pager.previous || pager.next) && (
        <nav className="kz-tpl-pager" aria-label={`${pager.labels.previous} · ${pager.labels.next}`}>
          {pager.previous && (
            <L href={pager.previous.href} rel="prev">
              <small>{pager.labels.previous}</small>
              {pager.previous.title}
            </L>
          )}
          {pager.next && (
            <L href={pager.next.href} rel="next">
              <small>{pager.labels.next}</small>
              {pager.next.title}
            </L>
          )}
        </nav>
      )}
    </DocsLayout>
  );
}
