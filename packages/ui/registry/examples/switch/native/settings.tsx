import { Switch } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// Notification preferences: settings rows, the whole row pressable, a selection haptic as each one flips.
export default function NativeSwitchSettings() {
  const [push, setPush] = React.useState(true);
  const [auctions, setAuctions] = React.useState(true);
  const [digest, setDigest] = React.useState(false);
  return (
    <View style={{ width: 320, gap: 4 }}>
      <Switch label="Push notifications" description="On this phone, even when the app is closed." showLabel checked={push} onCheckedChange={setPush} />
      <Switch label="Auctions you follow" description="Outbid, ending soon, won." showLabel checked={auctions} onCheckedChange={setAuctions} disabled={!push} />
      <Switch label="Weekly digest" description="One e-mail on Monday morning." showLabel checked={digest} onCheckedChange={setDigest} />
    </View>
  );
}
