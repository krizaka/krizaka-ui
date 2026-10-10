import { Chip } from "@krizaka/ui/native";
import { View } from "react-native";

// Alone, a chip is a checkbox: `selected` / `onSelectedChange`, or `defaultSelected`.
export default function NativeChipToggle() {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <Chip>Night</Chip>
      <Chip defaultSelected>Live</Chip>
      <Chip size="sm" defaultSelected>
        Small
      </Chip>
      <Chip disabled>Disabled</Chip>
    </View>
  );
}
