import { Combobox } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

const TOPICS = ["Music", "Sport", "Art", "Cooking", "Gaming", "Travel"].map((t) => ({ value: t.toLowerCase(), label: t }));

// Several values: checkboxes in the sheet, Done closes it; the field lists the choices.
export default function NativeComboboxMultiple() {
  const [topics, setTopics] = React.useState<string[]>(["music", "travel"]);
  return (
    <View style={{ width: 300 }}>
      <Combobox label="Interests" multiple options={TOPICS} value={topics} onValueChange={(v) => setTopics(Array.isArray(v) ? v : [v])} />
    </View>
  );
}
