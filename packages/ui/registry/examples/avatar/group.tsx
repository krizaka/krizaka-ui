import { Avatar } from "@krizaka/ui/avatar";

// `max={3}`: the others become `+n`.
export default function AvatarGroup() {
  return (
    <Avatar.Group max={3} size="sm">
      <Avatar size="sm" src="https://krizaka-assets.b-cdn.net/site/people/ui/camille-256.dc2943029a.webp" alt="Camille Roy" />
      <Avatar size="sm" src="https://krizaka-assets.b-cdn.net/site/people/ui/noor-256.c340c41421.webp" alt="Noor Haddad" />
      <Avatar size="sm" src="https://krizaka-assets.b-cdn.net/site/people/ui/tomas-256.7eaab80903.webp" alt="Tomás Ibarra" />
      <Avatar size="sm" fallback="LM" />
      <Avatar size="sm" src="https://krizaka-assets.b-cdn.net/site/people/ui/ada-256.31a5ce640c.webp" alt="Ada Okafor" />
    </Avatar.Group>
  );
}
