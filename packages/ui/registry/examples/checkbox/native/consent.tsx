import { Button, Checkbox } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// Choices confirmed by a button: the whole row is pressable.
export default function NativeCheckboxConsent() {
  const [terms, setTerms] = useState(false);
  return (
    <View style={{ width: 320, gap: 4 }}>
      <Checkbox label="I accept the terms of the auction" checked={terms} onCheckedChange={setTerms} />
      <Checkbox label="Email me when it ends" description="One message, no newsletter" defaultChecked />
      <Button label="Place the bid" variant="primary" disabled={!terms} />
    </View>
  );
}
