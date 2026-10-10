import { Avatar } from "@krizaka/ui/native";
import { View } from "react-native";

// Without an image: the initial of `alt`.
export default function NativeAvatarSizes() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Avatar alt="Maya" size="xs" />
      <Avatar alt="Maya" size="sm" />
      <Avatar alt="Maya" size="md" />
      <Avatar alt="Maya" size="lg" />
      <Avatar alt="Maya" size="xl" />
    </View>
  );
}
