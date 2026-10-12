import { GoalGauge } from "@krizaka/ui/goal-gauge";
import { Scene, ScrollStage } from "@krizaka/ui/scroll-stage";
import { StageBanner } from "@krizaka/ui/stage-banner";

// A told page: each chapter plays once as it scrolls in — the banner, then the words (`data-kzs-reveal`), then the gauge.
export default function ScrollStageChapters() {
  return (
    <ScrollStage className="grid w-full max-w-xl gap-10">
      <Scene className="grid gap-3">
        <StageBanner stage="Step 01" name="Your profile" />
        <div data-kzs-reveal>
          <h3 className="text-lg font-semibold text-fg">Say who you are, in your words</h3>
          <p className="text-sm text-fg-secondary">Three questions, two photos. Nothing is public until you say so.</p>
        </div>
      </Scene>
      <Scene className="grid gap-3">
        <StageBanner stage="Step 02" name="Your first goal" />
        <GoalGauge label="Backers" segments={10} value={6} valueText="6 of 10 backers" />
      </Scene>
    </ScrollStage>
  );
}
