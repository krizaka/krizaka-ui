import { GoalProgress } from "@krizaka/charts/native";

// The challenge screen of the app.
export default function NativeChallengePot() {
  return <GoalProgress title="Backflip on the beach" raised={262_00} goal={500_00} currency="USD" supporters={41} timeLeft="3 days" height={180} />;
}
