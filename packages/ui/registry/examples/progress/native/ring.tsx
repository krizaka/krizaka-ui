import { Progress, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeProgressRing() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Progress variant="ring" size="sm" value={30} label="Goal" />
      <Progress variant="ring" size="md" value={64} label="Goal">
        <Txt variant="label">64%</Txt>
      </Progress>
      <Progress variant="ring" size="lg" value={420} max={1000} label="Raised towards the goal" valueText="$420 of $1,000">
        <Txt variant="title">$420</Txt>
        <Txt variant="caption" tone="secondary">
          of $1,000
        </Txt>
      </Progress>
    </View>
  );
}
