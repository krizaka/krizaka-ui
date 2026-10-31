// Client (the mark holds an id). The footer shared by every site and app of the Krizaka family — compact (founder,
// 2026-10-30, krizaka/krizaka-internal#754: « des footers de 10 lignes »): at most three lines on a desktop —
//   1. the site's own links, each group inline (`Docs  Get started · Components`);
//   2. the family, grouped inline (Products · Open source · Krizaka), names read from `org.family` of `@krizaka/org`;
//   3. one line: the mark and the org's signature, the version, the legal links, the host's controls (language, theme).
// On a phone the family's groups fold (`<details>`), the rest wraps. `variant="app"` keeps line 3 only. Same structure on
// the Cahier sites and the products (`tone`). No link twice, no site block, no names typed here when `org` is given.
import { Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { KrizakaLogo } from "../marks/KrizakaLogo";
import { familyGroups, orgIdOf } from "../sites/family-groups";
import { companyLinks, type FamilyLabels, familyLabels, type OrgFacts, siteById, type SiteId } from "../sites/sites";

export const siteFooter = tv({
  slots: {
    root: "w-full border-t border-border-subtle bg-surface-0 text-fg",
    inner:
      "mx-auto grid w-full max-w-[calc(var(--kz-page-max,72rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))] grid-cols-[minmax(0,1fr)] gap-3 px-[var(--kz-page-gutter,clamp(16px,3.2vw,32px))] py-6",
    row: "flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-2",
    family: "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 lg:flex lg:flex-wrap lg:items-baseline lg:gap-x-6 lg:gap-y-2",
    group:
      "group/fold min-w-0 lg:[&::details-content]:[content-visibility:visible] lg:[&::details-content]:contents lg:[&>summary]:pointer-events-none lg:inline-flex lg:items-baseline lg:gap-2",
    summary:
      "flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md text-xs font-semibold text-fg-secondary [&::-webkit-details-marker]:hidden " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring lg:inline lg:min-h-0 lg:cursor-default",
    chevron: "size-4 shrink-0 transition-transform group-open/fold:rotate-180 motion-reduce:transition-none lg:hidden",
    column: "inline-flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1",
    title: "text-xs font-semibold text-fg-secondary",
    list: "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 pb-2 lg:pb-0",
    link:
      "inline-flex min-h-6 min-w-0 items-center rounded-md text-sm [overflow-wrap:anywhere] text-fg-secondary no-underline transition-colors hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-fg aria-[current=page]:font-semibold aria-[current=true]:text-fg aria-[current=true]:font-semibold",
    bottom: "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-secondary",
    signature:
      "inline-flex items-center gap-2 rounded-md font-medium text-fg no-underline hover:text-fg-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    version:
      "rounded-sm border border-border-subtle bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg-secondary",
    legal: "flex flex-wrap items-center gap-x-4 gap-y-2",
    controls: "flex flex-wrap items-center gap-2 sm:ml-auto",
  },
  variants: {
    // `site`: the three lines. `docs`: the same on the documentation's width. `app`: line 3 only, inside a signed-in product.
    variant: {
      site: {},
      docs: {
        inner: "max-w-[calc(var(--kz-page-max-docs,88rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))]",
      },
      app: {
        root: "bg-transparent",
        inner: "py-3",
      },
    },
    // `product`: the products' plain Krizaka UI. `cahier`: the Cahier sites (www, blog, ui., java., ts., lab.) — the
    // headings in the Cahier's hand; the structure is the same.
    tone: {
      product: {},
      cahier: {
        title: "font-[family-name:var(--kz-font-display,inherit)] italic",
        summary: "font-[family-name:var(--kz-font-display,inherit)] italic",
      },
    },
  },
  defaultVariants: { variant: "site", tone: "product" },
});

const bare = (p: string) => p.replace(/^\/(en|fr)(?=\/|$)/, "").replace(/\/+$/, "") || "/";

/** Is `href` (an absolute family address) the page `path` of the site at `siteUrl`? Locale prefix and trailing slash do not count. */
function isThisPage(href: string, siteUrl: string, path: string): boolean {
  try {
    const target = new URL(href);
    return target.host === new URL(siteUrl).host && bare(target.pathname) === bare(path.split(/[?#]/)[0]!);
  } catch {
    return false;
  }
}

/** The link to the page you are on: no reload, back to the top (the browser would otherwise keep or restore the scroll). */
function backToTop(event: React.MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "auto" });
}

type Tone = "product" | "cahier";
const ToneContext = React.createContext<Tone>("product");

export type SiteFooterProps = Omit<React.ComponentProps<"footer">, "children"> & {
  /** The site this footer belongs to (`@krizaka/ui/sites`): marked in the family, its address for `path`. */
  current: SiteId;
  /**
   * The family's words, passed translated: `familyLabels.fr` from `@krizaka/ui/sites`, or your own of the same shape.
   * @default familyLabels.en
   */
  labels?: FamilyLabels;
  /** The site's own link groups (`SiteFooter.Column`), on the first line. */
  children?: React.ReactNode;
  /** The version the site runs (`1.2.3`, shown `v1.2.3`). */
  version?: string;
  /** The environment, when it is not production (`DEV`). */
  env?: string;
  /**
   * The path of the page being read on this site (`/en/story`, `/blog/…`): the company link that points to this very
   * page says so (`aria-current="page"`) and a click on it scrolls to the top instead of reloading.
   */
  path?: string;
  /**
   * Shows the family on the second line, folded on a phone. The links to the other sites live on krizaka.com only
   * (founder rule, 2026-10-30): every other site and its documentation opts in on purpose, none by default.
   * @default current === "krizaka" (and never in `variant="app"`)
   */
  family?: boolean;
  /** Only these products in the Products group (the current site always kept). Omit it to list every product. */
  products?: readonly SiteId[];
  /**
   * The organisation's public facts (`org` of `@krizaka/org`) — pass them on every site. The names and addresses of the
   * family are then `org.family`, the signature is `org.footer.line` (« Une entreprise de Technologies Krizaka · Fait à
   * Montréal », the same everywhere) and, without `legal`, the legal links are `org.footer.legal`.
   */
  org?: OrgFacts;
  /** The legal links, when not the org's (`SiteFooter.Link`s). */
  legal?: React.ReactNode;
  /** The host's controls at the end of the last line: the language switch, the theme toggle. */
  controls?: React.ReactNode;
  /**
   * `site` — every public site. `docs` — the same under documentation, on its width. `app` — inside a signed-in product:
   * the last line only; render it once, in the layout.
   * @default "site"
   */
  variant?: "site" | "docs" | "app";
  /** `cahier` on the Cahier sites (www, blog, ui., java., ts., lab.), `product` in the products. @default "product" */
  tone?: Tone;
};

/** The footer of a Krizaka site or app: at most three lines — its links, the family, then signature · version · legal. */
export function SiteFooter({
  current,
  labels = familyLabels.en,
  children,
  version,
  env,
  path,
  legal: legalProp,
  controls,
  org,
  family: familyProp,
  products,
  variant = "site",
  tone = "product",
  className,
  ...props
}: SiteFooterProps) {
  const id = React.useId();
  const s = siteFooter({ variant, tone });
  const slim = variant === "app";
  const family = !slim && (familyProp ?? current === "krizaka");
  const site = siteById(current);
  const krizaka = siteById("krizaka");
  const currentId = orgIdOf(current);
  const tag = [env, version && `v${version.replace(/^v/, "")}`].filter(Boolean).join(" · ");
  const own = !slim && React.Children.toArray(children).length > 0;
  const lang = labels.lang ?? "en";
  const company = labels.company ?? familyLabels.en.company!;
  const legal =
    legalProp ??
    (org && (
      <>
        {org.footer.legal.map((l) => (
          <SiteFooterLink key={l.id} href={l.url[lang]}>
            {l.label[lang]}
          </SiteFooterLink>
        ))}
      </>
    ));
  const here = (href: string) => path !== undefined && isThisPage(href, site.url, path);
  const productIds = products?.map(orgIdOf);
  // Products · Open source (GitHub closes it) · Krizaka (the company's pages; its home is the signature's link).
  const groups = familyGroups(org);
  const columns = [
    ...groups
      .filter((g) => g.group === "products")
      .map((g) => ({ ...g, entries: productIds ? g.entries.filter((e) => productIds.includes(e.id) || e.id === currentId) : g.entries })),
    { group: "open-source" as const, entries: groups.filter((g) => g.group === "open-source" || g.group === "github").flatMap((g) => g.entries) },
  ];
  const companyEntries = companyLinks.map((l) => ({ id: l.id, name: company[l.id], url: l.url[lang] }));
  return (
    <ToneContext.Provider value={tone}>
      <footer className={s.root({ className })} {...props}>
        <div className={s.inner()}>
          {own && <div className={s.row()}>{children}</div>}
          {family && (
            <nav aria-label={labels.family} className={s.family()}>
              {[
                ...columns.map((c) => ({ key: c.group, title: labels.groups[c.group], entries: c.entries })),
                { key: "krizaka" as const, title: labels.groups.krizaka, entries: companyEntries },
              ]
                .filter((c) => c.entries.length > 0)
                .map((c) => (
                  <details key={c.key} className={s.group()}>
                    <summary id={`${id}-${c.key}`} className={s.summary()}>
                      {c.title}
                      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={s.chevron()}>
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <ul aria-labelledby={`${id}-${c.key}`} className={s.list()}>
                      {c.entries.map((e) => {
                        const isCompany = c.key === "krizaka";
                        const atHome = isCompany && here(e.url);
                        const isCurrent = !isCompany && e.id === currentId;
                        return (
                          <li key={e.id}>
                            <a
                              href={e.url}
                              aria-current={atHome ? "page" : isCurrent ? "true" : undefined}
                              onClick={atHome ? backToTop : undefined}
                              className={s.link()}
                            >
                              {e.name}
                              {isCurrent && <span className="sr-only"> ({labels.current})</span>}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))}
            </nav>
          )}
          <div className={s.bottom()}>
            <a href={krizaka.url} className={s.signature()}>
              <KrizakaLogo size={18} animated={false} />
              {org ? org.footer.line[lang] : `${labels.signature[site.kind]} · ${labels.place}`}
            </a>
            {tag && (
              <span className={s.version()}>
                <span className="sr-only">{labels.version} </span>
                {tag}
              </span>
            )}
            {legal && <div className={s.legal()}>{legal}</div>}
            {controls && <div className={s.controls()}>{controls}</div>}
          </div>
        </div>
      </footer>
    </ToneContext.Provider>
  );
}

export type SiteFooterColumnProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The group's heading (“Docs”) — passed translated. */
  title: string;
  /** Its links (`SiteFooter.Link`). */
  children: React.ReactNode;
};

/** One of the site's own link groups, inline on the first line: its heading, then its links. */
export function SiteFooterColumn({ title, children, className, ...props }: SiteFooterColumnProps) {
  const id = React.useId();
  const tone = React.useContext(ToneContext);
  // A group with no link is not a group: only a heading over nothing.
  if (React.Children.toArray(children).length === 0) return null;
  const s = siteFooter({ tone });
  return (
    <div className={s.column({ className })} {...props}>
      <p id={id} className={s.title()}>
        {title}
      </p>
      <ul aria-labelledby={id} className={s.list({ className: "pb-0" })}>
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
