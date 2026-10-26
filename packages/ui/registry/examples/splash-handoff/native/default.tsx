import { SplashHandoff } from "@krizaka/ui/native";
import { View } from "react-native";

// Over the app's root: the mark sits where the native splash icon was; `ready` (the session and fonts loaded) dissolves it.
export default function NativeSplashHandoffDefault() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <SplashHandoff product="orazaka" ready={false} label="Orazaka is opening" />
    </View>
  );
}
