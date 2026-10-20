"use client";

import { Button } from "@krizaka/ui/button";
import { Map, Marker, Pulse, Route, StaticMap } from "@krizaka/ui/map";
import * as React from "react";

const STUDIO = [-73.6005, 45.5229] as const;
const HOME = [-73.5695, 45.5268] as const;
const PATH = [STUDIO, [-73.5935, 45.5232], [-73.5862, 45.5159], [-73.5753, 45.5171], HOME] as const;

// A delivery in Montréal: the pins drop (staggered), the route draws itself, a courier makes the trip, a demand pulse
// beats at the destination. Under reduced motion everything is in place at once, the courier at the end.
export default function MapRoute() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Map
        key={run}
        label="A delivery from the studio to Parc La Fontaine"
        center={[-73.585, 45.521]}
        zoom={13.2}
        className="h-80 w-full"
        fallback={<StaticMap label="A delivery from the studio to Parc La Fontaine" center={[-73.585, 45.521]} zoom={13.2} places={[{ position: STUDIO, label: "Studio" }, { position: HOME, label: "Parc La Fontaine" }]} />}
      >
        <Route path={PATH} label="Delivery from the studio to Parc La Fontaine, 3 km" courier tripDuration={3600} />
        <Marker position={STUDIO} label="Studio" drop={0} />
        <Marker position={HOME} label="Parc La Fontaine" drop={260} />
        <Pulse position={HOME} label="Orders are picking up around Parc La Fontaine" size={64} />
      </Map>
      <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
