import { Alert, Button } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeAlertTones() {
  return (
    <View style={{ width: 340, gap: 12 }}>
      <Alert tone="info" title="Payouts on Fridays">Your earnings are sent every Friday once they reach $20.</Alert>
      <Alert tone="success" title="Profile published">People can find you now.</Alert>
      <Alert tone="warning" title="Verify your email">Some features wait for a verified address.</Alert>
      <Alert tone="danger" title="Payment failed" action={<Button size="sm" variant="secondary" label="Update the card" />}>
        The bank declined the card ending in 4242.
      </Alert>
    </View>
  );
}
