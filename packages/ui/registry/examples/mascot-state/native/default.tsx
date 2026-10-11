import { Button, ErrorState, SuccessState } from "@krizaka/ui/native";
import { View } from "react-native";

// A payment received (the flamingo gets paid) and a verification that failed (the falcon watches).
export default function NativeMascotStateDefault() {
  return (
    <View style={{ width: 320, gap: 8 }}>
      <SuccessState bird="flamingo" size="sm" animated={false} title="Payment received" description="120 credits are on your balance." />
      <ErrorState
        bird="falcon"
        size="sm"
        animated={false}
        title="We could not verify this code"
        description="It may have expired. Ask for a new one."
        action={<Button variant="secondary" label="Send a new code" />}
      />
    </View>
  );
}
