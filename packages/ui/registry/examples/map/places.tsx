"use client";

import { Map, Marker, StaticMap } from "@krizaka/ui/map";
import * as React from "react";

const SPOTS = [
  { id: "olimpico", label: "Café Olimpico, Mile End", position: [-73.6005, 45.5229] as const },
  { id: "jean-talon", label: "Marché Jean-Talon", position: [-73.6147, 45.5363] as const },
  { id: "parc", label: "Parc La Fontaine", position: [-73.5695, 45.5268] as const },
];

// Pick-up points in Montréal: markers are buttons, the chosen one shows its name; the places are a list for screen readers.
export default function MapPlaces() {
  const [chosen, setChosen] = React.useState("olimpico");
  return (
    <Map
      label="Pick-up points in Montréal"
      center={[-73.592, 45.528]}
      zoom={12.5}
      className="h-80 w-full max-w-xl"
      fallback={<StaticMap label="Pick-up points in Montréal" center={[-73.592, 45.528]} zoom={12.5} places={SPOTS} />}
    >
      {SPOTS.map((s) => (
        <Marker key={s.id} position={s.position} label={s.label} selected={s.id === chosen} onPress={() => setChosen(s.id)} />
      ))}
    </Map>
  );
}
