import { Avatar } from "@krizaka/ui/native";

export default function NativeAvatarGroup() {
  return (
    <Avatar.Group max={3} size="md">
      <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/camille-256.dc2943029a.webp" alt="Camille" />
      <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/noor-256.c340c41421.webp" alt="Noor" />
      <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/tomas-256.7eaab80903.webp" alt="Tomás" />
      <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/ada-256.31a5ce640c.webp" alt="Ada" />
      <Avatar alt="Lou" />
    </Avatar.Group>
  );
}
