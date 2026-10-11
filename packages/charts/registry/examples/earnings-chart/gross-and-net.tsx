import { EarningsChart } from "@krizaka/charts/earnings";

// The platform's treasury: gross volume and creators' net, in cents.
const months = [
  { month: "2026-07", gross: 12_480_00, net: 10_608_00 },
  { month: "2026-08", gross: 15_920_00, net: 13_532_00 },
  { month: "2026-09", gross: 18_210_00, net: 15_478_50 },
  { month: "2026-10", gross: 21_045_00, net: 17_888_25 },
];

export default function GrossAndNet() {
  return (
    <EarningsChart
      title="Creator earnings"
      description="Gross volume and what creators keep after fees"
      data={months}
      gross="gross"
      net="net"
      currency="USD"
      labels={{ total: "paid to creators over {count} months", change: "{change} vs last month", gross: "Gross volume", net: "Creators' net" }}
      exportable={["csv"]}
    />
  );
}
