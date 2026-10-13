import { ActivityFeed } from "@krizaka/ui/native";
import { View } from "react-native";

const events = [
  { id: "e1", at: "2026-10-11T14:58:00Z", title: "Dubbing of “Sunset session” finished", tone: "success" as const },
  { id: "e2", at: "2026-10-11T13:05:00Z", title: "Mina tipped your video $5", kind: "tip", actor: "mina", tone: "success" as const },
  { id: "e3", at: "2026-10-11T12:50:00Z", title: "Mina tipped your video $5", kind: "tip", actor: "mina", tone: "success" as const },
  { id: "e4", at: "2026-10-10T18:20:00Z", title: "Clip job failed", description: "The source is too short", tone: "danger" as const },
];

// The activity tab: by day, the tips folded, how long ago.
export default function NativeActivityFeedNotifications() {
  return (
    <View style={{ width: 340, height: 300 }}>
      <ActivityFeed aria-label="Activity" events={events} now={new Date("2026-10-11T15:00:00Z")} />
    </View>
  );
}
