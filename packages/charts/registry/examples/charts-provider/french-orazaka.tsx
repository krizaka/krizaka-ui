import { BarChart } from "@krizaka/charts/bar";
import { ChartsProvider } from "@krizaka/charts/provider";

const months = [
  { month: "2026-06", credits: 412_000 },
  { month: "2026-07", credits: 468_500 },
  { month: "2026-08", credits: 391_200 },
  { month: "2026-09", credits: 523_900 },
];

// Once near the app's root: the locale, the brand's palette, the words from the app's catalogue.
export default function FrenchOrazaka() {
  return (
    <ChartsProvider
      locale="fr-FR"
      brand="orazaka"
      labels={{ actions: "Actions du graphique", viewTable: "Voir en tableau", downloadCsv: "Télécharger le CSV", copyData: "Copier les données", empty: "Pas encore de données.", kinds: { bar: "Histogramme" } }}
    >
      <BarChart title="Crédits consommés par mois" data={months} x="month" xLabel="Mois" y="credits" yLabel="Crédits" format="compact" />
    </ChartsProvider>
  );
}
