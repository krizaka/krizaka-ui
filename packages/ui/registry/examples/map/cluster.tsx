"use client";

import { Cluster, Map, StaticMap } from "@krizaka/ui/map";

// 60 creators around Montréal, grouped while they are close; a group opens by zooming in.
const CREATORS = Array.from({ length: 60 }, (_, i) => ({
  id: String(i),
  label: `Creator ${i + 1}`,
  position: [-73.62 + ((i * 37) % 60) / 600, 45.48 + ((i * 53) % 70) / 700] as const,
}));

export default function MapCluster() {
  return (
    <Map label="Creators near Montréal" center={[-73.58, 45.53]} zoom={11} className="h-80 w-full max-w-xl" fallback={<StaticMap label="Creators near Montréal" center={[-73.58, 45.53]} zoom={11} />}>
      <Cluster points={CREATORS} />
    </Map>
  );
}
