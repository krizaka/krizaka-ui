import { AppHeader, AppHeaderCount, AppHeaderSearch, Avatar, ProductMark, useTheme } from "@krizaka/ui/native";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// The family's bar on a phone: search, language, notifications with their count, the account.
export default function NativeAppHeaderFamily() {
  const { theme } = useTheme();
  const bell = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <Path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20h4" />
    </Svg>
  );
  return (
    <View style={{ width: 360 }}>
      <AppHeader
        name="Yomizaka"
        mark={<ProductMark id="yomizaka" size={24} animated={false} />}
        search={<AppHeaderSearch label="Search files and checks" onOpen={() => undefined} />}
        language={
          <Pressable role="button" aria-label="Language: EN (English)" style={{ minHeight: 40, justifyContent: "center", paddingHorizontal: 6 }}>
            <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 12 }}>EN</Text>
          </Pressable>
        }
        notifications={<AppHeaderCount label="Notifications" icon={bell} count={3} countLabel="3 new" onPress={() => undefined} />}
        account={
          <Pressable role="button" aria-label="Account, Eric Tremblay">
            <Avatar size="sm" fallback="E" />
          </Pressable>
        }
      />
    </View>
  );
}
