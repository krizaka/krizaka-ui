// Client (the mark holds an id). The footer shared by every site and app of the Krizaka family — compact (founder,
// 2026-10-30, krizaka/krizaka-internal#754: « des footers de 10 lignes »): at most three lines on a desktop —
//   1. the site's own links, each group inline (`Docs  Get started · Components`);
//   2. the family, grouped inline (Products · Open source · Krizaka), names read from `org.family` of `@krizaka/org`;
//   3. one line: the mark and the org's signature, the version, the legal links, the host's controls (language, theme).
// On a phone the family's groups fold (`<details>`), the rest wraps. `variant="app"` keeps line 3 only. Same structure on
// the Cahier sites and the products (`tone`). No link twice, no site block, no names typed here when `org` is given.
import { InstagramIcon, YoutubeIcon } from "@krizaka/icons";
import { Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

// ProductLogo, not KrizakaLogo: one import path keeps every mark in one shared chunk (KrizakaLogo alone split it: +871 B gzip on the typical page).
import type { LinkComponent } from "../block-link";
import { ProductLogo } from "../marks/ProductLogo";
import { columnStatus, familyGroups, orgIdOf } from "../sites/family-groups";
import { companyLinks, type FamilyLabels, familyLabels, type OrgFacts, siteById, type SiteId, type SiteStatus } from "../sites/sites";
import type { FooterLink, SiteFooterConfig } from "./footer-config";

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
    note: "font-normal",
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
    // `config`: real columns — two on a phone, side by side from `sm`, each a heading over a stacked list.
    columns: "grid min-w-0 grid-cols-2 gap-x-6 gap-y-6 pb-2 sm:grid-flow-col sm:grid-cols-none sm:auto-cols-[minmax(0,13rem)] sm:gap-x-10",
    stack: "flex min-w-0 flex-col gap-2",
    stackList: "flex min-w-0 flex-col gap-1",
    identity: "text-fg-secondary",
    // The accounts drawn as their icon (the name stays for screen readers): colour change only on hover, never movement.
    socials: "flex flex-wrap items-center gap-x-3 gap-y-2",
    social:
      "inline-flex min-h-6 min-w-6 items-center justify-center rounded-md text-fg-secondary no-underline transition-colors hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
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
  /**
   * The footer as the admin configured it (`resolveFooterSettings` of the app's settings): its columns, then one legal
   * line — `legalName · NEQ … · city`, the version when `showVersion`, the legal links, the socials. With it the family
   * is not drawn (the columns hold what the site wants) and the org's signature gives way to the legal identity.
   */
  config?: SiteFooterConfig;
  /** The app's router link for the config's internal links (Next's `Link`). @default "a" */
  linkAs?: LinkComponent;
};

