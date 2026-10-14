import { Header, Screen, TabBar, Txt } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const icon = (d: string) => (on: boolean, color: string) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={on ? color : "none"} stroke={color} strokeWidth={2} strokeLinejoin="round">
    <Path d={d} />
  </Svg>
);
const TABS = [
  { value: "discover", label: "Discover", icon: icon("M12 3l2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6z") },
  { value: "likes", label: "Likes", badge: 4, badgeLabel: "4 new", icon: icon("M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z") },
  { value: "chats", label: "Chats", badge: 2, badgeLabel: "2 unread", icon: icon("M4 5h16v11H8l-4 4z") },
  { value: "me", label: "Me", icon: icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0") },
];

// The app shell: a header with its large title, the section's content, the tab bar clear of the home indicator.
export default function NativeScreenAppShell() {
  const [tab, setTab] = useState("likes");
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header title="Likes" subtitle="4 people liked you" />} footer={<TabBar aria-label="Main sections" items={TABS} value={tab} onValueChange={setTab} />} padding={0}>
        {["Camille, 29", "Tomás, 31", "Noor, 27", "Ada, 33"].map((name) => (
          <View key={name} style={{ gap: 2, paddingHorizontal: 16, paddingVertical: 12 }}>
            <Txt variant="label">{name}</Txt>
            <Txt variant="caption" tone="secondary">Liked you today</Txt>
          </View>
        ))}
      </Screen>
    </View>
  );
}
