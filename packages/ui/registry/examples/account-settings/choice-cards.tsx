import { ChoiceCards } from "@krizaka/ui/account-settings";
import * as React from "react";

// One question, two selectable cards: an icon, a title and a line each, instead of two radios under a heading.
export default function ChoiceCardsExample() {
  const [value, setValue] = React.useState("tenant");
  return (
    <div className="w-full max-w-xl">
      <ChoiceCards
        label="De quel côté du bail êtes-vous ?"
        value={value}
        onValueChange={setValue}
        options={[
          { id: "tenant", title: "Locataire", description: "Je loue mon logement : je veux savoir ce que je signe." },
          { id: "landlord", title: "Propriétaire", description: "Je loue à quelqu'un : je veux un bail en ordre." },
        ]}
      />
    </div>
  );
}