const NO_STATUS = { shared: null, exceptions: new Map<string, Exclude<SiteStatus, "released">>() } as const;

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
  config,
  linkAs,
  className,
  ...props
}: SiteFooterProps) {
  const id = React.useId();
  const s = siteFooter({ variant, tone });
  const slim = variant === "app";
  const family = !slim && (familyProp ?? (current === "krizaka" && !config));
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
          {config && !slim && <ConfigColumns s={s} config={config} id={id} labels={labels} linkAs={linkAs} path={path} />}
          {family && (
            <nav aria-label={labels.family} className={s.family()}>
              {[
                ...columns.map((c) => ({ key: c.group, title: labels.groups[c.group], entries: c.entries, ...columnStatus(c.entries) })),
                { key: "krizaka" as const, title: labels.groups.krizaka, entries: companyEntries, ...NO_STATUS },
              ]
                .filter((c) => c.entries.length > 0)
                .map((c) => (
                  <details key={c.key} className={s.group()}>
                    <summary className={s.summary()}>
                      <span>
                        <span id={`${id}-${c.key}`}>{c.title}</span>
                        {c.shared && (
                          <span className={s.note()}>
                            <span aria-hidden="true"> · </span>
                            {labels.status[c.shared]}
                          </span>
                        )}
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={s.chevron()}>
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <ul aria-labelledby={`${id}-${c.key}`} className={s.list()}>
                      {c.entries.map((e) => {
                        const isCompany = c.key === "krizaka";
                        const atHome = isCompany && here(e.url);
                        const exception = c.exceptions.get(e.id);
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
                              {exception && <span className={s.note()}> ({labels.status[exception]})</span>}
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
          {config ? (
            <ConfigBottom s={s} config={config} krizaka={krizaka.url} brand={org?.brand.name ?? "Krizaka"} tag={tag} env={env} versionLabel={labels.version} linkAs={linkAs} path={path} controls={controls} />
          ) : (
          <div className={s.bottom()}>
            <a href={krizaka.url} className={s.signature()}>
              <ProductLogo id="krizaka" size={18} animated={false} />
              {org ? org.footer.line[lang] : `${labels.signature[site.kind]} · ${labels.place}`}
            </a>
            {tag && (
              <span className={s.version()}>
                <span className="sr-only">{labels.version} </span>
                {tag}
              </span>
            )}
            {legal && <div className={s.legal()}>{legal}</div>}
            <FooterSocials s={s} links={(org?.links?.social ?? []).map((x) => ({ id: x.id, label: x.label, href: x.url }))} />
            {controls && <div className={s.controls()}>{controls}</div>}
          </div>
          )}
        </div>
      </footer>
    </ToneContext.Provider>
  );
}

const isCurrent = (l: FooterLink, path?: string) => path !== undefined && !l.external && bare(l.href.split(/[?#]/)[0]!) === bare(path.split(/[?#]/)[0]!);

/** The configured bottom line: the mark beside the legal identity, the version, the legal links and the socials. */
function ConfigBottom({
  s,
  config,
  krizaka,
  brand,
  tag,
  env,
  versionLabel,
  linkAs,
  path,
  controls,
}: Readonly<{
  s: ReturnType<typeof siteFooter>;
  config: SiteFooterConfig;
  krizaka: string;
  brand: string;
  tag: string;
  env?: string;
  versionLabel: string;
  linkAs?: LinkComponent;
  path?: string;
  controls?: React.ReactNode;
}>) {
  const { legal, social } = config;
  const configured = (l: FooterLink) => <ConfigLink key={l.href} link={l} linkAs={linkAs} current={isCurrent(l, path)} />;
  const shown = legal.showVersion ? tag : env;
  const identity = [legal.legalName, legal.neq && `NEQ ${legal.neq}`, legal.city].filter(Boolean).join(" · ");
  const versionText = (
    <>
      <span className="sr-only">{versionLabel} </span>
      {shown}
    </>
  );
  return (
    <div className={s.bottom()}>
      {/* The company named once: its mark (home) beside its legal identity — never a second « by Technologies Krizaka ». */}
      <a href={krizaka} className={s.signature()} aria-label={brand}>
        <ProductLogo id="krizaka" size={18} animated={false} />
      </a>
      <span className={s.identity()}>{identity}</span>
      {shown &&
        (legal.showVersion && legal.versionHref ? (
          <a href={legal.versionHref} className={s.version({ className: "no-underline hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" })}>
            {versionText}
          </a>
        ) : (
          <span className={s.version()}>{versionText}</span>
        ))}
      {legal.links.length > 0 && <div className={s.legal()}>{legal.links.map(configured)}</div>}
      <FooterSocials s={s} links={social ?? []} />
      {controls && <div className={s.controls()}>{controls}</div>}
    </div>
  );
}

/** Icons of the accounts a glyph exists for; any other account stays a text link. */
const SOCIAL_ICONS: Readonly<Partial<Record<string, typeof InstagramIcon>>> = { instagram: InstagramIcon, youtube: YoutubeIcon };

/** The company's accounts: each is its icon (decorative) in a link named by the account, opening in a new tab. */
function FooterSocials({ s, links }: Readonly<{ s: ReturnType<typeof siteFooter>; links: readonly { id: string; label: string; href: string }[] }>) {
  if (links.length === 0) return null;
  return (
    <div className={s.socials()}>
      {links.map((x) => {
        const Icon = SOCIAL_ICONS[x.id];
        return (
          <a key={x.id} href={x.href} target="_blank" rel="noopener noreferrer" className={Icon ? s.social() : s.link()}>
            {Icon && <Icon size={20} />}
            {Icon ? <span className="sr-only">{x.label}</span> : x.label}
          </a>
        );
      })}
    </div>
  );
}

/** The admin-configured columns: a title (and status) over a list of links. */
function ConfigColumns({
  s,
  config,
  id,
  labels,
  linkAs,
  path,
}: Readonly<{ s: ReturnType<typeof siteFooter>; config: SiteFooterConfig; id: string; labels: FamilyLabels; linkAs?: LinkComponent; path?: string }>) {
  if (config.columns.length === 0) return null;
  return (
    <nav aria-label={config.label} className={s.columns()}>
      {config.columns.map((c) => (
        <div key={c.id} className={s.stack()}>
          <p id={`${id}-c-${c.id}`} className={s.title()}>
            {c.title}
            {c.status && (
              <span className={s.note()}>
                <span aria-hidden="true"> · </span>
                {labels.status[c.status]}
              </span>
            )}
          </p>
          <ul aria-labelledby={`${id}-c-${c.id}`} className={s.stackList()}>
            {c.links.map((l) => (
              <li key={l.href}>
                <ConfigLink link={l} linkAs={linkAs} current={isCurrent(l, path)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** A configured link: the router's link inside the site, a plain `<a>` when it leaves it. */
function ConfigLink({ link, linkAs, current }: Readonly<{ link: FooterLink; linkAs?: LinkComponent; current: boolean }>) {
  const s = siteFooter();
  const Comp = (link.external || !linkAs ? "a" : linkAs) as React.ElementType;
  return (
    <Comp href={link.href} className={s.link()} aria-current={current ? "page" : undefined}>
      {link.label}
    </Comp>
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
