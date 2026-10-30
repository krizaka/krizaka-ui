"use client";

import { Button } from "@krizaka/ui/button";
import { MapInfoCard, MapSheet, type MapSheetSnap, RouteCard, StaticMap } from "@krizaka/ui/map";
import * as React from "react";

const SHOP = [-73.5673, 45.5017] as const;
const ME = [-73.58, 45.51] as const;

// A place on the map: the sheet rises over it WITHOUT blocking it (no scrim, no trap) — three snap points on a phone, a
// card at the side from md. The info card says what the place is (one action); the route card opens the person's own
// navigation app. The times are given by the host from a real source — here, demo values.
export default function MapPlaceSheet() {
  const [snap, setSnap] = React.useState<MapSheetSnap>("half");
  return (
    <div className="relative h-[34rem] w-full max-w-3xl overflow-hidden rounded-xl border border-border-subtle">
      <StaticMap label="Atelier Rose, Montréal" center={[-73.575, 45.505]} zoom={13} places={[{ position: SHOP, label: "Atelier Rose" }]} />
      <MapSheet label="Atelier Rose" handleLabel="Resize the panel" snap={snap} onSnapChange={setSnap}>
        <div className="flex flex-col gap-5">
          <MapInfoCard title="Atelier Rose" meta="Hair salon · 1.4 km" status="Open until 18:00" action={<Button size="sm">See the shop</Button>} />
          <RouteCard
            destination="Directions to Atelier Rose"
            position={SHOP}
            origin={ME}
            directionsLabel="Open in"
            appLabels={{ apple: "Apple Maps", google: "Google Maps", osm: "OpenStreetMap", waze: "Waze", transit: "Transit" }}
            times={[{ label: "On foot", value: "18 min" }, { label: "By bike", value: "7 min" }]}
          />
        </div>
      </MapSheet>
    </div>
  );
}
