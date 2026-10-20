// Client (the reader's motion preference). The first screen of a shop or a place: its cover — a photo, or a muted loop that
// stays a still under reduced motion — behind the name, a one-line promise, a few facts and the main action. The words sit
// on a veil that reads in both themes; without a cover the brand's colours take its place.
import * as React from "react";
import { tv } from "tailwind-variants";

import { BlockLink, type LinkComponent } from "../block-link";
import { ArrowGlyph } from "../glyphs";
import { Page } from "../page/page";

export const coverHero = tv({
  slots: {
    root: "relative isolate flex min-h-[26rem] items-end overflow-hidden bg-surface-1 text-fg data-[cover]:text-fg-on-media sm:min-h-[30rem] lg:min-h-[34rem]",
    media: "absolute inset-0 -z-20 h-full w-full object-cover",
    veil: "absolute inset-0 -z-10 bg-linear-to-t from-scrim-strong via-scrim/55 to-scrim/10",
    plain: "absolute inset-0 -z-10 bg-linear-to-br from-accent/25 via-surface-1 to-accent-2/20",
    body: "flex flex-col gap-4 pb-8 pt-24 sm:pb-12",
    back: "inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-current no-underline opacity-90 hover:opacity-100",
    eyebrow: "m-0 font-mono text-xs font-semibold opacity-90",
    title: "m-0 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
    lead: "m-0 max-w-2xl text-base leading-relaxed opacity-95 sm:text-lg",
    facts: "flex flex-wrap items-center gap-2",
    actions: "flex flex-wrap items-center gap-3 pt-1",
  },
});
const s = coverHero();

export type CoverMedia = {
  /** The still: the photo, or the poster of the loop (shown first, and alone under reduced motion). */
  src: string;
  /** What it shows, in words; empty when it only decorates. */
  alt?: string;
  /** A muted loop over the still: WebM first, MP4 for Safari. */
  video?: { webm?: string; mp4?: string };
};

export type CoverHeroProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** The cover. Without it the hero wears the brand's colours. */
  cover?: CoverMedia;
  /** A short mono line above the name (where the shop is: `Saint-Henri · Montréal`). */
  eyebrow?: React.ReactNode;
  /** The name: the page's `h1`. */
  title: React.ReactNode;
  /** One line: what it promises. */
  lead?: React.ReactNode;
  /** Chips under the lead: open now, the neighbourhood, a rating — only what is true. */
  facts?: React.ReactNode;
  /** The main action (`ButtonLink`). */
  actions?: React.ReactNode;
  /** The way back, above the eyebrow. */
  back?: { href: string; label: string };
  /** The app's link component for the back link. */
  linkAs?: LinkComponent;
};

function usePlayLoop(enabled: boolean) {
  const [play, setPlay] = React.useState(false);
  React.useEffect(() => {
    if (!enabled) return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlay(!q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, [enabled]);
  return play;
}

/** A shop's first screen: the cover, the name, the promise, the facts and the main action. */
export function CoverHero({ cover, eyebrow, title, lead, facts, actions, back, linkAs, className, ...props }: CoverHeroProps) {
  const play = usePlayLoop(Boolean(cover?.video));
  return (
    <header data-cover={cover ? "" : undefined} className={s.root({ className })} {...props}>
      {cover ? (
        <>
          <img src={cover.src} alt={cover.alt ?? ""} className={s.media()} fetchPriority="high" decoding="async" />
          {play && cover.video && (
            <video className={s.media()} poster={cover.src} autoPlay muted loop playsInline preload="metadata" aria-hidden tabIndex={-1}>
              {cover.video.webm && <source src={cover.video.webm} type="video/webm" />}
              {cover.video.mp4 && <source src={cover.video.mp4} type="video/mp4" />}
            </video>
          )}
          <div aria-hidden className={s.veil()} />
        </>
      ) : (
        <div aria-hidden className={s.plain()} />
      )}
      <Page>
        <div className={s.body()}>
          {back && (
            <BlockLink href={back.href} linkAs={linkAs} className={s.back()}>
              <ArrowGlyph direction="left" className="h-3.5 w-3.5" /> {back.label}
            </BlockLink>
          )}
          {eyebrow && <p className={s.eyebrow()}>{eyebrow}</p>}
          <h1 className={s.title()}>{title}</h1>
          {lead && <p className={s.lead()}>{lead}</p>}
          {facts && <div className={s.facts()}>{facts}</div>}
          {actions && <div className={s.actions()}>{actions}</div>}
        </div>
      </Page>
    </header>
  );
}
