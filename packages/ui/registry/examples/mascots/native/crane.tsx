import { Mascot, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// The crane listens: welcoming, then listening — posed, unhurried.
export default function NativeMascotCrane() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="crane" mood="welcome" size={80} />
        <Txt variant="caption">welcome</Txt>
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="crane" mood="thinking" size={80} />
        <Txt variant="caption">listening</Txt>
      </View>
    </View>
  );
}
