"use client";

import { Map, Marker, StaticMap } from "@krizaka/ui/map";

const SPOTS = [
  { id: "olimpico", label: "Café Olimpico, Mile End", position: [-73.6005, 45.5229] as const },
  { id: "parc", label: "Parc La Fontaine", position: [-73.5695, 45.5268] as const },
];

// A map that IS the screen (an explorer, full height): `gestures="map"` gives it the wheel and one finger. In a page, leave the
// default (`page`): the wheel scrolls the page past the map, and Ctrl/⌘ + wheel or two fingers zoom it.
export default function MapFullScreen() {
  return (
    <Map
      label="Explore the neighbourhood"
      gestures="map"
      center={[-73.59, 45.525]}
      zoom={12.5}
      className="h-96 w-full max-w-xl"
      fallback={<StaticMap label="Explore the neighbourhood" center={[-73.59, 45.525]} zoom={12.5} places={SPOTS} />}
    >
      {SPOTS.map((s) => (
        <Marker key={s.id} position={s.position} label={s.label} />
      ))}
    </Map>
  );
}
