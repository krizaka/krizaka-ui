import { type Marker, MarkerPicker, TagChip } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const NAMES: Record<Marker, string> = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

// Recolour a tag from the closed palette of six.
export default function NativeChipMarkerPicker() {
  const [marker, setMarker] = useState<Marker>("violet");
  return (
    <View style={{ gap: 12, alignItems: "flex-start" }}>
      <TagChip marker={marker}>Gift cards</TagChip>
      <MarkerPicker label="Colour of the tag Gift cards" names={NAMES} value={marker} onValueChange={setMarker} />
    </View>
  );
}
