import { ProductLogo } from "@krizaka/ui";
import { Emblem } from "@krizaka/ui/achievement";
import { ProfileCard } from "@krizaka/ui/profile-card";

// The arcade flavour: the brand's light, a ring and a breathing aura, a skewed gauge — for a told page, not a dashboard.
export default function ProfileCardArcade() {
  return (
    <ProfileCard
      variant="arcade"
      brand="orazaka"
      nameAs="p"
      visual={<ProductLogo id="orazaka" size={120} animated={false} />}
      icon={<Emblem kind="mirror" size={16} />}
      name="Mirror clan"
      statLabel="Data kept at home"
      caption="ōrāre + zaka"
    />
  );
}
