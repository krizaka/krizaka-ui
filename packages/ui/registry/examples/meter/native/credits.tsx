import { Meter } from "@krizaka/ui/native";
import { View } from "react-native";

// Credits used this month: warning past 80 %, danger past 95 %.
export default function NativeMeterCredits() {
  return (
    <View style={{ width: 320, gap: 20 }}>
      <Meter label="Credits this month" value={4_120} max={5_000} valueText="4,120 of 5,000" thresholds={{ low: 0.8, high: 0.95 }} showLabel />
      <Meter label="Storage" value={18} max={50} valueText="18 GB of 50 GB" showLabel size="sm" />
    </View>
  );
}
