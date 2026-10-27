// Server-safe (the pinned notes are the wall's, a client island imported through its own entry). The owner's news
// (ADR-007 §3): `board` — up to three pinned notes, newest first, each taken down after its last day; `banner` — one line of
// text above the hero (never an image: the first screen's LCP stays the hero's). The clock is the host's: `today` arrives as a
// day, the section never reads the time.
import { PinnedNote } from "@krizaka/ui/wall";
import * as React from "react";

import { cn } from "../../cn";
import { ShopSection } from "../frame";
import { SHOP_LIMITS } from "../limits";

export type BulletinVariant = "board" | "banner";

export type ShopFlyer = {
  id: string;
  /** At most 140 characters. */
  text: string;
  signature?: string;
  /** The last day it is shown (`2026-11-03`, inclusive); absent: until the owner takes it down. */
  until?: string;
};

export type BulletinSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "board" */
  variant?: BulletinVariant;
  /** The flyers, newest first. */
  flyers: readonly ShopFlyer[];
  /** Today, in the shop's time zone (`2026-10-27`). */
  today: string;
  /** `board`: the section's title (`News`). `banner`: its accessible name. */
  title: string;
};

/** The flyers still up on a given day, newest first, at most three. */
export function liveFlyers(flyers: readonly ShopFlyer[], today: string): ShopFlyer[] {
  return flyers.filter((f) => !f.until || f.until >= today).slice(0, SHOP_LIMITS.flyers);
}

/** The owner's news: pinned notes, or one line above the hero. */
export function BulletinSection({ variant = "board", flyers, today, title, className, ...props }: BulletinSectionProps) {
  const live = liveFlyers(flyers, today);
  if (live.length === 0) return null;
  if (variant === "banner") {
    return (
      <aside aria-label={title} data-variant="banner" className={cn("border-b border-border-subtle bg-accent-soft", className)}>
        <p className="m-0 mx-auto max-w-6xl px-4 py-2 text-center text-[13px] font-medium text-fg">{live[0]!.text}</p>
      </aside>
    );
  }
  return (
    <ShopSection title={title} className={className} data-variant="board" {...props}>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((f, i) => (
          <li key={f.id}>
            <PinnedNote text={f.text} signature={f.signature} rotation={[-1.2, 1, -0.6][i % 3]} hold={i % 2 === 0 ? "tape" : "pin"} lines={3} />
          </li>
        ))}
      </ul>
    </ShopSection>
  );
}
