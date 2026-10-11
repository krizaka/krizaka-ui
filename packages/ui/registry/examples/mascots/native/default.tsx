import { Mascot, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// The owl welcoming, the falcon done, the duck with nothing yet — in the app's brand colours.
export default function NativeMascotDefault() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="owl" mood="welcome" size={80} />
        <Txt variant="caption">welcome</Txt>
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="falcon" mood="success" size={80} />
        <Txt variant="caption">success</Txt>
      </View>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Mascot bird="duck" mood="empty" size={80} />
        <Txt variant="caption">empty</Txt>
      </View>
    </View>
  );
}
