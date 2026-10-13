import { Header, Screen, Switch, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// Settings: sections with their headings, switches that apply at once.
export default function NativeScreenSettings() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen header={<Header size="inline" title="Settings" backLabel="Me" onBack={() => undefined} />}>
        <Txt variant="caption" tone="secondary" role="heading">DISCOVERY</Txt>
        <Switch label="Show me in Discover" defaultChecked />
        <Txt variant="caption" tone="secondary" role="heading">NOTIFICATIONS</Txt>
        <Switch label="New likes" defaultChecked />
        <Switch label="Messages" description="Even when the app is closed" defaultChecked />
        <Txt variant="caption" tone="secondary" role="heading">ACCOUNT</Txt>
        <Switch label="Show my distance" description="Rounded to the kilometre" />
      </Screen>
    </View>
  );
}
