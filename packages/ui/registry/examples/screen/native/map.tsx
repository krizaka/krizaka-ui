import { Button, Header, Screen, Sheet, Txt } from "@krizaka/ui/native";
import { Map, Marker } from "@krizaka/ui/native/map";
import { useState } from "react";
import { View } from "react-native";

const SPOTS = [
  { id: "olimpico", label: "Café Olimpico", where: "Mile End · 450 m", position: [-73.6005, 45.5229] as const },
  { id: "parc", label: "Parc La Fontaine", where: "Plateau · 2 km", position: [-73.5695, 45.5268] as const },
  { id: "talon", label: "Marché Jean-Talon", where: "Little Italy · 1.2 km", position: [-73.6147, 45.5363] as const },
];

// A map-centric screen: the map fills the screen under a header, a marker pressed opens its place in a bottom sheet
// with the one action; every marker is also a named button, so the places are read as a list.
export default function NativeScreenMap() {
  const [open, setOpen] = useState<(typeof SPOTS)[number] | null>(null);
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header title="Pick-up points" subtitle="Near Mile End" />} scroll={false} padding={0}>
        <Map label="Pick-up points in Montréal" center={[-73.59, 45.527]} zoom={12.5} style={{ flex: 1 }}>
          {SPOTS.map((s) => (
            <Marker key={s.id} position={s.position} label={s.label} selected={open?.id === s.id} onPress={() => setOpen(s)} />
          ))}
        </Map>
      </Screen>
      <Sheet open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)} title={open?.label}>
        <Txt tone="secondary">{open?.where}</Txt>
        <Button label="Pick up here" variant="primary" onPress={() => setOpen(null)} />
      </Sheet>
    </View>
  );
}
