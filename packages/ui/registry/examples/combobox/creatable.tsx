"use client";

import { Combobox, type ComboboxOption } from "@krizaka/ui/combobox";
import * as React from "react";

// Pick a playlist, or type a new name and create it.
export default function ComboboxCreatable() {
  const [playlists, setPlaylists] = React.useState<ComboboxOption[]>([
    { value: "p1", label: "Travel diaries" },
    { value: "p2", label: "Studio sessions" },
  ]);
  const [value, setValue] = React.useState<ComboboxOption | null>(playlists[1]!);
  return (
    <Combobox
      label="Playlist"
      options={playlists}
      value={value}
      onValueChange={setValue}
      creatable
      onCreate={(name) => {
        const created = { value: `p${playlists.length + 1}`, label: name };
        setPlaylists((all) => [...all, created]);
        return created;
      }}
      labels={{ create: (name) => `Create the playlist “${name}”` }}
    />
  );
}
