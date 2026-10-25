import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { ProfileBanner } from "@krizaka/ui/profile-card";

// A client's page: the brand's tinted cover, the family's default avatar overlapping it, the name (h1), its facts, the actions.
export default function ProfileCardBanner() {
  return (
    <ProfileBanner
      brand="akinaza"
      avatar={<Avatar defaultAvatar={{ brand: "akinaza", seed: "eric" }} alt="" fallback="E" size="xl" />}
      eyebrow="Client"
      title="Eric Tremblay"
      status={<Badge tone="success" size="sm">Regular</Badge>}
      meta="Client since 2024 · 14 visits"
      actions={
        <>
          <Button size="sm" variant="primary">Book</Button>
          <Button size="sm">Message</Button>
        </>
      }
    />
  );
}
