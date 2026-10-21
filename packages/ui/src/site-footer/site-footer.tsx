// Client (the marks hold an id). The footer shared by every site of the Krizaka family — one calm band (Cahier, ADR-004;
// peer review krizaka-ui#434: « too much, a double footer »): the site's own columns and the family's columns side by
// side — Products · Open source (GitHub with them) · Krizaka (our story, the blog, contact) — then one line: the
// signature (“A Krizaka product”, by the kind of the current site, to www), the version, the place, the legal links.
// No site block (the bar already names the site), no column that lists only Krizaka, no link twice.
import { Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { FamilyMark } from "../family-mark";
import { KrizakaLogo } from "../marks/KrizakaLogo";
import { companyLinks, type FamilyLabels, familyLabels, siteById, type SiteId, sitesByGroup } from "../sites/sites";

export const siteFooter = tv({
  slots: {
    root: "w-full border-t border-border-subtle bg-surface-0 text-fg",
    inner:
      "mx-auto grid w-full max-w-[calc(var(--kz-page-max,72rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))] grid-cols-[minmax(0,1fr)] gap-10 px-[var(--kz-page-gutter,clamp(16px,3.2vw,32px))] py-12",
    band: "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-flow-col lg:auto-cols-[minmax(0,1fr)]",
    own: "grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-8",
    family: "grid grid-cols-2 gap-8 sm:grid-cols-3",
    column: "grid min-w-0 content-start gap-3",
    title: "text-[11px] font-semibold text-fg-secondary",
    list: "grid min-w-0 gap-2",
    link:
      "inline-flex min-h-6 min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md text-sm [overflow-wrap:anywhere] text-fg-secondary no-underline transition-colors hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-fg aria-[current=true]:text-fg aria-[current=true]:font-semibold",
    mark: "flex h-4 w-4 shrink-0 items-center justify-center text-fg",
    tag: "rounded-sm bg-surface-3 px-1.5 py-px text-[10px] font-semibold text-fg-secondary",
    bottom: "flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border-subtle pt-6 text-xs text-fg-secondary",
    signature:
      "inline-flex items-center gap-2 rounded-md font-medium text-fg no-underline hover:text-fg-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    version:
      "rounded-sm border border-border-subtle bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg-secondary",
    legal: "flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto",
  },
  variants: {
    // `site`: the full footer. `docs`: no site block, the columns in one row, on the documentation's width. `app`: one
    // slim line inside a signed-in product — signature, version, legal links.
    variant: {
      site: {},
      docs: {
        inner: "max-w-[calc(var(--kz-page-max-docs,88rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))] gap-6 py-8",
        own: "sm:grid-cols-4",
      },
      app: {
        root: "bg-transparent",
        inner: "gap-0 py-3",
        bottom: "border-t-0 pt-0",
      },
    },
  },
  defaultVariants: { variant: "site" },
});

export type SiteFooterProps = Omit<React.ComponentProps<"footer">, "children"> & {
  /** The site this footer belongs to (`@krizaka/ui/sites`): its mark and line, its signature, marked in the family. */
  current: SiteId;
  /**
   * The family's words, passed translated: `familyLabels.fr` from `@krizaka/ui/sites`, or your own of the same shape.
   * @default familyLabels.en
   */
  labels?: FamilyLabels;
  /** The site's own columns (`SiteFooter.Column`), before the family. */
  children?: React.ReactNode;
  /** The version the site runs (`1.2.3`, shown `v1.2.3`). */
  version?: string;
  /** The environment, when it is not production (`DEV`). */
  env?: string;
  /**
   * Shows the family in columns (the Krizaka sites: www, ui., java.). A product is independent once deployed: pass
   * `family={false}` and the footer holds only its own columns, the legal links, the version and one publisher line —
   * “A Krizaka product”, linking to www.krizaka.com.
   * @default true
   */
  family?: boolean;
  /** The end of the signature line: legal links, a language switch (`SiteFooter.Link`s or any inline content). */
  legal?: React.ReactNode;
  /**
   * `site` — the full footer of a marketing or company site. `docs` — a compact one for documentation pages (no site
   * block, the columns in a row, the documentation's width; never the family). `app` — one slim line inside a signed-in
   * product: the publisher line, the version and the legal links (no columns, no family); render it once, in the
   * layout, and not at all where the app shell has a sidebar that holds them.
   * @default "site"
   */
  variant?: "site" | "docs" | "app";
};

/** The footer of a Krizaka site, one band: its own columns and the family's, then one line — signature, version, Montréal, legal. */
export function SiteFooter({
  current,
  labels = familyLabels.en,
  children,
  version,
  env,
  legal,
  family: familyProp = true,
  variant = "site",
  className,
  ...props
}: SiteFooterProps) {
  const id = React.useId();
  const s = siteFooter({ variant });
  const family = variant === "site" && familyProp;
  const slim = variant === "app";
  const site = siteById(current);
  const krizaka = siteById("krizaka");
  const tag = [env, version && `v${version.replace(/^v/, "")}`].filter(Boolean).join(" · ");
  const own = React.Children.toArray(children).length > 0;
  const lang = labels.lang ?? "en";
  const company = labels.company ?? familyLabels.en.company!;
  // Products · Open source (GitHub, every repository, closes it) · Krizaka (the company's pages): three columns, no
  // column that lists only Krizaka.
  const groups = sitesByGroup();
  const columns = [
    ...groups.filter((g) => g.group === "products"),
    { group: "open-source" as const, sites: groups.filter((g) => g.group === "open-source" || g.group === "github").flatMap((g) => g.sites) },
  ];
  return (
    <footer className={s.root({ className })} {...props}>
      <div className={s.inner()}>
        {!slim && (own || family) && (
          <div className={s.band()}>
            {own && <div className={s.own()}>{children}</div>}
            {family && (
              <nav aria-label={labels.family} className={s.family()}>
                {columns.map(({ group, sites }) => (
                  <div key={group} className={s.column()}>
                    <p id={`${id}-${group}`} className={s.title()}>
                      {labels.groups[group]}
                    </p>
                    <ul aria-labelledby={`${id}-${group}`} className={s.list()}>
                      {sites.map((item) => (
                        <li key={item.id}>
                          <a href={item.url} aria-current={item.id === current ? "true" : undefined} className={s.link()}>
                            <span className={s.mark()}>
                              <FamilyMark mark={item.mark} size={16} />
                            </span>
                            {item.name}
                            {item.status !== "released" && <span className={s.tag()}>{labels.status[item.status]}</span>}
                            {item.id === current && <span className="sr-only">({labels.current})</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className={s.column()}>
                  <p id={`${id}-krizaka`} className={s.title()}>
                    {labels.groups.krizaka}
                  </p>
                  <ul aria-labelledby={`${id}-krizaka`} className={s.list()}>
                    {companyLinks.map((l) => (
                      <li key={l.id}>
                        <a href={l.url[lang]} className={s.link()}>
                          {company[l.id]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            )}
          </div>
        )}
        <div className={s.bottom()}>
          <a href={krizaka.url} className={s.signature()}>
            <KrizakaLogo size={18} animated={false} />
            {labels.signature[site.kind]}
          </a>
          {tag && (
            <span className={s.version()}>
              <span className="sr-only">{labels.version} </span>
              {tag}
            </span>
          )}
          {!slim && <span>{labels.place}</span>}
          {legal && <div className={s.legal()}>{legal}</div>}
        </div>
      </div>
    </footer>
  );
}

export type SiteFooterColumnProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The column's heading (“Docs”) — passed translated. */
  title: string;
  /** Its links (`SiteFooter.Link`). */
  children: React.ReactNode;
};

/** One of the site's own columns: a heading and its links. */
export function SiteFooterColumn({ title, children, className, ...props }: SiteFooterColumnProps) {
  const id = React.useId();
  // A group with no link is not a column: only a heading over nothing.
  if (React.Children.toArray(children).length === 0) return null;
  const s = siteFooter();
  return (
    <div className={s.column({ className })} {...props}>
      <p id={id} className={s.title()}>
        {title}
      </p>
      <ul aria-labelledby={id} className={s.list()}>
        {React.Children.toArray(children).map((child, i) => <li key={i}>{child}</li>)}
      </ul>
    </div>
  );
}

export type SiteFooterLinkProps = React.ComponentProps<"a"> & {
  /** The current page: `aria-current="page"`. */
  active?: boolean;
  /** Renders your router's `<Link>`. */
  asChild?: boolean;
};

/** A link of the footer. */
export function SiteFooterLink({ active, asChild, className, ...props }: SiteFooterLinkProps) {
  const s = siteFooter();
  const Comp = asChild ? Slot.Root : "a";
  return <Comp aria-current={active ? "page" : undefined} className={s.link({ className })} {...props} />;
}

SiteFooter.Column = SiteFooterColumn;
SiteFooter.Link = SiteFooterLink;
