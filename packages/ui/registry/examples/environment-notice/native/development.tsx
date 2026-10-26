import { EnvironmentNotice } from "@krizaka/ui/native";
import { Linking, View } from "react-native";

// The stage is read once from configuration (the app's `APP_ENVIRONMENT`); `production` renders nothing.
export default function NativeEnvironmentNoticeDevelopment() {
  return (
    <View style={{ width: 360 }}>
      <EnvironmentNotice
        stage="development"
        title="Development version"
        message="Data can be reset at any time. Not a commercial offer."
        link={{ label: "What this means" }}
        onLinkPress={() => void Linking.openURL("https://www.krizaka.com")}
      />
    </View>
  );
}
