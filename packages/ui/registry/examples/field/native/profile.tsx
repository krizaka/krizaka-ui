import { Field, Input, Textarea, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A profile form: each control named by its field, the error said under it.
export default function NativeFieldProfile() {
  const [handle, setHandle] = useState("elena music");
  const invalid = /\s/.test(handle);
  return (
    <View style={{ width: 320, gap: 16 }}>
      <Field label="Display name" required>
        <Input defaultValue="Elena Ruiz" autoComplete="name" />
      </Field>
      <Field label="Handle" error={invalid ? "No spaces: letters, digits, dots and underscores." : undefined}>
        <Input value={handle} onChangeText={setHandle} autoCapitalize="none" leading={<Txt tone="secondary">@</Txt>} />
      </Field>
      <Field label="Bio" hint="Shown on your page · 160 characters">
        <Textarea rows={3} maxLength={160} defaultValue="Covers, live sessions and the odd dare." />
      </Field>
    </View>
  );
}
