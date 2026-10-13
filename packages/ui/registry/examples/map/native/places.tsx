import { Button, Sheet, Txt } from "@krizaka/ui/native";
import { Map, Marker } from "@krizaka/ui/native/map";
import * as React from "react";
import { View } from "react-native";

const SPOTS = [
  { id: "olimpico", label: "Café Olimpico", address: "124 Rue Saint-Viateur O", position: [-73.6005, 45.5229] as const },
  { id: "parc", label: "Parc La Fontaine", address: "3933 Av. du Parc-La Fontaine", position: [-73.5695, 45.5268] as const },
];

// Pick-up points: a marker pressed opens its details in a bottom sheet.
export default function NativeMapPlaces() {
  const [open, setOpen] = React.useState<(typeof SPOTS)[number] | null>(null);
  return (
    <View style={{ width: 340 }}>
      <Map label="Pick-up points in Montréal" center={[-73.585, 45.524]} zoom={12.5}>
        {SPOTS.map((s) => (
          <Marker key={s.id} position={s.position} label={s.label} selected={open?.id === s.id} onPress={() => setOpen(s)} />
        ))}
      </Map>
      <Sheet open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)} title={open?.label}>
        <Txt tone="secondary">{open?.address}</Txt>
        <Button label="Choose this point" variant="primary" onPress={() => setOpen(null)} />
      </Sheet>
    </View>
  );
}
