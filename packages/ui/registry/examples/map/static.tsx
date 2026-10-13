import { StaticMap } from "@krizaka/ui/map";

// A still map without an engine: the places projected on the map's paper — a card, a list item, the fallback of a Map.
export default function MapStatic() {
  return (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-2xl border border-border-default">
      <StaticMap
        label="Your two pick-up points"
        center={[-73.585, 45.524]}
        zoom={13}
        places={[
          { position: [-73.6005, 45.5229], label: "Café Olimpico" },
          { position: [-73.5695, 45.5268], label: "Parc La Fontaine" },
        ]}
      />
    </div>
  );
}
