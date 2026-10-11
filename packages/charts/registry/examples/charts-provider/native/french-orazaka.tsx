import { BarChart, ChartsProvider } from "@krizaka/charts/native";

const months = [
  { month: "2026-06", credits: 412_000 },
  { month: "2026-07", credits: 468_500 },
  { month: "2026-08", credits: 391_200 },
  { month: "2026-09", credits: 523_900 },
];

// In an app: scheme and theme from @krizaka/ui/native's useTheme(), so the charts follow its mode and brand.
export default function FrenchOrazaka() {
  return (
    <ChartsProvider locale="fr-FR" brand="orazaka">
      <BarChart title="Crédits consommés par mois" data={months} x="month" y="credits" yLabel="Crédits" format="compact" />
    </ChartsProvider>
  );
}
