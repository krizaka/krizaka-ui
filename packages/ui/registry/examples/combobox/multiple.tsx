"use client";

import { Combobox } from "@krizaka/ui/combobox";

const PEOPLE = [
  { value: "eric", label: "Eric" },
  { value: "ines", label: "Inès" },
  { value: "jonas", label: "Jonas" },
  { value: "mia", label: "Mia" },
  { value: "noah", label: "Noah" },
];

// Several values as chips; Backspace in the empty input removes the last one.
export default function ComboboxMultiple() {
  return (
    <Combobox
      multiple
      label="Collaborators"
      placeholder="Add a collaborator"
      options={PEOPLE}
      defaultValue={[PEOPLE[0]!, PEOPLE[1]!]}
      maxSelected={3}
      hint="Up to three collaborators share the revenue of this video."
    />
  );
}
