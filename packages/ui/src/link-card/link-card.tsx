// Server-safe. A card that leads somewhere (blocks.css): the whole card is the link — an icon, a title, one sentence,
// the way in. Compact, one look for every entry point of a page (a documentation hub, the products, the next step).
import type * as React from "react";

import { BlockLink, isExternal, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import { ArrowGlyph, ExternalGlyph } from "../glyphs";

export type LinkCardProps = Omit<React.ComponentProps<"a">, "title" | "href"> & {
  /** Where the card leads. An absolute URL opens in a new tab, with the external mark. */
  href: string;
  /** The title: the name of the destination. */
  title: React.ReactNode;
  /** One sentence: what the reader finds there. */
  description?: React.ReactNode;
  /** The icon tile on the left (a product mark, a signature icon): decorative, the title names the link. */
  icon?: React.ReactNode;
  /** A short mono line above the title (a category, a version). */
  meta?: React.ReactNode;
  /** The way in, under the text, with an arrow: `Open`, `Read the guide`. */
  cta?: React.ReactNode;
  /** Under the text, before the way in: facts (`Facts`), badges. Never another link — the card is one. */
  extra?: React.ReactNode;
  /**
   * The title's element: a heading when the cards are the content of a section (a hub), `span` inside a list of links.
   * @default "h3"
   */
  titleAs?: "h2" | "h3" | "h4" | "span";
  /**
   * `row`: the icon beside the text (compact, the default); `stack`: the icon above it.
   * @default "row"
   */
  layout?: "row" | "stack";
  /** The app's link component for internal addresses (Next's `Link`); an `<a>` otherwise. */
  linkAs?: LinkComponent;
};

/** An entry point: the whole card is one link — icon, title, sentence, the way in. Lifts and lights under the pointer. */
export function LinkCard({ href, title, description, icon, meta, cta, extra, titleAs: Title = "h3", layout = "row", linkAs, className, ...props }: LinkCardProps) {
  const external = isExternal(href);
  return (
    <BlockLink
      href={href}
      linkAs={linkAs}
      external={external}
      className={cn("kz-block-card kz-link-card", className)}
      data-kz-light=""
      data-layout={layout === "row" ? undefined : layout}
      {...props}
    >
      {icon && (
        <span className="kz-block-icon" aria-hidden>
          {icon}
        </span>
      )}
      <div className="kz-link-card-body">
        {meta && <p className="kz-link-card-meta">{meta}</p>}
        <Title className="kz-link-card-title">{title}</Title>
        {description && <p className="kz-link-card-text">{description}</p>}
        {extra && <div className="kz-link-card-extra">{extra}</div>}
        {(cta || external) && (
          <span className="kz-link-card-cta">
            {cta}
            {external ? <ExternalGlyph className="h-3.5 w-3.5" /> : <ArrowGlyph className="h-3.5 w-3.5" />}
          </span>
        )}
      </div>
    </BlockLink>
  );
}
