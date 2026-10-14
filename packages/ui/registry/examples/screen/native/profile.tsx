import { Avatar, Button, Chip, Screen, Txt, VerifiedBadge } from "@krizaka/ui/native";
import { View } from "react-native";

// A profile: the photo with its story ring, the name and seal, the facts, the interests, the actions.
export default function NativeScreenProfile() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen footer={<View style={{ flexDirection: "row", gap: 8, padding: 16 }}><Button label="Edit profile" style={{ flex: 1 }} /><Button label="Preview" variant="outline" style={{ flex: 1 }} /></View>}>
        <View style={{ alignItems: "center", gap: 6 }}>
          <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/camille-512.9573eaa0b8.webp" alt="Camille" size={112} ring="story" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Txt variant="title">Camille, 29</Txt>
            <VerifiedBadge label="Verified" size={18} />
          </View>
          <Txt tone="secondary">Lisbon · Sound engineer</Txt>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 32 }}>
          <Txt variant="label">128 likes</Txt>
          <Txt variant="label">14 matches</Txt>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["Music", "Surf", "Travel", "Vinyl"].map((t) => <Chip key={t}>{t}</Chip>)}
        </View>
      </Screen>
    </View>
  );
}
