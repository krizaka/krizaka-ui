import { Achievement, AchievementList, Emblem } from "@krizaka/ui/achievement";

// The arcade flavour: each card's stamp slams in, one after the other, in time with a GoalGauge in the same scene.
export default function AchievementArcade() {
  return (
    <AchievementList variant="arcade" brand="orochia" className="w-full max-w-2xl">
      <Achievement icon={<Emblem kind="sword" size={14} />} eyebrow="Head 01" badge="Sealed" replaced="Data sent abroad" title="Everything runs on your machine" />
      <Achievement icon={<Emblem kind="mirror" size={14} />} eyebrow="Head 02" badge="Sealed" replaced="A bill per token" title="One price, no meter" />
      <Achievement icon={<Emblem kind="jewel" size={14} />} eyebrow="Head 03" badge="Sealed" replaced="A closed box" title="Open source, end to end" />
    </AchievementList>
  );
}
