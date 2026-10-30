// Server-safe. The frame and the rhythm of a shop page (ADR-007 §2): every section draws inside the page frame between the
// gutters (`bleed` for a photo only), one vertical rhythm set by the density, a hairline between sections. No section sets
// its own margin: it only says what it holds.
import * as React from "react";

import { cn } from "../cn";
import { Page, SectionHeading } from "../page/page";

/** A photo the product resolved: the address, its words, and the widths it has (`srcSet`). */
export type ShopPhoto = {
  src: string;
  /** What it shows, in words; empty when it only sets a mood. */
  alt: string;
  /** The widths the product holds (`/a-480.avif 480w, /a-960.avif 960w`); the section brings the `sizes`. */
  srcSet?: string;
};

export type ShopFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The look preset (`salon-vitrine`, `@krizaka/tokens`): its tokens apply to everything inside. */
  preset?: string;
  /**
   * The rhythm: `compact` 40 px between sections (24 on a phone), `airy` 64 px (40). The document's, or the preset's.
   * @default "compact"
   */
  density?: "compact" | "airy";
  /**
   * One of the accents the preset lists as tested (`krizaka`, `akinaza:accent-2`…): the owner's choice within the look. Without it, the preset's own.
   * @see @krizaka/tokens `shopPresets`
   */
  accent?: string;
  /**
   * The paper under the page, from the preset: `seyes` (ruled), `kraft` (brown — mount `PaperGrain` once), `washi` (a tint of the accent) or `plain`.
   * @default "plain"
   */
  paper?: "plain" | "seyes" | "kraft" | "washi";
  /**
   * The look's motion mode, CSS only (`still` · `soft` · `paper` · `lively`): the arrival of blocks and the settling of photos. Under `prefers-reduced-motion` every mode is still.
   * @see @krizaka/tokens `shopPresets`
   */
  motion?: "still" | "soft" | "paper" | "lively";
  /**
   * The owner's title face over the look's (`serif` · `sans` · `poster`): one of the faces the page already loads. Prefer
   * `shopFrameLook(page)` of `@krizaka/ui/shop/look`, which hands the frame every look prop at once.
   */
  face?: "serif" | "sans" | "poster";
};

const PAPERS = { plain: undefined, seyes: "ruled", kraft: "kraft", washi: "washi" } as const;

/** The page: sets the look preset, the accent, the paper and the density the sections below read. */
export function ShopFrame({ preset, density = "compact", accent, paper = "plain", motion, face, className, ...props }: ShopFrameProps) {
  return <div data-shop-preset={preset} data-shop-accent={accent} data-paper={PAPERS[paper]} data-density={density} data-shop-motion={motion} data-shop-face={face} className={cn("kz-shop", className)} {...props} />;
}

export type ShopSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The section's id: the anchor, and the heading's id. */
  id?: string;
  /** The `h2`. Without one the section is named by `aria-label`. */
  title?: React.ReactNode;
  /** A short lower-case note above the title. */
  eyebrow?: React.ReactNode;
  /** One sentence under the title. */
  lead?: React.ReactNode;
  /** A link or a button on the right of the heading (« All times → »). */
  actions?: React.ReactNode;
  /** The content reaches the edges of the screen (a photo, a strip); the heading stays on the frame. */
  bleed?: boolean;
  /** The section is the page's first (the hero): no hairline, no padding. */
  first?: boolean;
  /** A bird of the Krizaka look (`mascotFor`, `ShopMascot` of `@krizaka/ui/shop/look`), decorative, in the corner of the heading. Never on the first screen. */
  mascot?: React.ReactNode;
};

/** A section of a shop page. */
export function ShopSection({ id, title, eyebrow, lead, actions, bleed, first, mascot, className, children, ...props }: ShopSectionProps) {
  const auto = React.useId();
  const headingId = title ? `${id ?? auto}-title` : undefined;
  const heading = title ? <SectionHeading id={headingId} size="sm" eyebrow={eyebrow} title={title} lead={lead} actions={actions} /> : null;
  return (
    <section id={id} aria-labelledby={headingId} data-first={first ? "" : undefined} data-bleed={bleed ? "" : undefined} className={cn("kz-shop-section", className)} {...props}>
      {mascot ? <div aria-hidden className="kz-shop-mascot">{mascot}</div> : null}
      {bleed ? (
        <>
          {heading && <Page>{heading}</Page>}
          {children}
        </>
      ) : (
        <Page>
          {heading}
          {children}
        </Page>
      )}
    </section>
  );
}
