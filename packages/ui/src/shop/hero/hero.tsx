// Server-safe (the poster's cover and the TV are client islands imported through their own entries). The first section of
// a shop page (ADR-007 §3): `poster` (the cover, the name over it), `split` (the title in the frame beside a 4:5 photo),
// `banner` (a 21:9 photo, the name under it), `tv` (the shop's sign and its latest video in the old TV). The name is the
// page's `h1` in every variant; the first image is the page's LCP (high priority, a fixed box).
import { CoverHero } from "@krizaka/ui/cover-hero";
import { RetroTv, type RetroTvProps } from "@krizaka/ui/retro-tv";
import { ShopSign } from "@krizaka/ui/wall";
import * as React from "react";

import { cn } from "../../cn";
import { Page } from "../../page/page";
import type { ShopPhoto } from "../frame";
import { Photo } from "../photo";

export type HeroVariant = "poster" | "split" | "banner" | "tv";

export type HeroSectionProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** The drawing. @default "poster" */
  variant?: HeroVariant;
  /** The shop's name: the page's `h1`. */
  title: string;
  /** A short mono line above the name (`Saint-Henri · Montréal`). */
  eyebrow?: React.ReactNode;
  /** One line: what the shop promises. */
  lead?: React.ReactNode;
  /** Chips: open now, the area, the score — only what is true now. */
  facts?: React.ReactNode;
  /** The one action (`ButtonLink`, « Book »). */
  actions?: React.ReactNode;
  /** The cover: a photo (16:9), an optional 4:5 crop for a phone, an optional muted loop (`poster`). */
  cover?: ShopPhoto & { phone?: string; video?: { webm?: string; mp4?: string } };
  /** Where the photo is cropped to. @default "center" */
  focus?: "center" | "top" | "bottom";
  /** `tv`: the shop's latest video in the cabinet (`src`, `poster`, `label`, or an `EmbedFacade` as `children`). */
  tv?: RetroTvProps;
};

const lead = "m-0 max-w-xl text-base leading-relaxed text-fg-secondary sm:text-lg";
const eyebrowClass = "m-0 font-mono text-[13px] text-fg-accent";
// The weight comes from the preset (`--kz-shop-title-weight`: Young Serif has one, Plus Jakarta Sans 650): `blocks.css`.
const titleClass = "kz-shop-title m-0 font-display text-4xl leading-[1.05] tracking-tight text-fg sm:text-5xl";

function Text({ title, eyebrow, lead: leadText, facts, actions }: Pick<HeroSectionProps, "title" | "eyebrow" | "lead" | "facts" | "actions">) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-3">
      {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
      <h1 className={titleClass}>{title}</h1>
      {leadText && <p className={lead}>{leadText}</p>}
      {facts && <div className="flex flex-wrap items-center gap-2">{facts}</div>}
      {actions && <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>}
    </div>
  );
}

/** The first section of a shop page: poster, split, banner or tv. */
export function HeroSection({ variant = "poster", title, eyebrow, lead: leadText, facts, actions, cover, focus = "center", tv, className, ...props }: HeroSectionProps) {
  if (variant === "poster") {
    return (
      <CoverHero
        data-first=""
        data-variant="poster"
        className={cn("kz-shop-section min-h-[24rem] sm:min-h-[28rem] lg:min-h-[31rem]", className)}
        cover={cover && { src: cover.src, alt: cover.alt, video: cover.video, phone: cover.phone, focus }}
        eyebrow={eyebrow}
        title={title}
        lead={leadText}
        facts={facts}
        actions={actions}
        {...props}
      />
    );
  }
  const text = <Text title={title} eyebrow={eyebrow} lead={leadText} facts={facts} actions={actions} />;
  if (variant === "split") {
    return (
      <header data-first="" data-variant="split" className={cn("kz-shop-section", className)} {...props}>
        <Page>
          <div className="grid items-center gap-6 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] md:gap-12 md:py-8">
            <div className="order-2 md:order-1">{text}</div>
            {cover && <Photo photo={cover} ratio="4/5" priority sizes="(min-width: 48rem) 32rem, 100vw" className="order-1 max-h-[26rem] md:order-2 md:max-h-none" />}
          </div>
        </Page>
      </header>
    );
  }
  if (variant === "banner") {
    return (
      <header data-first="" data-variant="banner" className={cn("kz-shop-section", className)} {...props}>
        {cover && (
          <div className="mx-auto w-full max-w-[90rem]">
            <Photo photo={cover} ratio="21/9" priority sizes="100vw" className="rounded-none aspect-[3/2] sm:aspect-[21/9]" />
          </div>
        )}
        <Page>
          <div className="py-6">{text}</div>
        </Page>
      </header>
    );
  }
  return (
    <header data-first="" data-variant="tv" className={cn("kz-shop-section", className)} {...props}>
      <Page>
        <div className="grid items-center gap-6 py-6 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12 md:py-8">
          <div className="flex min-w-0 flex-col items-start gap-4">
            <ShopSign as="h1" variant="neon">{title}</ShopSign>
            {leadText && <p className={lead}>{leadText}</p>}
            {facts && <div className="flex flex-wrap items-center gap-2">{facts}</div>}
            {actions && <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>}
          </div>
          {tv && <RetroTv {...tv} className={cn("mx-auto w-56 md:w-full", tv.className)} />}
        </div>
      </Page>
    </header>
  );
}
