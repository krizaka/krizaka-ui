import { Avatar, Badge, List, ListItem } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

type Note = { id: string; who: string; what: string; when: string; unread?: boolean };
const SECTIONS = [
  { title: "Today", data: [{ id: "1", who: "Mina", what: "tipped your video $5", when: "2 min", unread: true }, { id: "2", who: "Alex", what: "outbid you on “Signed first take”", when: "1 h", unread: true }] },
  { title: "Earlier", data: [{ id: "3", who: "Elena", what: "answered your challenge", when: "Mon" }, { id: "4", who: "Orochia", what: "Your payout of $120 was sent", when: "Sun" }] },
];

// Grouped by day, headings that stick, pull to refresh, swipe to delete.
export default function NativeListNotifications() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={{ width: 360, height: 360 }}>
      <List<Note>
        aria-label="Notifications"
        sections={SECTIONS}
        keyExtractor={(n) => n.id}
        renderItem={(n) => <ListItem leading={<Avatar alt={n.who} size="sm" />} title={n.who} description={n.what} trailing={n.unread ? <Badge tone="accent" dot /> : n.when} onPress={() => undefined} />}
        swipeActions={() => ({ trailing: [{ label: "Delete", tone: "danger", onPress: () => undefined }] })}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 800);
        }}
      />
    </View>
  );
}
