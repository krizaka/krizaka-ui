import { Avatar } from "@krizaka/ui/avatar";
import { ProfileCard } from "@krizaka/ui/profile-card";

// A match in a dating app: what you share, in words — never a score alone.
export default function ProfileCardMatch() {
  return (
    <ProfileCard
      brand="yomizaka"
      visual={<Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/camille-256.dc2943029a.webp" alt="Camille Roy" fallback="CR" size="xl" />}
      visualSize={88}
      name="Camille, 29"
      stats={[
        { label: "Interests in common", value: 4, max: 6, valueText: "4 of 6" },
        { label: "Answers that match", value: 7, max: 10, valueText: "7 of 10" },
      ]}
      caption="You both answered “a slow Sunday market” first."
    />
  );
}
