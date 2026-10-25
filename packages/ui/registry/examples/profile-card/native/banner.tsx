import { Avatar, Badge, Button, ProfileBanner } from "@krizaka/ui/native";
import { View } from "react-native";

// A client's screen on a phone: the brand's cover, the avatar over its edge, the name, its facts, the actions.
export default function NativeProfileCardBanner() {
  return (
    <View style={{ width: 340 }}>
      <ProfileBanner
        avatar={<Avatar defaultAvatar={{ brand: "akinaza", seed: "eric" }} fallback="E" size="xl" />}
        eyebrow="Client"
        title="Eric Tremblay"
        status={<Badge tone="success">Regular</Badge>}
        meta="Client since 2024 · 14 visits"
        actions={<Button variant="primary" size="sm" label="Book" />}
      />
    </View>
  );
}
