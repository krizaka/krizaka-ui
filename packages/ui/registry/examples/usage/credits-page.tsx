import { CreditsMeter, PeriodSwitch, UsageChart, UsageTiles } from "@krizaka/ui/usage";

const spark = (data: number[]) => (
  <svg viewBox="0 0 64 18" width={64} height={18} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <polyline points={data.map((v, i) => `${(i * 64) / (data.length - 1)},${17 - v}`).join(" ")} />
  </svg>
);
const days = [
  { label: "1 nov.", values: { done: 8, flagged: 2, failed: 0 } },
  { label: "2 nov.", values: { done: 11, flagged: 1, failed: 1 } },
  { label: "3 nov.", values: { done: 6, flagged: 3, failed: 0 } },
];

// A « Credits & usage » page in French (the default), demo data. A `Sparkline` of @krizaka/charts goes in `chart`; a line stands in.
export default function CreditsPage() {
  const period = <PeriodSwitch label="Période" value={30} href="/credits" />;
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <CreditsMeter label="Crédits" balance={820} total={1000} renewal="Renouvelés le 1er décembre" action={<a href="/credits/acheter">Acheter des crédits</a>} />
      <UsageTiles
        period={period}
        tiles={[
          { id: "runs", label: "Vérifications", value: 128, previous: 114, chart: spark([4, 6, 5, 8, 9, 12]) },
          { id: "flagged", label: "Signalées", value: 8, previous: 10, good: "down", chart: spark([3, 2, 2, 1, 1, 1]) },
          { id: "credits", label: "Crédits utilisés", value: 180, previous: 180, chart: spark([3, 3, 3, 3, 3, 3]) },
        ]}
      />
      <UsageChart
        title="Activité par résultat"
        days={days}
        columns={{ day: "Jour", total: "Total" }} emptyLabel="Aucune activité sur cette période."
        outcomes={[
          { id: "done", label: "Terminées", tone: "success" },
          { id: "flagged", label: "Signalées", tone: "warning" },
          { id: "failed", label: "Échouées", tone: "danger" },
        ]}
      />
    </div>
  );
}
