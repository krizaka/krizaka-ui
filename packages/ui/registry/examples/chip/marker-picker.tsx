"use client";

import { type Marker, MarkerPicker, TagChip } from "@krizaka/ui/chip";
import * as React from "react";

const NAMES: Record<Marker, string> = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

// Recolour a tag from the closed palette of six: a swatch is named and ticked, the colour is never alone.
export default function ChipMarkerPicker() {
  const [marker, setMarker] = React.useState<Marker>("violet");
  return (
    <div className="flex flex-col items-start gap-3">
      <TagChip marker={marker}>Gift cards</TagChip>
      <MarkerPicker label="Colour of the tag Gift cards" names={NAMES} value={marker} onValueChange={setMarker} />
    </div>
  );
}
