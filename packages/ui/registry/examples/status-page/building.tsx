import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";
import { Progress } from "@krizaka/ui/progress";
import { StatusPage } from "@krizaka/ui/status-page";

// TEMPLATE — « under construction »: what is coming, said honestly — its state in words, its progress, how to hear
// about it — the duck that builds beside it. Never a fake screen.
export default function StatusPageBuilding() {
  return (
    <StatusPage
      eyebrow="Yasakia"
      title="On its way"
      lead="Meet by talking first. The first build reaches testers this winter."
      aside={<Mascot bird="duck" mood="thinking" size={112} />}
      state="building"
      stateLabel="In construction"
      checked="Updated this week"
    >
      <div className="flex max-w-md flex-col gap-4">
        <Progress value={40} label="First build" showLabel valueText="4 of 10 milestones" />
        <Button variant="primary" shape="cut" className="w-fit">Tell me when it is ready</Button>
      </div>
    </StatusPage>
  );
}
