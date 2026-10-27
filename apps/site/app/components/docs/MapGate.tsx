"use client";

import { MAP_TILES } from "@krizaka/ui/map";
import { type ReactNode, useSyncExternalStore } from "react";

import type { MapSnapshot } from "@/lib/map-gate";

/* A map example, never an empty grid: its photograph (dark and light, following the page theme) first — static, painted
   at once — then the live map once the tiles answer cross-origin. One small request (the first byte of the world
   extract), once per page. */
let tilesReadable: boolean | null = null;
let tilesAsked = false;
const watchers = new Set<() => void>();
function askTiles(): void {
  if (tilesAsked) return;
  tilesAsked = true;
  void fetch(MAP_TILES.world, { headers: { Range: "bytes=0-0" } })
    .then((r) => r.ok)
    .catch(() => false)
    .then((ok) => {
      tilesReadable = ok;
      for (const watcher of watchers) watcher();
    });
}
/* The answer is an external store (read by every gate of the page, asked once): no effect, nothing on the server. */
function watchTiles(watcher: () => void): () => void {
  watchers.add(watcher);
  askTiles();
  return () => watchers.delete(watcher);
}

export function MapGate({ snapshot, alt, children }: { snapshot: MapSnapshot; alt: string; children: ReactNode }) {
  const live = useSyncExternalStore(watchTiles, () => tilesReadable === true, () => false);
  if (live) return <>{children}</>;
  return (
    <span className="kz-map-snapshot" role="img" aria-label={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a CDN photograph, static export: no image server */}
      <img src={snapshot.dark} alt="" className="kz-shot kz-shot-dark" loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element -- the same, light theme */}
      <img src={snapshot.light} alt="" className="kz-shot kz-shot-light" loading="lazy" decoding="async" />
    </span>
  );
}
