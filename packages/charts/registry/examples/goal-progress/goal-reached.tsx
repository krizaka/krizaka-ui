import { GoalProgress } from "@krizaka/charts/goal";

// Past the goal: the arc stays full, the amount keeps counting, “Goal reached” is written.
export default function GoalReached() {
  return <GoalProgress title="Cover of the summer hit" raised={1_180_00} goal={1_000_00} currency="EUR" supporters={128} height={200} locale="fr-FR" labels={{ raised: "collectés sur {goal}", reached: "Objectif atteint", supporters: "{count} soutiens" }} />;
}
