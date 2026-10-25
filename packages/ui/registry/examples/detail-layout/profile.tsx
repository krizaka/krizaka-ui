import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { DetailLayout } from "@krizaka/ui/detail-layout";

// A person's page: `cover` turns the header into a ProfileBanner — the cover, the avatar over its edge, the name, the actions.
export default function DetailLayoutProfile() {
  return (
    <DetailLayout
      className="w-full"
      back={<a href="#clients">← Clients</a>}
      cover
      media={<Avatar defaultAvatar={{ brand: "yomizaka", seed: "eric" }} alt="" fallback="E" size="xl" />}
      eyebrow="Applicant"
      title="Eric Tremblay"
      meta="Unit 4B · file complete"
      actions={<Button size="sm" variant="primary">Open the file</Button>}
    >
      <p className="text-sm text-fg-secondary">The applicant's documents and checks appear here.</p>
    </DetailLayout>
  );
}
