import { Header, Screen, SettingsGroup, SettingsRow, Switch } from "@krizaka/ui/native";
import { View } from "react-native";

// TEMPLATE — Settings home: one list, grouped by what it concerns; a row that opens a screen has a chevron, a preference is a switch that applies at once.
export default function NativeScreenSettingsHome() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header title="Settings" />}>
        <SettingsGroup title="Account">
          <SettingsRow label="Profile" description="Name, photo" onPress={() => undefined} />
          <SettingsRow label="Language" value="English" onPress={() => undefined} />
          <SettingsRow label="Theme" value="System" onPress={() => undefined} />
        </SettingsGroup>
        <SettingsGroup title="Notifications">
          <SettingsRow label="Files to decide" trailing={<Switch label="Files to decide" defaultChecked />} />
          <SettingsRow label="Weekly summary" trailing={<Switch label="Weekly summary" />} />
        </SettingsGroup>
        <SettingsGroup title="Danger zone">
          <SettingsRow label="Sign out" onPress={() => undefined} />
          <SettingsRow label="Delete my account" destructive onPress={() => undefined} />
        </SettingsGroup>
      </Screen>
    </View>
  );
}
