import { Separator, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeSeparatorRows() {
  return (
    <View style={{ width: 300, gap: 12 }}>
      <Txt>Downloads</Txt>
      <Separator />
      <Txt>Notifications</Txt>
      <Separator />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 20 }}>
        <Txt variant="caption" tone="secondary">12 videos</Txt>
        <Separator orientation="vertical" />
        <Txt variant="caption" tone="secondary">3 h 20 min</Txt>
      </View>
    </View>
  );
}
