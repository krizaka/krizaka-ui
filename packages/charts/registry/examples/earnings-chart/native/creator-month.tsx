import { EarningsChart } from "@krizaka/charts/native";

const months = [
  { month: "2026-05", net: 182_40 },
  { month: "2026-06", net: 245_10 },
  { month: "2026-07", net: 210_75 },
  { month: "2026-08", net: 398_20 },
  { month: "2026-09", net: 441_05 },
  { month: "2026-10", net: 512_90 },
];

// The earnings card of the app: the total first, the bars under it.
export default function NativeCreatorMonth() {
  return (
    <EarningsChart
      title="Your earnings"
      data={months}
      net="net"
      currency="USD"
      height={160}
      labels={{ total: "over {count} months", change: "{change} vs September" }}
    />
  );
}
