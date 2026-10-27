// Server-safe (the TV and the facades are client islands imported through their own entries). The shop's videos (ADR-007
// §3): `tv` — the old television with the shop's latest video (its own clip, or a platform's short behind its facade);
// `shorts` — another channel's reels, each behind a facade. Nothing is requested from a platform before the click.
import { EmbedFacade, type EmbedPlatform } from "@krizaka/ui/embed-facade";
import { RetroTv, type RetroTvProps } from "@krizaka/ui/retro-tv";
import * as React from "react";

import { ShopSection } from "../frame";
import { SHOP_LIMITS } from "../limits";

export type VideoVariant = "tv" | "shorts";

export type ShopReel = {
  id: string;
  platform: EmbedPlatform;
  /** The public address of the post (validated by `embedUrl`: anything else draws nothing). */
  url: string;
  /** Its accessible name. */
  title: string;
  /** The host's own copy of the picture. */
  poster?: string;
};

export type VideoSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "tv" */
  variant?: VideoVariant;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** The reels, newest first. `tv` plays the first one (unless `clip` is set); `shorts` draws up to six. */
  reels?: readonly ShopReel[];
  /** `tv`: the shop's own clip in the cabinet (`src`, `poster`, `title`). */
  clip?: Pick<RetroTvProps, "src" | "poster" | "title">;
  /** The facade's button, per platform (« Load TikTok and play »), passed translated. */
  playLabels: Record<EmbedPlatform, string>;
  /** The line under a facade's button: what the platform will receive on the click. */
  notice?: React.ReactNode;
  /** `tv`: the cabinet. @default "cabinet" */
  cabinet?: "cabinet" | "portable";
  /** `tv`: the channel written on the cabinet (`CH 3 · Saint-Henri`). */
  channel?: string;
  /** `tv`: what sits beside the television (a few pinned notes, a line). */
  aside?: React.ReactNode;
};

/** The shop's videos: the old TV, or a strip of short reels behind a click. */
export function VideoSection({ variant = "tv", title, lead, reels = [], clip, playLabels, notice, cabinet = "cabinet", channel, aside, className, ...props }: VideoSectionProps) {
  const facade = (r: ShopReel, className?: string) => (
    <EmbedFacade key={r.id} platform={r.platform} url={r.url} title={r.title} playLabel={playLabels[r.platform]} poster={r.poster} notice={notice} className={className} />
  );
  let body: React.ReactNode;
  if (variant === "shorts") {
    body = (
      <ul className="m-0 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto p-0 pb-2">
        {reels.slice(0, SHOP_LIMITS.reels).map((r) => (
          <li key={r.id} className="w-44 shrink-0 snap-start sm:w-52">
            {facade(r)}
          </li>
        ))}
      </ul>
    );
  } else {
    const first = reels[0];
    let tv: React.ReactNode = null;
    if (clip) tv = <RetroTv {...clip} variant={cabinet} channel={channel} />;
    else if (first) tv = <RetroTv title={first.title} variant={cabinet} channel={channel}>{facade(first)}</RetroTv>;
    body = (
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12">
        <div className="order-2 md:order-1">{aside}</div>
        <div className="order-1 mx-auto w-56 md:order-2 md:w-full">{tv}</div>
      </div>
    );
  }
  return (
    <ShopSection title={title} lead={lead} className={className} data-variant={variant} {...props}>
      {body}
    </ShopSection>
  );
}
