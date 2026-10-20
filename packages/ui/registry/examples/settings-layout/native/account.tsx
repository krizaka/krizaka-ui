import { SettingsGroup, SettingsRow, Switch } from "@krizaka/ui/native";
import { View } from "react-native";

// A phone's settings: a value, a row that opens a screen, a switch, and the destructive action last.
export default function NativeSettingsAccount() {
  return (
    <View style={{ rowGap: 20, padding: 16 }}>
      <SettingsGroup title="Account">
        <SettingsRow label="Username" value="eric" />
        <SettingsRow label="Language" description="Used across the app" value="English" onPress={() => {}} />
        <SettingsRow label="Notifications" trailing={<Switch label="Notifications" checked onCheckedChange={() => {}} />} />
      </SettingsGroup>
      <SettingsGroup>
        <SettingsRow label="Delete account" destructive onPress={() => {}} />
      </SettingsGroup>
    </View>
  );
}
