import { OfflineBanner, StateScreen } from "@krizaka/ui/native";
import { View } from "react-native";

// TEMPLATE — Offline: the slim banner when saved data still shows, the full state when there is nothing to show.
export default function NativeStateScreenOffline() {
  return (
    <View style={{ width: 360, height: 480 }}>
      <OfflineBanner label="You are offline. Showing what was saved." actionLabel="Try again" onAction={() => undefined} />
      <StateScreen kind="offline" title="No connection" description="Connect to the internet to see new files. Your saved ones stay available." action={{ label: "Try again", onPress: () => undefined }} />
    </View>
  );
}
