import { KpiExplained } from "@krizaka/ui/kpi-explained";

export default function FounderCockpit() {
  return <KpiExplained label="Dépenses mensuelles" value={287495} format={{ type: "money", currency: "CAD" }} locale="fr-CA" meaning="Le total des factures payées ce mois-ci." formulaLabel="Calcul" formula="Factures payées, taxes incluses" sourceLabel="Source" source="ledger/octobre.csv" thresholds={{ direction: "above", watchAt: 250000, actAt: 300000 }} stateLabels={{ ok: "Stable", watch: "À surveiller", act: "À agir" }} freshness={{ lastRead: "2026-10-22T12:00:00Z", expectedAt: "2026-10-23T12:00:00Z", now: "2026-10-23T09:00:00Z", lastReadLabel: "Lu", staleLabel: "À actualiser" }} masked maskedLabel="Valeur masquée" />;
}
