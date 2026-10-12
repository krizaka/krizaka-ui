import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { ProfileCard } from "@krizaka/ui/profile-card";

// A creator at a glance: the headline gauge, the stats with their values in words, the actions under them.
export default function ProfileCardCreator() {
  return (
    <ProfileCard
      visual={<Avatar fallback="EM" size="xl" />}
      visualSize={96}
      name="Elena Marchetti"
      statLabel="Profile complete"
      value={80}
      stats={[
        { label: "Challenges met", value: 12, max: 15, valueText: "12 of 15" },
        { label: "Replies within a day", value: 94 },
      ]}
      caption="Dance and street fashion · Montréal"
    >
      <Button variant="primary" size="sm">
        Follow
      </Button>
      <Button size="sm">Message</Button>
    </ProfileCard>
  );
}
