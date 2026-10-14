import { ActivityFeed, Button, Header, Screen } from "@krizaka/ui/native";
import { View } from "react-native";

const EVENTS = [
  { id: "e1", at: "2026-10-13T09:40:00Z", title: "Mina unlocked “Night shoot, part 2”", tone: "success" as const },
  { id: "e2", at: "2026-10-13T08:15:00Z", title: "Your payout of €120 was sent", tone: "info" as const },
  { id: "e3", at: "2026-10-12T19:02:00Z", title: "Léa bid €25 on the auction", tone: "accent" as const },
  { id: "e4", at: "2026-10-12T11:30:00Z", title: "Clip job failed", description: "The source is too short", tone: "danger" as const },
];

// A notifications centre: what happened, newest first, grouped by day; marking all as read is a button, never a hidden gesture.
export default function NativeScreenNotifications() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header title="Notifications" subtitle="2 new" />}>
        <Button label="Mark all as read" variant="ghost" size="sm" />
        <ActivityFeed aria-label="Notifications" events={EVENTS} now={new Date("2026-10-13T10:00:00Z")} />
      </Screen>
    </View>
  );
}
