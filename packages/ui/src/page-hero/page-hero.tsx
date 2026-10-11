// Server-safe. The first screen of a page (blocks.css): painted at once — never revealed, it is the LCP.
import type * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import { ArrowGlyph } from "../glyphs";
import { Page, type PageSize } from "../page/page";
import { SectionBackdrop } from "../section-backdrop/section-backdrop";

export type PageHeroProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The page's title: the `h1`. */
  title: React.ReactNode;
  /** A short mono line above the title (where the reader is: `Open source · building block`). */
  eyebrow?: React.ReactNode;
  /** One or two sentences under the title: what the page gives the reader. */
  lead?: React.ReactNode;
  /** The way back to the parent page, above the eyebrow. */
  back?: { href: string; label: string };
  /** The app's link component for internal addresses (Next's `Link`); an `<a>` otherwise. */
  linkAs?: LinkComponent;
  /** Beside the text, on the right (above it on a phone): the page's bird, an illustration. Decorative or labelled by you. */
  aside?: React.ReactNode;
  /**
   * The brand's backdrop behind the hero (the gradient, the dome; `grid` adds the perspective floor).
   * @default "grid"
   */
  backdrop?: "grid" | "plain" | "none";
  /**
   * `center` for a page that opens on its title alone (a hub, a contact page).
   * @default "start"
   */
  align?: "start" | "center";
  /**
   * The width of the content.
   * @default "default"
   */
  size?: PageSize;
  /** Under the lead: facts (`Facts`), actions (`ActionBar`), a search field. */
  children?: React.ReactNode;
};

/** The first screen of a page: back link, eyebrow, `h1`, lead, what follows them (facts, actions) and an aside. */
export function PageHero({ title, eyebrow, lead, back, linkAs, aside, backdrop = "grid", align = "start", size, className, children, ...props }: PageHeroProps) {
  const body = (
    <Page size={size}>
      <div className="kz-hero-text">
        {back && (
          <BlockLink href={back.href} linkAs={linkAs} className="kz-hero-back">
            <ArrowGlyph direction="left" className="h-3.5 w-3.5" /> {back.label}
          </BlockLink>
        )}
        {eyebrow && <p className="kz-eyebrow">{eyebrow}</p>}
        <h1 className="kz-hero-title">{title}</h1>
        {lead && <p className="kz-hero-lead">{lead}</p>}
        {children && <div className="kz-hero-extra">{children}</div>}
      </div>
      {aside && align === "start" && <div className="kz-hero-aside">{aside}</div>}
    </Page>
  );
  const shared = { className: cn("kz-hero", className), "data-align": align === "start" ? undefined : align, ...props };
  if (backdrop === "none") return <header {...shared}>{body}</header>;
  return (
    <SectionBackdrop as="header" grid={backdrop === "grid"} {...shared}>
      {body}
    </SectionBackdrop>
  );
}
