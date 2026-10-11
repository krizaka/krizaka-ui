import { Field, Select } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
] as const;

// A choice in a sheet of options: the target language of a dubbing job.
export default function NativeFieldSelect() {
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["value"] | null>("fr");
  return (
    <View style={{ width: 320 }}>
      <Field label="Dub into" hint="The voices keep the speaker's timbre">
        <Select options={LANGUAGES} value={language} onValueChange={setLanguage} placeholder="Choose a language" />
      </Field>
    </View>
  );
}
