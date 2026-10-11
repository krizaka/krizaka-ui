import { Switch } from "@krizaka/ui/native";
import { View } from "react-native";

// Notification settings: each switch applies at once.
export default function NativeSwitchSettings() {
  return (
    <View style={{ width: 320 }}>
      <Switch label="New tips" description="When a fan tips one of your videos" defaultChecked />
      <Switch label="Outbid" description="When someone bids over you" defaultChecked />
      <Switch label="Weekly summary" />
      <Switch label="Payouts" description="Managed by your bank" disabled defaultChecked />
    </View>
  );
}
