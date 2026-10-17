import { Meter, Stat } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeStatWithChart() {
  return (
    <View style={{ width: 300 }}>
      <Stat
        label="Credits used"
        value="4,120"
        trend="flat"
        trendLabel="Same as last week"
        hint="of 5,000 this month"
        chart={<Meter label="Credits used" value={4120} max={5000} valueText="4,120 of 5,000" />}
      />
    </View>
  );
}
