// Server-safe (the facade is a client island). The shop's other places (ADR-007 §3): `links` — plain anchors that open in a
// new tab, `nofollow`, no referrer, nothing loaded from the platform; `facade` — the latest reel behind a button. Third
// parties load on a click, never before (Law 25).
import { EMBED_PLATFORMS,EmbedFacade, type EmbedPlatform } from "@krizaka/ui/embed-facade";
import * as React from "react";

import { ShopSection } from "../frame";

export type SocialVariant = "links" | "facade";

export type ShopLink = { id: string; platform: EmbedPlatform; url: string };

export type SocialSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "links" */
  variant?: SocialVariant;
  title: React.ReactNode;
  links: readonly ShopLink[];
  /** `links`: the name of each place, passed translated (`TikTok`). Default: the platform's own. */
  labels?: Partial<Record<EmbedPlatform, string>>;
  /** `facade`: the button's words per platform, and the reel's name. */
  playLabels?: Record<EmbedPlatform, string>;
  reelTitle?: string;
  poster?: string;
  notice?: React.ReactNode;
};

/** Where else to find the shop. */
export function SocialSection({ variant = "links", title, links, labels = {}, playLabels, reelTitle, poster, notice, className, ...props }: SocialSectionProps) {
  if (links.length === 0) return null;
  const first = links[0]!;
  return (
    <ShopSection title={title} className={className} data-variant={variant} {...props}>
      {variant === "facade" && playLabels ? (
        <div className="w-44 sm:w-52">
          <EmbedFacade platform={first.platform} url={first.url} title={reelTitle ?? labels[first.platform] ?? EMBED_PLATFORMS[first.platform]} playLabel={playLabels[first.platform]} poster={poster} notice={notice} />
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                referrerPolicy="no-referrer"
                className="inline-flex min-h-11 items-center rounded-md border border-border-control bg-surface-1 px-4 text-sm font-semibold text-fg no-underline hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {labels[l.platform] ?? EMBED_PLATFORMS[l.platform]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </ShopSection>
  );
}
