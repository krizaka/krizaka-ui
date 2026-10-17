import { KpiStat } from "@krizaka/charts/native";
import { View } from "react-native";

const jobs = [12, 18, 15, 22, 19, 27, 31];
const latency = [840, 790, 820, 760, 700, 690, 640];

export default function NativeKpiStatDashboardHead() {
  return (
    <View style={{ width: 340, flexDirection: "row", gap: 16 }}>
      <KpiStat label="Jobs" value={144} previous={112} format="integer" data={jobs} variant="bar" hint="last 7 days" style={{ flex: 1 }} />
      <KpiStat label="Time to result" value={640} previous={840} good="down" format="integer" data={latency} hint="ms, median" style={{ flex: 1 }} />
    </View>
  );
}
