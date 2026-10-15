// Client (hover / focus swaps the picture for its animated preview). A video in a grid or a shelf: the picture in a 16:9
// or 9:16 frame (a source of the other shape is shown inside, never stretched), badges, duration, the title on two lines
// reserved, the creator, a count and one quick action — the same height of body in every card so a row aligns.
import * as React from "react";

import { Avatar } from "../avatar";
import type { DefaultAvatar } from "../avatar/default-avatar";
import { BlockLink, type LinkComponent } from "../block-link";
import { Card } from "../card";
import { cn } from "../cn";

export type VideoCardAspect = "landscape" | "portrait";

export interface VideoCardCreator {
  /** The creator's name. */
  name: string;
  /** Their photo. */
  avatarSrc?: string | null;
  /** Their profile. */
  href?: string;
  /** The Krizaka default picture when there is no photo (a brand and a seed). */
  defaultAvatar?: DefaultAvatar;
}

export interface VideoCardProps extends Omit<React.ComponentProps<"article">, "title"> {
  /** The title; it names the card and is its link. */
  title: string;
  /** Where the card opens. */
  href: string;
  /** The app's router link (Next's `Link`). */
  linkAs?: LinkComponent;
  /**
   * The frame: `landscape` (16:9) or `portrait` (9:16).
   * @default "landscape"
   */
  aspect?: VideoCardAspect;
  /**
   * `stack` (picture over text) or `row` (picture beside the text: the list mode of a section).
   * @default "stack"
   */
  layout?: "stack" | "row";
  /** The picture. */
  poster?: string | null;
  /** An animated picture (WebP) shown while the card is hovered or focused. */
  previewSrc?: string | null;
  /**
   * `cover` fills the frame; `contain` draws the whole picture over a blurred copy of itself (a source of the other
   * orientation: no cropped face, no black bar).
   * @default "cover"
   */
  fit?: "cover" | "contain";
  /** The length, already formatted (`3:42`). */
  duration?: string;
  /** Badges at the top-left of the picture (Free, a price, 18+). Put them on `scrim` so they read in both themes. */
  badges?: React.ReactNode;
  /** Who made it: name, photo, profile. */
  creator?: VideoCardCreator;
  /** What is counted (`12.4K views`), already formatted. */
  meta?: React.ReactNode;
  /** One quick action at the end of the footer (a tip, a save). Its clicks must not follow the card's link. */
  action?: React.ReactNode;
  /** A sensitive picture: blurred and scaled so nothing shows (put the reveal button in `overlay`). */
  blurred?: boolean;
  /** Over the whole picture, above the card's link (a veil, a reveal button). */
  overlay?: React.ReactNode;
  /** Shown instead of the picture while there is none. */
  fallback?: React.ReactNode;
  /** `eager` for the first cards of a page. */
  loading?: "lazy" | "eager";
}

const FRAME = { landscape: "aspect-video", portrait: "aspect-[9/16]" } as const;

/** A video card whose frame, body and footer have one height per aspect, so a grid row or a shelf never staggers. */
export function VideoCard({
  title,
  href,
  linkAs,
  aspect = "landscape",
  layout = "stack",
  poster,
  previewSrc,
  fit = "cover",
  duration,
  badges,
  creator,
  meta,
  action,
  fallback,
  blurred = false,
  overlay,
  loading = "lazy",
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: VideoCardProps) {
  const [live, setLive] = React.useState(false);
  const picture = live && previewSrc ? previewSrc : poster;
  const row = layout === "row";
  const tall = aspect === "portrait" && !row;
  return (
    <article
      data-aspect={aspect}
      data-layout={layout}
      className={cn("group relative h-full min-w-0", className)}
      onMouseEnter={(e) => (setLive(true), onMouseEnter?.(e))}
      onMouseLeave={(e) => (setLive(false), onMouseLeave?.(e))}
      onFocus={(e) => (setLive(true), onFocus?.(e))}
      onBlur={(e) => (setLive(false), onBlur?.(e))}
      {...props}
    >
      <Card.Root interactive tone="glass" className={cn("h-full w-full max-w-full", row ? "flex-row" : "flex-col")}>
        <Card.Media aspect="auto" className={cn("shrink-0", FRAME[aspect], row && (aspect === "portrait" ? "w-24 sm:w-28" : "w-40 sm:w-56"))}>
          {fit === "contain" && picture && <img src={picture} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />}
          <Card.Image src={picture} loading={loading} fallback={fallback} className={cn(fit === "contain" && "relative object-contain", blurred && "scale-110 blur-xl")} />
          {overlay && <div className="absolute inset-0 z-20 flex">{overlay}</div>}
          {badges && (
            <Card.Overlay corner="top-left" className="theme-dark flex-wrap">
              {badges}
            </Card.Overlay>
          )}
          {duration && (
            <Card.Overlay corner="bottom-right">
              <span className="rounded-sm bg-scrim px-1.5 py-0.5 font-mono text-[11px] text-fg-on-media">{duration}</span>
            </Card.Overlay>
          )}
        </Card.Media>
        <Card.Body className="min-w-0 flex-1 justify-between gap-2 p-3">
          <h3 className="m-0 min-h-[2.5em] text-sm font-semibold leading-tight text-fg">
            <BlockLink href={href} linkAs={linkAs} className="line-clamp-2 outline-none after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ring">
              {title}
            </BlockLink>
          </h3>
          {/* A narrow card (9:16 on a shelf) puts the count and the action on a second line so the name is never cut to an initial. */}
          <div className={cn("relative z-10 text-xs text-fg-secondary", tall ? "flex flex-col gap-1" : "flex h-8 items-center gap-2")}>
            {creator && (
              <div className="flex h-6 min-w-0 items-center gap-2">
                <Avatar src={creator.avatarSrc} defaultAvatar={creator.defaultAvatar} alt="" fallback={creator.name.charAt(0)} size="xs" className="shrink-0" />
                {creator.href ? (
                  <BlockLink href={creator.href} linkAs={linkAs} className="min-w-0 truncate hover:text-fg">
                    {creator.name}
                  </BlockLink>
                ) : (
                  <span className="min-w-0 truncate">{creator.name}</span>
                )}
              </div>
            )}
            {(meta || action) && (
              <div className={cn("flex items-center gap-2", tall ? "h-7 justify-between" : "ml-auto shrink-0")}>
                {meta && <span className="shrink-0 font-mono text-[11px] text-fg-muted">{meta}</span>}
                {action && <span className="shrink-0">{action}</span>}
              </div>
            )}
          </div>
        </Card.Body>
      </Card.Root>
    </article>
  );
}
