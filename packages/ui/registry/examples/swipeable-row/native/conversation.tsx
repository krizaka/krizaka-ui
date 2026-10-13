import { Avatar, SwipeableRow, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// Swipe left to archive or delete, right to pin; screen readers find the same actions in the rotor.
export default function NativeSwipeableRowConversation() {
  return (
    <View style={{ width: 360 }}>
      <SwipeableRow
        leading={[{ label: "Pin", tone: "accent", onPress: () => undefined }]}
        trailing={[
          { label: "Delete", tone: "danger", onPress: () => undefined },
          { label: "Archive", onPress: () => undefined },
        ]}
        onActivate={() => undefined}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }}>
          <Avatar alt="Elena" presence="online" presenceLabel="online" />
          <View style={{ flex: 1 }}>
            <Txt variant="label">Elena</Txt>
            <Txt variant="caption" tone="secondary">Sending the stems tonight 🎧</Txt>
          </View>
          <Txt variant="caption" tone="secondary">2 min</Txt>
        </View>
      </SwipeableRow>
    </View>
  );
}
