import { Button, EmptyState, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Svg>
  );
}

export default function NativeEmptyStateDefault() {
  const { theme } = useTheme();
  return (
    <View style={{ width: 320 }}>
      <EmptyState
        icon={<BellIcon color={theme.textPrimary} />}
        title="No notifications yet"
        description="Follow a creator to hear when they go on stage."
        action={<Button variant="primary" label="Explore" />}
      />
    </View>
  );
}
