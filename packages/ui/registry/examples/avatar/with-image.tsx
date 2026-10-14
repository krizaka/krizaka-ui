import { Avatar } from "@krizaka/ui/avatar";

// A portrait: the image when it loads, the initials while it loads or when it fails.
export default function AvatarWithImage() {
  return <Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/ada-256.31a5ce640c.webp" alt="Ada Okafor" fallback="AO" />;
}
