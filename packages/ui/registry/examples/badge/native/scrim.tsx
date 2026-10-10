import { Badge, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";

// `scrim`: on a media, identical in both themes.
export default function NativeBadgeScrim() {
  const { theme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.media, padding: 24, borderRadius: 12 }}>
      <Badge tone="scrim" dot>
        Ending soon
      </Badge>
    </View>
  );
}
