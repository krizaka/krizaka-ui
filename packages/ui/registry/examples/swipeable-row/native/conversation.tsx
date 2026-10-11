import { Avatar, ListItem, SwipeableRow } from "@krizaka/ui/native";
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
        <ListItem leading={<Avatar alt="Elena" presence="online" presenceLabel="online" />} title="Elena" description="Sending the stems tonight 🎧" trailing="2 min" onPress={() => undefined} />
      </SwipeableRow>
    </View>
  );
}
