// Client (the birds hold an id). The template of the tool sites (ui., java., ts., the motion lab) that wear krizaka.com's
// identity — the Cahier (ADR-004), the site's bird, taped prints — shared here, never copied per site. It carries the language,
// not a layout: `SiteCahier` is the frame (the bar with the bird, the nav, the family footer, the site's hue), and the regions
// (`SiteCahierHero`, `SiteCahierDoc`, and every block of the package) are composed by each site in its own order.
import type * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import type { MascotBird } from "../mascots/geometry";
import { Mascot } from "../mascots/mascot";
import { Page } from "../page/page";
import { PageHero, type PageHeroProps } from "../page-hero/page-hero";
import { SiteFooter, type SiteFooterProps } from "../site-footer/site-footer";
import type { SiteId } from "../sites/sites";
import { TapedPhoto } from "../taped-photo/taped-photo";

export interface SiteCahierNavItem {
  /** Where it goes. */
  href: string;
  /** What the reader reads. */
  label: React.ReactNode;
  /** The page being read: marked `aria-current="page"`. */
  current?: boolean;
}

export type SiteCahierProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** The site (`@krizaka/ui/sites`): it chooses the footer's signature and marks the family. */
  site: SiteId;
  /** The site's name, never translated (`Krizaka UI`). */
  name: string;
  /** The site's bird, by the brand reference: the duck builds, the owl reads, the pigeon delivers, the flamingo answers, the falcon watches. */
  bird: MascotBird;
  /** The site's accent hue, 0 to 360: it tints the rails and the small accents of the blocks. Unset, the brand accent. */
  hue?: number;
  /** The site's pages, in the bar. */
  nav: readonly SiteCahierNavItem[];
  /** The accessible name of the navigation. @default "Main" */
  navLabel?: string;
  /** The address of the home, on the bird and the name. @default "/" */
  homeHref?: string;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
  /** Your own bar (the shared `NavBar`, with search and the language), in place of the simple one. */
  bar?: React.ReactNode;
  /** The family footer's props (`version`, `legal`, `labels`, the site's own columns as `children`); `false` for none. */
  footer?: Omit<SiteFooterProps, "current"> | false;
  /** The pages: compose the regions and the blocks. */
  children?: React.ReactNode;
};

/** A tool site's frame: the Cahier's bar with the site's bird, its hue, the page, and the family footer. */
export function SiteCahier({ site, name, bird, hue, nav, navLabel = "Main", homeHref = "/", linkAs, bar, footer, className, style, children, ...props }: SiteCahierProps) {
  const h = hue === undefined || !Number.isFinite(hue) ? undefined : ((Math.round(hue) % 360) + 360) % 360;
  const tint =
    h === undefined
      ? undefined
      : ({
          "--kz-hue": `hsl(${h} 62% 52%)`,
          "--kz-hue-2": `hsl(${(h + 30) % 360} 62% 52%)`,
          "--kz-hue-text": `color-mix(in oklab, hsl(${h} 70% 50%) 40%, var(--kz-text-primary))`,
        } as React.CSSProperties);
  return (
    <div className={cn("kz-cahier", className)} data-site={site} style={{ ...tint, ...style }} {...props}>
      {bar ?? (
        <header className="kz-cahier-bar">
          <Page>
            <div className="kz-cahier-bar-row">
              <BlockLink href={homeHref} linkAs={linkAs} className="kz-cahier-brand">
                <Mascot bird={bird} tone="own" size={30} animated={false} />
                <span>{name}</span>
              </BlockLink>
              <nav aria-label={navLabel}>
                <ul className="kz-cahier-nav">
                  {nav.map((item, i) => (
                    <li key={i}>
                      <BlockLink href={item.href} linkAs={linkAs} aria-current={item.current ? "page" : undefined}>
                        {item.label}
                      </BlockLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </Page>
        </header>
      )}
      <main className="kz-cahier-main">{children}</main>
      {footer === false ? null : <SiteFooter current={site} {...footer} />}
    </div>
  );
}

export type SiteCahierHeroProps = Omit<PageHeroProps, "aside" | "backdrop"> & {
  /** The site's bird, taped in the notebook beside the title. */
  bird?: MascotBird;
  /** The note written under the print (`Plate I · the duck builds`). */
  birdCaption?: React.ReactNode;
  /** Your own picture beside the title, in place of the bird's print: a live demo, a versus card. */
  aside?: React.ReactNode;
  /** A doodle (or any mark) laid in the hero's margin, decorative. */
  doodle?: React.ReactNode;
};

/** The first screen of a tool site's page: a `PageHero` on plain paper, the bird taped beside it, a doodle in the margin. */
export function SiteCahierHero({ bird, birdCaption, aside, doodle, children, ...props }: SiteCahierHeroProps) {
  const print = aside ?? (bird ? (
    <TapedPhoto tape="top" tilt={2} caption={birdCaption}>
      <div className="kz-cahier-print">
        <Mascot bird={bird} tone="own" size={150} animated={false} />
      </div>
    </TapedPhoto>
  ) : undefined);
  return (
    <div className="kz-cahier-hero">
      <PageHero backdrop="plain" aside={print} {...props}>
        {children}
      </PageHero>
      {doodle && <div className="kz-cahier-doodle">{doodle}</div>}
    </div>
  );
}

export type SiteCahierDocProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The page's `h1`. */
  title: React.ReactNode;
  /** A mono line above the title (`Guide · 4 min`). */
  eyebrow?: React.ReactNode;
  /** The beside-column (the table of contents, the notes of the margin). */
  aside?: React.ReactNode;
  /** The accessible name of the beside-column. @default "On this page" */
  asideLabel?: string;
  /** The article. */
  children: React.ReactNode;
};

/** A documentation page on ruled paper: the title, the article in a reading column and, beside it, the page's contents. */
export function SiteCahierDoc({ title, eyebrow, aside, asideLabel = "On this page", className, children, ...props }: SiteCahierDocProps) {
  return (
    <Page size="wide" paper="lines" margin>
      <div className="kz-cahier-doc" data-aside={aside ? "" : undefined}>
        <article className={cn("kz-cahier-article", className)} {...props}>
          {eyebrow && <p className="kz-eyebrow">{eyebrow}</p>}
          <h1 className="kz-hero-title">{title}</h1>
          {children}
        </article>
        {aside && (
          <aside className="kz-cahier-aside" aria-label={asideLabel}>
            {aside}
          </aside>
        )}
      </div>
    </Page>
  );
}
