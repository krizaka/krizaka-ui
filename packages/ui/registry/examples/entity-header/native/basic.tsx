import { EntityHeader } from "@krizaka/ui/native";
import * as React from "react";

// Tap the name to rename it; the same refusal codes as the web, said in the page's words.
export default function NativeEntityHeaderBasic() {
  const [name, setName] = React.useState("Weddings");
  const rename = async (next: string) => {
    if (next === "Archive") throw Object.assign(new Error("taken"), { code: "NAME_TAKEN" });
    setName(next);
  };
  return <EntityHeader name={name} nameLabel="Rename" onNameChange={rename} description="Ceremonies and receptions." refusals={{ NAME_TAKEN: "This name is taken." }} />;
}
