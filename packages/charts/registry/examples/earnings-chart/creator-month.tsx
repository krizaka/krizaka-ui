import { EarningsChart } from "@krizaka/charts/earnings";

// Net earnings in cents, as the ledger stores them (Orochia /earnings).
const months = [
  { month: "2026-05", net: 182_40 },
  { month: "2026-06", net: 245_10 },
  { month: "2026-07", net: 210_75 },
  { month: "2026-08", net: 398_20 },
  { month: "2026-09", net: 441_05 },
  { month: "2026-10", net: 512_90 },
];

export default function CreatorMonth() {
  return (
    <EarningsChart
      title="Your earnings"
      data={months}
      net="net"
      currency="USD"
      payoutThreshold={{ value: 50_00, label: "Payout threshold" }}
      labels={{ total: "earned over {count} months", change: "{change} vs September" }}
    />
  );
}
