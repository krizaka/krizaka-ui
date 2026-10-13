import { Fab, useTheme } from "@krizaka/ui/native";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

// The screen's one main action, floating over the list, above the tab bar (`offset`).
export default function NativeFabExtended() {
  const { theme } = useTheme();
  const plus = (
    <Svg width={22} height={22} viewBox="0 0 24 24" stroke={theme.onAccent} strokeWidth={2.4} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
  return (
    <View style={{ width: 360, height: 200, flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <Fab label="New challenge" icon={plus} extended onPress={() => undefined} />
      </View>
      <View style={{ flex: 1 }}>
        <Fab label="New challenge" icon={plus} onPress={() => undefined} />
      </View>
    </View>
  );
}
