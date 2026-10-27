// Server-safe (the wall and the grid are client islands imported through their own entries). The photos of a shop
// (ADR-007 §3): `mosaic` (one 4:5 lead and four squares), `filmstrip` (3:4, a snap strip), `wall` (polaroids, notes and the
// sign on a textured wall) and `grid` (today's media gallery). A photo appears once: the product's resolver hands each id at
// most once, and a section that runs out shows fewer tiles — never a repeat.
import { MediaGallery } from "@krizaka/ui/media-gallery";
import { Wall, type WallItem } from "@krizaka/ui/wall";
import * as React from "react";

import { cn } from "../../cn";
import type { ShopPhoto } from "../frame";
import { ShopSection } from "../frame";
import { SHOP_LIMITS } from "../limits";
import { Photo } from "../photo";

export type GalleryVariant = "mosaic" | "filmstrip" | "wall" | "grid";

export type ShopGalleryPhoto = {
  id: string;
  photo: ShopPhoto;
  caption?: string;
  /** `grid`: a muted loop over the still. */
  video?: { webm?: string; mp4?: string };
};

export type ShopGalleryNote = { id: string; text: string; signature?: string };

export type GallerySectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "mosaic" */
  variant?: GalleryVariant;
  /** The shop's own photos, in order, already unique. */
  photos: readonly ShopGalleryPhoto[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** The gallery's accessible name (`Photos of the salon`). */
  label: string;
  /** `wall`: short notes pinned between the photos. */
  notes?: readonly ShopGalleryNote[];
  /** `wall`: the shop's name on its sign. */
  sign?: string;
  /** `wall`: the wall's texture. @default "plaster" */
  texture?: "plaster" | "brick" | "ridge" | "zellige";
};

/** A deterministic scatter: the same photos always hang the same way (no random, so no hydration mismatch). */
export function wallLayout(count: number): { x: number; y: number; rotation: number }[] {
  const perRow = Math.min(5, Math.max(1, Math.ceil(count / 2)));
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const inRow = Math.min(perRow, count - row * perRow);
    const x = inRow === 1 ? 50 : (col / (inRow - 1)) * 100;
    const y = row === 0 ? (count <= perRow ? 50 : 8 + (col % 2) * 6) : 92 - (col % 2) * 6;
    return { x, y, rotation: [-2.2, 1.6, -1.2, 2.4, -1.8][(i * 3 + 1) % 5]! };
  });
}

function Mosaic({ photos }: { photos: readonly ShopGalleryPhoto[] }) {
  const [lead, ...rest] = photos;
  if (!lead) return null;
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-[1.6fr_1fr_1fr] sm:gap-3">
      <li className="col-span-2 aspect-[16/11] sm:col-span-1 sm:row-span-2 sm:aspect-auto">
        <Photo photo={lead.photo} ratio="4/5" sizes="(min-width: 40rem) 36rem, 100vw" className="h-full min-h-0 sm:aspect-auto" />
      </li>
      {rest.slice(0, 4).map((p) => (
        <li key={p.id}>
          <Photo photo={p.photo} ratio="1/1" sizes="(min-width: 40rem) 18rem, 50vw" />
        </li>
      ))}
    </ul>
  );
}

function Filmstrip({ photos, label }: { photos: readonly ShopGalleryPhoto[]; label: string }) {
  return (
    <div role="group" aria-label={label} tabIndex={0} className="-mx-4 overflow-x-auto px-4 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mx-0 sm:px-0">
      <ul className="m-0 flex w-max snap-x snap-mandatory list-none gap-3 p-0">
        {photos.map((p) => (
          <li key={p.id} className="w-[42vw] max-w-64 shrink-0 snap-start sm:w-64">
            <Photo photo={p.photo} ratio="3/4" sizes="(min-width: 40rem) 16rem, 42vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShopWall({ photos, notes, sign, texture, label }: { photos: readonly ShopGalleryPhoto[]; notes: readonly ShopGalleryNote[]; sign?: string; texture: NonNullable<GallerySectionProps["texture"]>; label: string }) {
  const pieces = [
    ...(sign ? [{ id: "sign", kind: "sign" as const, children: sign, variant: "neon" as const }] : []),
    ...photos.slice(0, SHOP_LIMITS.photos).map((p) => ({
      id: p.id,
      kind: "polaroid" as const,
      img: <img src={p.photo.src} srcSet={p.photo.srcSet} sizes="220px" alt={p.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />,
      caption: p.caption,
    })),
    ...notes.map((n) => ({ id: n.id, kind: "note" as const, text: n.text, signature: n.signature })),
  ];
  const layout = wallLayout(pieces.length);
  const items = pieces.map((piece, i) => ({ ...piece, ...layout[i]!, z: i })) as WallItem[];
  return <Wall aria-label={label} items={items} texture={texture} itemWidth={220} max={SHOP_LIMITS.photos + 2} />;
}

/** The photos of a shop: a mosaic, a filmstrip, a wall or a grid. */
export function GallerySection({ variant = "mosaic", photos, title, lead, label, notes = [], sign, texture = "plaster", className, ...props }: GallerySectionProps) {
  const shown = photos.slice(0, SHOP_LIMITS.photos);
  const bodies: Record<GalleryVariant, () => React.ReactNode> = {
    mosaic: () => <Mosaic photos={shown} />,
    filmstrip: () => <Filmstrip photos={shown} label={label} />,
    wall: () => <ShopWall photos={shown} notes={notes} sign={sign} texture={texture} label={label} />,
    grid: () => (
      <MediaGallery
        label={label}
        items={shown.map((p) => ({ id: p.id, src: p.photo.src, alt: p.photo.alt, caption: p.caption, video: p.video, shape: "wide" as const }))}
      />
    ),
  };
  const body = bodies[variant]();
  return (
    <ShopSection title={title} lead={lead} className={cn(className)} data-variant={variant} {...props}>
      {body}
    </ShopSection>
  );
}
