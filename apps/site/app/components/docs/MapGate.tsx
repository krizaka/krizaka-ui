"use client";

import { MAP_TILES } from "@krizaka/ui/map";
import { type ReactNode, useEffect, useState } from "react";

import type { MapSnapshot } from "@/lib/map-gate";

/* A map example, never an empty grid: its photograph (dark and light, following the page theme) first — static, painted
   at once — then the live map once the tiles answer cross-origin. One small request (the first byte of the world
   extract), once per page. */
let tilesReadable: Promise<boolean> | null = null;
function canReadTiles(): Promise<boolean> {
  tilesReadable ??= fetch(MAP_TILES.world, { headers: { Range: "bytes=0-0" } })
    .then((r) => r.ok)
    .catch(() => false);
  return tilesReadable;
}

export function MapGate({ snapshot, alt, children }: { snapshot: MapSnapshot; alt: string; children: ReactNode }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    let alive = true;
    void canReadTiles().then((ok) => alive && setLive(ok));
    return () => {
      alive = false;
    };
  }, []);
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
