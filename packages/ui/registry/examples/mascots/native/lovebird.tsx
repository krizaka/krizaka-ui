import { Mascot, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// The lovebird introduces two people: welcoming, then celebrating a mutual interest.
export default function NativeMascotLovebird() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="lovebird" mood="welcome" size={80} />
        <Txt variant="caption">welcome</Txt>
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="lovebird" mood="success" size={80} />
        <Txt variant="caption">mutual</Txt>
      </View>
    </View>
  );
}
