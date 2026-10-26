import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { Scene, ScrollStage } from "@krizaka/ui/scroll-stage";
import { StageBanner } from "@krizaka/ui/stage-banner";

// `variant="arcade"` once on the stage: every storytelling component inside takes the cabinet flavour.
export default function ScrollStageArcade() {
  return (
    <ScrollStage variant="arcade" className="grid w-full max-w-xl gap-8">
      <Scene brand="orazaka" className="grid justify-items-center gap-4 text-center">
        <StageBanner size="lg" stage="Final round" title="Eight problems in the way" subtitle="One by one, they fall." />
        <GoalGauge label="Problems left" segments={8} value={0} mode="drain" valueText="0 of 8 left" />
      </Scene>
    </ScrollStage>
  );
}
