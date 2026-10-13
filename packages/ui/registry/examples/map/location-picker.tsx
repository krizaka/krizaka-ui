"use client";

import { type LngLat, LocationPicker, StaticMap } from "@krizaka/ui/map";
import * as React from "react";

// A meeting point picked by moving the map under the pin: its distance from the person, a 1-km zone, "Near me" on request.
export default function MapLocationPicker() {
  const [point, setPoint] = React.useState<LngLat>([-73.5673, 45.5017]);
  return (
    <div className="w-full max-w-xl">
      <LocationPicker
        label="Meeting point"
        locale="en-CA"
        value={point}
        onValueChange={setPoint}
        origin={[-73.5794, 45.5048]}
        radius={1000}
        fallback={<StaticMap label="Meeting point" center={point} zoom={14} places={[{ position: point, label: "Meeting point" }]} />}
      />
    </div>
  );
}
