"use client";

import { Cluster, Map, MapPin, Marker, StaticMap } from "@krizaka/ui/map";

const SHOPS = Array.from({ length: 40 }, (_, i) => ({
  id: String(i),
  label: `Shop ${i + 1}`,
  position: [-73.62 + ((i * 37) % 60) / 600, 45.48 + ((i * 53) % 70) / 700] as const,
}));

// The Cahier's map: paper and ink in light, chalk on the slate in dark (`scheme="auto"` follows the page); the main roads
// are the margin's red, a group of shops is a manila tag, a lone one is the margin's red; the chosen shop wears a tag pin.
export default function MapNotebook() {
  return (
    <Map
      label="Shops near Montréal"
      center={[-73.58, 45.53]}
      zoom={11}
      scheme="auto"
      variant="notebook"
      className="h-96 w-full max-w-2xl"
      fallback={<StaticMap label="Shops near Montréal" center={[-73.58, 45.53]} zoom={11} />}
    >
      <Cluster points={SHOPS} />
      <Marker position={[-73.575, 45.52]} label="Atelier Rose, chosen" selected onPress={() => undefined}>
        <MapPin shape="tag" state="selected" />
      </Marker>
    </Map>
  );
}
