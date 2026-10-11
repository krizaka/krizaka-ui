"use client";

import { Combobox, type ComboboxOption } from "@krizaka/ui/combobox";

const CREATORS: ComboboxOption[] = [
  { value: "u1", label: "Eric Tremblay", description: "@eric.films" },
  { value: "u2", label: "Erica Moreau", description: "@erica" },
  { value: "u3", label: "Inès Haddad", description: "@ines.draws" },
  { value: "u4", label: "Jonas Weber", description: "@jonas" },
];

// Your API in place of this one: it receives the query and an AbortSignal.
async function searchCreators(query: string, signal: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (signal.aborted) return [];
  const q = query.toLowerCase();
  return CREATORS.filter((c) => c.label.toLowerCase().includes(q) || c.description?.includes(q));
}

export default function ComboboxAsync() {
  return <Combobox label="Creator" placeholder="Type a name or a handle" onSearch={searchCreators} />;
}
