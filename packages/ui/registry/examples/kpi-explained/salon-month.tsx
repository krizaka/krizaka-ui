import { KpiExplained } from "@krizaka/ui/kpi-explained";

export default function SalonMonth() {
  return <KpiExplained label="Ventes du mois" value={699446} format={{ type: "money", currency: "CAD" }} locale="fr-CA" meaning="Ce montant est entré dans la caisse en mars, avant les remboursements." formulaLabel="Calcul" formula="Ventes TTC − remboursements" sourceLabel="Source" source={<a href="/exports/mars.csv">export-mars.csv</a>} verify={<a href="/exports/mars.csv">Vérifier</a>} thresholds={{ direction: "below", watchAt: 650000, actAt: 500000 }} stateLabels={{ ok: "Dans les attentes", watch: "À surveiller", act: "À agir" }} freshness={{ lastRead: "2026-03-31T18:00:00Z", expectedAt: "2026-04-01T18:00:00Z", now: "2026-04-01T17:00:00Z", lastReadLabel: "Lu", staleLabel: "À actualiser" }} maskedLabel="Valeur masquée" />;
}
