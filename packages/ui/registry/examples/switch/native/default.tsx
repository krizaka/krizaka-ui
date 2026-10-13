import { Switch } from "@krizaka/ui/native";
import { View } from "react-native";

// The switch alone, named by `label`: md and sm, on and off.
export default function NativeSwitchDefault() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Sounds" />
      <Switch label="Compact" size="sm" defaultChecked />
    </View>
  );
}
