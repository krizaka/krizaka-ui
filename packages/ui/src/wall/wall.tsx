"use client";

import * as React from "react";

import { cn } from "../cn";
import { finite } from "./attachment";
import { PinnedNote, type PinnedNoteProps } from "./pinned-note";
import { Polaroid, type PolaroidProps } from "./polaroid";
import { ShopSign, type ShopSignProps } from "./shop-sign";

export interface WallPosition {
  /** Stable identity for this object. */
  id: string;
  /** Horizontal placement as a percentage (0–100); clamped to the wall. Unused by the tidy layout. */
  x?: number;
  /** Vertical placement as a percentage (0–100); clamped to the wall. Unused by the tidy layout. */
  y?: number;
  /** Tilt in degrees; defaults to zero. */
  rotation?: number;
  /** Stacking and reading order, ascending; ties preserve input order. */
  z: number;
}

/** The item's kind chooses its component; its remaining fields are that component's props. */
export type WallItem = WallPosition & (
  | ({ /** A framed photo. */ kind: "polaroid" } & PolaroidProps)
  | ({ /** A short pinned message. */ kind: "note" } & PinnedNoteProps)
  | ({ /** The owner's sign. */ kind: "sign" } & ShopSignProps)
);

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export interface WallProps extends Omit<React.ComponentProps<"ul">, "children" | "style" | "role"> {
  /** The read-only objects; never mutated. Sorted by z for reading, keyboard and phone order. */
  items: readonly WallItem[];
  /** CSS/SVG texture; no image download. Defaults to plaster. */
  texture?: "brick" | "zellige" | "ridge" | "plaster";
  /** Draws at most this many items (the first in z order); defaults to 12. The rest belongs to the host's « see the whole wall ». */
  max?: number;
  /** A fixed desktop surface height in pixels (minimum 320). Absent, the surface is a fixed 16:9 box. Phones grow with content. */
  height?: number;
  /** Desktop object width in pixels (minimum 120); defaults to 240 and never exceeds the surface. */
  itemWidth?: number;
  /**
   * `pinned` (default): objects placed at x / y on a fixed surface. `tidy`: the Cahier pinboard — a dense CSS grid (3 columns,
   * 2 on a phone, 1 on a very small one), a note may span two, each tilted 1–2° by its id (no random position), no JS layout.
   */
  layout?: "pinned" | "tidy";
}

/** A tilt of 1 to 2 degrees, either way, derived from the id: the same wall draws the same everywhere (server and client). */
export function tidyTilt(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  const n = (h >>> 0) % 4; // 0..3
  return [-2, -1, 1, 2][n]!;
}

/** The object of one item, straight: the wall places and tilts it. A sign on a wall is a paragraph, not a second h1. */
function WallObject({ item }: { readonly item: DistributiveOmit<WallItem, keyof WallPosition> }) {
  if (item.kind === "polaroid") return <Polaroid {...item} rotation={0} />;
  if (item.kind === "note") return <PinnedNote {...item} rotation={0} />;
  return <ShopSign {...item} as={item.as ?? "p"} rotation={0} />;
}

/** A decorative textured surface over a real keyboard-reachable list; never an editor. */
export function Wall({ items, texture = "plaster", max = 12, height, itemWidth = 240, layout = "pinned", className, ...props }: WallProps) {
  const patternId = React.useId().replace(/:/g, "");
  const drawn = Math.max(0, Math.floor(finite(max)));
  return (
    <ul {...props} role="list" className={cn("kz-wall", className)} data-texture={texture} data-layout={layout === "tidy" ? "tidy" : undefined} data-count={Math.min(items.length, drawn)} data-fixed-height={height === undefined ? undefined : ""} style={{ ...(height === undefined ? null : { "--kz-wall-height": `${Math.max(320, finite(height))}px` }), "--kz-wall-item-width": `${Math.max(120, finite(itemWidth))}px` } as React.CSSProperties}>
      {[...items].sort((a, b) => finite(a.z) - finite(b.z)).slice(0, drawn).map(({ id, x = 0, y = 0, rotation, z: _z, ...item }, rank) => (
        <li key={id} className="kz-wall-item" tabIndex={0} data-span={layout === "tidy" && item.kind === "note" ? "2" : undefined} style={{
          "--kz-wall-x": `${Math.min(100, Math.max(0, finite(x)))}%`,
          "--kz-wall-y": `${Math.min(100, Math.max(0, finite(y)))}%`,
          "--kz-wall-rotation": `${layout === "tidy" ? tidyTilt(id) : finite(rotation ?? 0)}deg`,
          zIndex: rank,
        } as React.CSSProperties}>
          <WallObject item={item} />
        </li>
      ))}
      {texture === "brick" && <li className="kz-wall-decoration" aria-hidden="true" role="presentation"><svg width="100%" height="100%" aria-hidden="true">
        <defs><pattern id={patternId} width="96" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 0H96M0 24H96M0 48H96M48 0V24M0 24V48M96 24V48" fill="none" stroke="var(--kz-border-default)" strokeWidth="2" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg></li>}
      {texture === "zellige" && <li className="kz-wall-decoration" aria-hidden="true" role="presentation"><svg width="100%" height="100%" aria-hidden="true">
        <defs><pattern id={patternId} width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M32 3 39 15 52 12 49 25 61 32 49 39 52 52 39 49 32 61 25 49 12 52 15 39 3 32 15 25 12 12 25 15Z" fill="var(--kz-accent-soft)" stroke="var(--kz-border-default)" />
          <path d="m32 18 14 14-14 14-14-14Z" fill="var(--kz-surface-2)" stroke="var(--kz-accent-2)" />
        </pattern></defs><rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg></li>}
      {texture === "ridge" && <li className="kz-wall-decoration" aria-hidden="true" role="presentation"><svg viewBox="0 0 1000 600" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
        <path d="M0 380 170 100 290 300 450 70 620 330 790 120 1000 350V600H0Z" fill="var(--kz-accent-soft)" />
        <path d="M0 470 200 280 370 440 600 190 760 400 920 260 1000 390V600H0Z" fill="var(--kz-surface-2)" />
        <path d="M0 540 180 430 360 520 540 390 760 520 900 410 1000 480V600H0Z" fill="var(--kz-surface-3)" />
      </svg></li>}
    </ul>
  );
}
