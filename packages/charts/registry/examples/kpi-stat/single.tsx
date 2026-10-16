import { KpiStat } from "@krizaka/charts/card";

// A rise in latency is bad news: good="down" makes the arrow say so.
export default function Single() {
  return <KpiStat label="Time to a result" value={48} previous={31} good="down" format={{ style: "unit", unit: "second" }} data={[31, 29, 35, 38, 41, 44, 48]} hint="median, last 7 days" />;
}
