import { Header, IconButton, SearchField, Txt, useCollapsingHeader, useTheme } from "@krizaka/ui/native";
import { Animated, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const DAYS = ["Today", "Yesterday", "Monday", "Sunday", "Saturday", "Friday", "Thursday"];

// A large title that folds into the bar as the list scrolls under it.
export default function NativeHeaderLargeTitle() {
  const { scrollY, onScroll } = useCollapsingHeader();
  const { theme } = useTheme();
  const plus = (
    <Svg width={20} height={20} viewBox="0 0 24 24" stroke={theme.textPrimary} strokeWidth={2.4} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
  return (
    <View style={{ width: 360, height: 420 }}>
      <Header title="Earnings" subtitle="$1,990.40 this year" scrollY={scrollY} actions={<IconButton label="Withdraw" icon={plus} variant="ghost" />}>
        <SearchField label="Search payouts" placeholder="Search payouts" clearLabel="Clear" />
      </Header>
      <Animated.ScrollView tabIndex={0} onScroll={onScroll} scrollEventThrottle={16}>
        {DAYS.map((day) => (
          <View key={day} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 }}>
            <Txt variant="label">{`Tips · ${day}`}</Txt>
            <Txt tone="secondary">$24.00</Txt>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
