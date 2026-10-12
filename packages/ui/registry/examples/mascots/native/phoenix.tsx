import { Phoenix, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// The comeback: the phoenix in its own colours, then in the app's accent.
export default function NativeMascotPhoenix() {
  return (
    <View style={{ flexDirection: "row", gap: 20, alignItems: "flex-end" }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Phoenix size={88} animated={false} />
        <Txt variant="caption">own</Txt>
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Phoenix size={88} tone="brand" animated={false} />
        <Txt variant="caption">brand</Txt>
      </View>
    </View>
  );
}
