import { GoalGauge } from "@krizaka/ui/native";
import { View } from "react-native";

// A challenge's goal and the seats left of a live drop, on mobile.
export default function NativeGoalGaugeDefault() {
  return (
    <View style={{ width: 300, gap: 18 }}>
      <GoalGauge label="Backers" segments={10} value={6} valueText="6 of 10 backers" animated={false} />
      <GoalGauge label="Seats left" segments={12} value={3} mode="drain" valueText="3 seats left" animated={false} />
    </View>
  );
}
