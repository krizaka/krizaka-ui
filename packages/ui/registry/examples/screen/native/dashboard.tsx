import { Grid, Header, Screen, TabBar, Txt, useTheme } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const icon = (d: string) => (on: boolean, color: string) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill={on ? color : "none"} stroke={color} strokeWidth={2} strokeLinejoin="round">
    <Path d={d} />
  </Svg>
);
const TABS = [
  { value: "home", label: "Home", icon: icon("M4 11 12 4l8 7v9H4z") },
  { value: "files", label: "Files", badge: 3, badgeLabel: "3 to decide", icon: icon("M4 5h16v14H4zM8 9h8M8 13h5") },
  { value: "me", label: "Me", icon: icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0") },
];
const STATS = [["Files to decide", "3"], ["Checks this month", "42"], ["Credits left", "58"], ["Average time", "1 min 12 s"]] as const;
const RECENT = [["Lease — 12 rue Fleury", "Verified"], ["Payslips — Ada Roy", "To decide"], ["ID — Noor Khan", "Verified"], ["Lease — 8 av. du Parc", "In progress"]] as const;

// TEMPLATE — Dashboard: a large title, a strip of stats that is two per row on a phone and four on a tablet, the recent
// items under it, the tab bar clear of the home indicator. Pull down to refresh; the content never runs under the bars.
export default function NativeScreenDashboard() {
  const { theme } = useTheme();
  const [tab, setTab] = useState("home");
  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen
        header={<Header title="Home" subtitle="Updated just now" />}
        footer={<TabBar aria-label="Main sections" items={TABS} value={tab} onValueChange={setTab} />}
        refreshing={refreshing}
        refreshLabel="Pull to refresh"
        onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }}
      >
        <Grid columns={{ compact: 2, expanded: 4 }} minItemWidth={140} aria-label="This month">
          {STATS.map(([label, value]) => (
            <View key={label} style={{ gap: 4, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.borderSubtle, backgroundColor: theme.surface1 }}>
              <Txt variant="caption" tone="secondary">{label}</Txt>
              <Txt variant="title">{value}</Txt>
            </View>
          ))}
        </Grid>
        <Txt variant="label" role="heading">Recent</Txt>
        {RECENT.map(([name, state]) => (
          <View key={name} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
            <Txt style={{ flex: 1 }} numberOfLines={2}>{name}</Txt>
            <Txt variant="caption" tone="secondary">{state}</Txt>
          </View>
        ))}
      </Screen>
    </View>
  );
}
