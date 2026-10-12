import { Achievement, AchievementList } from "@krizaka/ui/achievement";

// Milestones: what each one replaced, struck through; the next one locked — said in its badge too.
export default function AchievementMilestones() {
  return (
    <AchievementList className="w-full max-w-2xl">
      <Achievement eyebrow="Milestone 01" badge="Done" replaced="Paying 30 % to a platform" title="90 % of every tip to you" />
      <Achievement eyebrow="Milestone 02" badge="Done" replaced="Fans who vanish after a like" title="Challenges they back with credits" />
      <Achievement eyebrow="Milestone 03" badge="Locked" locked title="Your first auction" />
    </AchievementList>
  );
}
