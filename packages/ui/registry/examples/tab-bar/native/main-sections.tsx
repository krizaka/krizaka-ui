import { TabBar } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const icon = (d: string) => (on: boolean, color: string) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={on ? color : "none"} stroke={color} strokeWidth={2} strokeLinejoin="round">
    <Path d={d} />
  </Svg>
);

// A video app's main sections: the current one in the accent, a badge on Messages, a tick on change.
export default function NativeTabBarMainSections() {
  const [tab, setTab] = useState<"home" | "auctions" | "messages" | "me">("home");
  return (
    <View style={{ width: 360 }}>
      <TabBar
        aria-label="Main sections"
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "home", label: "Home", icon: icon("M3 11 12 4l9 7v9h-6v-6H9v6H3z") },
          { value: "auctions", label: "Auctions", icon: icon("M14 4l6 6-3 3-6-6zM11 7l-8 8 3 3 8-8M4 21h9") },
          { value: "messages", label: "Messages", badge: 3, badgeLabel: "3 unread", icon: icon("M4 5h16v11H8l-4 4z") },
          { value: "me", label: "Me", icon: icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0") },
        ]}
      />
    </View>
  );
}
