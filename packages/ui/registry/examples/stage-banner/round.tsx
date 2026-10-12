import { StageBanner } from "@krizaka/ui/stage-banner";

// `size="lg"`: a section's opening — the stage, a title (a heading here) and a line.
export default function StageBannerRound() {
  return (
    <div className="grid gap-10">
      <StageBanner size="lg" titleAs="h3" stage="Chapter 3" title="Get paid on your terms" subtitle="Tips, challenges and auctions — 90 % to you." />
      <StageBanner size="lg" variant="arcade" stage="Final round" title="The last boss" subtitle="Eight heads, one by one." />
    </div>
  );
}
