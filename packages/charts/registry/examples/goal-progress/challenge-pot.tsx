import { GoalProgress } from "@krizaka/charts/goal";

// A creator's challenge: fans pledge towards a goal, held in escrow until it is met.
export default function ChallengePot() {
  return (
    <GoalProgress
      title="Backflip on the beach"
      raised={262_00}
      goal={500_00}
      currency="USD"
      supporters={41}
      timeLeft="3 days"
      height={200}
    />
  );
}
