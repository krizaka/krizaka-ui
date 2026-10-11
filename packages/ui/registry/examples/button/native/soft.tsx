import { Button } from "@krizaka/ui/native";
import { View } from "react-native";

// `soft`: a tint of the accent — a second action that still carries the brand, next to a primary.
export default function NativeButtonSoft() {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Button variant="primary" label="Publish" onPress={() => {}} />
      <Button variant="soft" label="Schedule" onPress={() => {}} />
    </View>
  );
}
