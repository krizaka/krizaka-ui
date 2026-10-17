import { Stat, StatGrid } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeStatDashboard() {
  return (
    <View style={{ width: 340 }}>
      <StatGrid>
        <Stat label="Earnings" value="$12,480" trend="up" trendLabel="+12 %" hint="vs last month" />
        <Stat label="Supporters" value="1,204" trend="up" trendLabel="+38" hint="this week" />
        <Stat label="Payout" value="$3,120" hint="on Friday" />
        <Stat label="Refunds" value="2" trend="down" trendLabel="−3" hint="vs last month" />
      </StatGrid>
    </View>
  );
}
