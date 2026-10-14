"use client";

import { Map, Marker, StaticMap } from "@krizaka/ui/map";
import { SplitView } from "@krizaka/ui/split-view";
import * as React from "react";

const SPOTS = [
  { id: "olimpico", label: "Café Olimpico", where: "Mile End · 450 m", position: [-73.6005, 45.5229] as const },
  { id: "jean-talon", label: "Marché Jean-Talon", where: "Little Italy · 1.2 km", position: [-73.6147, 45.5363] as const },
  { id: "parc", label: "Parc La Fontaine", where: "Plateau · 2 km", position: [-73.5695, 45.5268] as const },
];

// TEMPLATE — find a place near you: the map is the page, the list beside it says the same in words (a screen reader reads
// the list); choosing in one moves the other. On a phone the list replaces the map with the way back.
export default function SplitViewNearby() {
  const [chosen, setChosen] = React.useState("olimpico");
  return (
    <SplitView
      className="w-full"
      listTitle="Pick-up points"
      showDetail
      back={<a href="#list" className="text-sm font-medium text-fg-secondary">← Pick-up points</a>}
      list={
        <ul>
          {SPOTS.map((s) => (
            <li key={s.id}>
              <button type="button" aria-pressed={s.id === chosen} onClick={() => setChosen(s.id)} className="flex w-full flex-col items-start gap-0.5 border-b border-border-subtle px-4 py-3 text-left text-sm hover:bg-surface-2 aria-pressed:bg-accent-soft">
                <span className="font-semibold text-fg">{s.label}</span>
                <span className="text-fg-secondary">{s.where}</span>
              </button>
            </li>
          ))}
        </ul>
      }
      detailHead={<span className="text-sm font-bold text-fg">Map</span>}
      detail={
        <Map label="Pick-up points in Montréal" center={[-73.592, 45.528]} zoom={12.5} className="h-96 w-full" fallback={<StaticMap label="Pick-up points in Montréal" center={[-73.592, 45.528]} zoom={12.5} places={SPOTS} />}>
          {SPOTS.map((s) => (
            <Marker key={s.id} position={s.position} label={s.label} selected={s.id === chosen} onPress={() => setChosen(s.id)} />
          ))}
        </Map>
      }
    />
  );
}
