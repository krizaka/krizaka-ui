import { Grid, Txt, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";

const STATS = [
  { label: "Files to decide", value: "3" },
  { label: "Checks this month", value: "42" },
  { label: "Credits left", value: "58" },
  { label: "Average time", value: "1 min 12 s" },
];

// A stat strip: cards of equal height, two per row on a phone and four on a tablet; at 200 % text they stack, so no number is cut.
export default function NativeGridStats() {
  const { theme } = useTheme();
  return (
    <Grid columns={{ compact: 2, expanded: 4 }} minItemWidth={140} aria-label="This month">
      {STATS.map((stat) => (
        <View key={stat.label} style={{ gap: 4, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.borderSubtle, backgroundColor: theme.surface1 }}>
          <Txt variant="caption" tone="secondary">{stat.label}</Txt>
          <Txt variant="title">{stat.value}</Txt>
        </View>
      ))}
    </Grid>
  );
}
