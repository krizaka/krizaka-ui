import { PermissionPrompt } from "@krizaka/ui/native";
import { View } from "react-native";

// The system will not ask again: the way to the settings, the pigeon for notifications.
export default function NativePermissionPromptBlocked() {
  return (
    <View style={{ width: 340 }}>
      <PermissionPrompt
        status="blocked"
        mascot="pigeon"
        title="Know when you are outbid"
        description="Turn on notifications to hear about your auctions."
        blockedDescription="Notifications are off for this app. Turn them on in the settings to hear when you are outbid."
        allowLabel="Turn on notifications"
        onAllow={() => undefined}
        settingsLabel="Open the settings"
        onOpenSettings={() => undefined}
      />
    </View>
  );
}
