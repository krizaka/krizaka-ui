import { BarChart } from "@krizaka/charts/bar";

// Cents, sorted by amount: a ranking reads top to bottom.
const supporters = [
  { name: "Léa Fontaine", total: 48_500 },
  { name: "Marcus Oyelaran", total: 36_200 },
  { name: "Hana Watanabe", total: 29_900 },
  { name: "Tomás Ferreira-Lindqvist", total: 21_400 },
  { name: "Eric Dubois", total: 17_800 },
  { name: "Amira Haddad", total: 12_050 },
];

export default function TopSupporters() {
  return (
    <BarChart
      title="Top supporters this quarter"
      data={supporters}
      x="name"
      xLabel="Supporter"
      y="total"
      yLabel="Total"
      format={{ style: "money", currency: "EUR" }}
      horizontal
      height={260}
    />
  );
}
