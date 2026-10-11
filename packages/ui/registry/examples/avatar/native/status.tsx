import { Avatar, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// `status` (online · away) and `ring` (someone live): decorative — the words stay next to the avatar.
export default function NativeAvatarStatus() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar alt="Elena Ben Ali" status="online" />
        <Txt>Elena · online</Txt>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar alt="Alex Martin" status="away" />
        <Txt>Alex · away</Txt>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar alt="Elena Ben Ali" size="lg" ring status="online" />
        <Txt>Elena · live now</Txt>
      </View>
    </View>
  );
}
