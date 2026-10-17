import { BarChart, ChartCard } from "@krizaka/charts/native";
import { View } from "react-native";

const months = [
  { month: "2026-05", net: 182_000 },
  { month: "2026-06", net: 214_000 },
  { month: "2026-07", net: 198_000 },
  { month: "2026-08", net: 251_000 },
  { month: "2026-09", net: 276_000 },
  { month: "2026-10", net: 312_000 },
];

export default function NativeChartCardEarnings() {
  return (
    <View style={{ width: 340 }}>
      <ChartCard title="Earnings" insight="$3,120 · +13 % vs September" description="Net of fees, by month" footer="Updated a minute ago">
        <BarChart title="Earnings" hideTitle data={months} x="month" xFormat="month" y="net" format={{ style: "money", currency: "USD" }} height={160} />
      </ChartCard>
    </View>
  );
}
