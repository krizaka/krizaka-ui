"use client";

import { type Marker } from "@krizaka/ui/chip";
import { type TagOption,TagSelector } from "@krizaka/ui/tag-selector";
import { useState } from "react";

const NAMES: Record<Marker, string> = { blue: "Blue", green: "Green", amber: "Amber", red: "Red", violet: "Violet", gray: "Gray" };

// A workshop's client tags: type to narrow, Enter takes the tag of that name or creates a new one in the colour chosen.
export default function TagSelectorCreatable() {
  const [options, setOptions] = useState<TagOption[]>([
    { value: "regular", label: "Regular", marker: "blue" },
    { value: "to-follow", label: "To follow up", marker: "amber" },
    { value: "late", label: "Late payer", marker: "red" },
  ]);
  const [chosen, setChosen] = useState<string[]>(["regular"]);
  return (
    <TagSelector
      className="max-w-lg" label="Tags of Eric" options={options} value={chosen} onValueChange={setChosen}
      creatable inputLabel="Add a tag" placeholder="Add a tag…" markerNames={NAMES} markerLabel="Colour of the new tag"
      createLabel={(name) => `Create “${name}”`} max={6} countLabel={(n, max) => `${n} of ${max} tags`}
      onCreate={(name, marker) => {
        const value = name.toLowerCase().replace(/\s+/g, "-");
        setOptions((all) => [...all, { value, label: name, marker }]);
        setChosen((all) => [...all, value]);
      }}
    />
  );
}
