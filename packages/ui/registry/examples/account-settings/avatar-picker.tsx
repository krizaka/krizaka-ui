import { AvatarPicker } from "@krizaka/ui/account-settings";
import { Button } from "@krizaka/ui/button";
import * as React from "react";

const OPTIONS = [1, 2, 3, 4, 5, 6].map((tone) => ({ id: `tone-${tone}`, label: `Teinte ${tone}`, defaultAvatar: { brand: "yomizaka", tone } as const }));

// The family's default pictures as one radio group, and the upload beside them: no loose radios.
export default function AvatarPickerExample() {
  const [value, setValue] = React.useState("tone-2");
  return (
    <div className="w-full max-w-md">
      <AvatarPicker label="Photo de profil" options={OPTIONS} value={value} onValueChange={setValue} upload={<Button variant="secondary" size="sm">Téléverser</Button>} />
    </div>
  );
}
