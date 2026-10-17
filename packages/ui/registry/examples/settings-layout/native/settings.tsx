import { SettingsRow, SettingsSection, Switch } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const icon = (d: string) => (color: string) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d={d} />
  </Svg>
);

export default function NativeSettingsLayoutSettings() {
  const [push, setPush] = useState(true);
  return (
    <View style={{ width: 360, gap: 24 }}>
      <SettingsSection title="Account">
        <SettingsRow icon={icon("M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10")} label="Profile" hint="Name, photo, bio" onPress={() => {}} />
        <SettingsRow icon={icon("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18")} label="Language" value="English" onPress={() => {}} />
      </SettingsSection>
      <SettingsSection title="Notifications" description="We only send what you asked for.">
        <SettingsRow label="Push notifications" hint="New messages and payouts" accessory={<Switch label="Push notifications" checked={push} onCheckedChange={setPush} />} />
      </SettingsSection>
      <SettingsSection title="Session">
        <SettingsRow label="Sign out" destructive onPress={() => {}} />
      </SettingsSection>
    </View>
  );
}
