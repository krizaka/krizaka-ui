import { StageBanner } from "@krizaka/ui/stage-banner";

// Before a chapter's heading: where the reader is. Sober by default; `variant="arcade"` for a told page.
export default function StageBannerSteps() {
  return (
    <div className="grid justify-items-start gap-4">
      <StageBanner stage="Step 02" name="Payments" />
      <StageBanner variant="arcade" stage="Stage 02" name="Orazaka" />
    </div>
  );
}
