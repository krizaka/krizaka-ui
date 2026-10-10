import { Badge } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeBadgeTones() {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Badge tone="neutral">Live</Badge>
      <Badge tone="accent">Live</Badge>
      <Badge tone="success">Live</Badge>
      <Badge tone="warning">Live</Badge>
      <Badge tone="danger">Live</Badge>
    </View>
  );
}
