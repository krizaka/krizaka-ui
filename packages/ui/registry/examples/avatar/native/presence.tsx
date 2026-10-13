import { Avatar } from "@krizaka/ui/native";
import { View } from "react-native";

// Presence in Messages, story rings in the rail: the dot and the ring are said with the name.
export default function NativeAvatarPresence() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Avatar alt="Elena" size="lg" presence="online" presenceLabel="online" />
      <Avatar alt="Alex" size="lg" presence="away" presenceLabel="away" />
      <Avatar alt="Mina" size="lg" presence="offline" presenceLabel="offline" />
      <Avatar alt="Elena's story, new" size="lg" ring="story" />
      <Avatar alt="Alex's story, seen" size="lg" ring="seen" />
    </View>
  );
}
