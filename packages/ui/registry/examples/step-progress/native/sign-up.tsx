import { Button, StepProgress } from "@krizaka/ui/native";
import { View } from "react-native";

// The head of the sign-up: back, five segments, the position in words, Skip.
export default function NativeStepProgressSignUp() {
  return (
    <View style={{ width: 360 }}>
      <StepProgress step={2} total={5} label={(n, total) => `Step ${n} of ${total}`} backLabel="Back" onBack={() => undefined} trailing={<Button label="Skip" variant="ghost" size="sm" />} />
    </View>
  );
}
