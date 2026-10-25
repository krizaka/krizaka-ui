// Server-safe: no hook. The top of a page about one person or place — a client, a shop, a creator, a building
// (extracted from Orochia's ProfileHero, #650, #515): a slim cover, the avatar overlapping its lower edge, then the
// eyebrow, the name (the page's h1), its facts and the actions. No text ever sits on the cover: the words are under it,
// so a photo never costs their contrast (a scrim fades the photo's foot into the page all the same).
import type * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { brandClass } from "../story-variant";

export const profileBanner = tv({
  slots: {
    root: "relative flex w-full min-w-0 flex-col",
    // The brand's accent, as a calm tint, when there is no picture; a picture fills it (`object-cover`).
    cover:
      "relative h-28 w-full overflow-hidden rounded-xl bg-accent-soft bg-linear-to-br from-accent/30 via-accent-soft to-surface-2 sm:h-44 " +
      "[&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
    scrim: "pointer-events-none absolute inset-0 bg-linear-to-t from-surface-0/70 via-transparent to-transparent",
    body: "relative flex min-w-0 flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between sm:px-2",
    identity: "flex min-w-0 items-end gap-4",
    // The avatar overlaps the cover's lower edge by the same share at every width; the ring is the page's colour.
    avatar:
      "relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-3 ring-4 ring-surface-0 sm:-mt-14 sm:h-28 sm:w-28 " +
      "[&>*]:h-full! [&>*]:w-full! [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
    text: "flex min-w-0 flex-1 flex-col gap-1 pb-1",
    eyebrow: "font-mono text-[11px] font-semibold text-fg-accent",
    titleRow: "flex min-w-0 flex-wrap items-center gap-2",
    title: "min-w-0 font-display text-xl font-extrabold tracking-tight break-words text-fg sm:text-3xl",
    meta: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-secondary",
    actions: "flex shrink-0 flex-wrap items-center gap-2 sm:justify-end sm:pb-1",
  },
});
const s = profileBanner();

export type ProfileBannerProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The cover: an `<img alt="">` (decorative) or your framework's image. Absent: a tint of the brand's accent. */
  banner?: React.ReactNode;
  /** The avatar overlapping the cover: `Avatar` with the family's default (`defaultAvatar: { brand, seed }`, #598) when there is no photo. */
  avatar: React.ReactNode;
  /** A mono line above the name: what it is (« Client », « Shop »), an id. */
  eyebrow?: React.ReactNode;
  /** The name: the page's heading. */
  title: React.ReactNode;
  /**
   * The level of the name.
   * @default "h1"
   */
  titleAs?: "h1" | "h2";
  /** Beside the name: a status (`Badge`), a verified mark. */
  status?: React.ReactNode;
  /** Under the name: its facts (a handle, a city, « client since 2024 »). */
  meta?: React.ReactNode;
  /** The actions (message, book, edit): at the right from `sm`, under the name on a phone. */
  actions?: React.ReactNode;
  /** A brand scope (`akinaza` → `.brand-akinaza`): the default cover takes that brand's accent. */
  brand?: string;
};

/** A person's or a place's banner: cover, overlapping avatar, eyebrow, name (h1), facts and actions — the words never on the cover. */
export function ProfileBanner({ banner, avatar, eyebrow, title, titleAs: Title = "h1", status, meta, actions, brand, className, ...props }: ProfileBannerProps) {
  return (
    <section className={s.root({ className: cn(brandClass(brand), className) })} {...props}>
      <div data-cover="" className={s.cover()}>
        {banner}
        {banner ? <span aria-hidden className={s.scrim()} /> : null}
      </div>
      <div className={s.body()}>
        <div className={s.identity()}>
          <div data-avatar="" className={s.avatar()}>
            {avatar}
          </div>
          <div className={s.text()}>
            {eyebrow && <p className={s.eyebrow()}>{eyebrow}</p>}
            <div className={s.titleRow()}>
              <Title className={s.title()}>{title}</Title>
              {status}
            </div>
            {meta && <div className={s.meta()}>{meta}</div>}
          </div>
        </div>
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
    </section>
  );
}
