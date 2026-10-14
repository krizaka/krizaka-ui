import { Avatar } from "@krizaka/ui/native";
import { View } from "react-native";

const CAMILLE = "https://krizaka-assets.b-cdn.net/site/people/ui/camille-256.dc2943029a.webp";
const TOMAS = "https://krizaka-assets.b-cdn.net/site/people/ui/tomas-256.7eaab80903.webp";
const NOOR = "https://krizaka-assets.b-cdn.net/site/people/ui/noor-256.c340c41421.webp";

// Presence in Messages, story rings in the rail: the dot and the ring are said with the name.
export default function NativeAvatarPresence() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Avatar src={CAMILLE} alt="Camille" size="lg" presence="online" presenceLabel="online" />
      <Avatar src={TOMAS} alt="Tomás" size="lg" presence="away" presenceLabel="away" />
      <Avatar src={NOOR} alt="Noor" size="lg" presence="offline" presenceLabel="offline" />
      <Avatar src={CAMILLE} alt="Camille's story, new" size="lg" ring="story" />
      <Avatar src={TOMAS} alt="Tomás's story, seen" size="lg" ring="seen" />
    </View>
  );
}
