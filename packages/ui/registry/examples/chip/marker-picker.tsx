"use client";

import { type Marker, MarkerPicker, TagChip } from "@krizaka/ui/chip";
import * as React from "react";

const NAMES: Record<Marker, string> = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

// Recolour a tag from the closed palette of six: `showNames` writes each colour beside its swatch, the chosen one is ticked.
export default function ChipMarkerPicker() {
  const [marker, setMarker] = React.useState<Marker>("violet");
  return (
    <div className="flex flex-col items-start gap-3">
      <TagChip marker={marker}>Gift cards</TagChip>
      <MarkerPicker label="Colour of the tag Gift cards" names={NAMES} showNames value={marker} onValueChange={setMarker} />
    </div>
  );
}
