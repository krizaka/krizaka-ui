import { LanguagePicker } from "@krizaka/ui/account-settings";
import * as React from "react";

// The account's language, labelled, each language in its own language.
export default function LanguagePickerExample() {
  const [value, setValue] = React.useState("fr");
  return (
    <div className="w-full max-w-sm">
      <LanguagePicker
        label="Langue"
        description="La langue de l'application et des courriels."
        value={value}
        onValueChange={setValue}
        languages={[
          { code: "fr", name: "Français" },
          { code: "en", name: "English" },
        ]}
      />
    </div>
  );
}
