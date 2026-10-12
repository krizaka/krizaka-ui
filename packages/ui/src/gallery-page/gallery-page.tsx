// Server-safe. A demo or a gallery (blocks.css `.kz-tpl-gallery`): the hero, the filters as chips, then the pieces in
// columns of different heights — each a framed media with its title and caption (a recording of the real product, an
// image it generated, with its prompt) — and the closing call.
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Section } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

import { cn } from "../cn";

export interface GalleryItem {
  /** A stable key. */
  id: string;
  /** The media: an `<img>` with its `alt`, a `<video>` with its label, a VideoPlayer. */
  media: React.ReactNode;
  /** Its title. */
  title: React.ReactNode;
  /** One line: what it shows, how it was made (a prompt, a seed). */
  caption?: React.ReactNode;
}

export type GalleryPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The brand the page wears (`.brand-<id>`). */
  brand?: string;
  /** The way back. */
  back?: { href: string; label: string };
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One or two sentences under it. */
  lead?: React.ReactNode;
  /** The hero's actions. */
  actions?: React.ReactNode;
  /** Above the pieces: the filters (ChipLink, a Chip group) — the address says which one is on. */
  filters?: React.ReactNode;
  /** The gallery's accessible name. */
  galleryLabel: string;
  /** The pieces, featured first. */
  items: readonly GalleryItem[];
  /** After the gallery: how it was made, the facts. */
  children?: React.ReactNode;
  /** The closing call. */
  closing?: { title: React.ReactNode; body?: React.ReactNode; actions: React.ReactNode };
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A demo or a gallery: hero, filters, media in staggered columns, closing call. */
export function GalleryPage({ brand, back, eyebrow, title, lead, actions, filters, galleryLabel, items, closing, linkAs, className, children, ...props }: GalleryPageProps) {
  return (
    <div className={cn(brand && "brand-" + brand, className)} {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} align="center" backdrop="plain">
        {actions}
      </PageHero>
      <Section aria-label={galleryLabel} spacing="sm">
        {filters && <div className="kz-tpl-filters">{filters}</div>}
        <ul className="kz-tpl-gallery">
          {items.map((item) => (
            <li key={item.id}>
              <figure className="kz-tpl-figure">
                <div className="kz-tpl-figure-media">{item.media}</div>
                <figcaption>
                  <strong>{item.title}</strong>
                  {item.caption && <span>{item.caption}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>
      {children}
      {closing && (
        <Section spacing="sm" aria-labelledby="gallery-closing">
          <CtaPanel id="gallery-closing" title={closing.title} body={closing.body} reveal>
            {closing.actions}
          </CtaPanel>
        </Section>
      )}
    </div>
  );
}
