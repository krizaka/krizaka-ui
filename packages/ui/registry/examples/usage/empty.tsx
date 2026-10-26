import { UsageChart, UsageTiles } from "@krizaka/ui/usage";

// While the data is on its way (`loading`), then when the period has nothing in it.
export default function UsageEmpty() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <UsageTiles loading tiles={[]} />
      <UsageChart loading title="Activité par résultat" days={[]} outcomes={[]} columns={{ day: "Jour", total: "Total" }} emptyLabel="" />
      <UsageChart title="Activité par résultat" days={[{ label: "1 nov.", values: {} }]} outcomes={[{ id: "done", label: "Terminées", tone: "success" }]} columns={{ day: "Jour", total: "Total" }} emptyLabel="Aucune activité sur cette période." />
    </div>
  );
}
