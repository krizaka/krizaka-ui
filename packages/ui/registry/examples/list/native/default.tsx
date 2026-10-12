import { Avatar, Txt } from "@krizaka/ui/native";
import { List } from "@krizaka/ui/native/list";
import { View } from "react-native";

type Notification = { id: string; who: string; what: string; when: string };
const notifications: Notification[] = [
  { id: "n1", who: "Elena Varga", what: "tipped your video “Sunset over Montréal”", when: "2 min" },
  { id: "n2", who: "Noah Petit", what: "started following you", when: "1 h" },
  { id: "n3", who: "Maya Chen", what: "commented: “The drone shot!”", when: "3 h" },
];

// A FlashList v2 with the theme's separators, inset after the avatar.
export default function NativeListDefault() {
  return (
    <List
      label="Notifications"
      data={notifications}
      keyExtractor={(n) => n.id}
      separator="inset"
      renderItem={(n) => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Avatar alt={n.who} size="md" />
          <View style={{ flex: 1 }}>
            <Txt>{`${n.who} ${n.what}`}</Txt>
            <Txt variant="caption" tone="secondary">{n.when}</Txt>
          </View>
        </View>
      )}
    />
  );
}
