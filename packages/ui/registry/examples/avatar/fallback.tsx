import { Avatar } from "@krizaka/ui/avatar";

// No image (or while it loads, or when it fails): the initials.
export default function AvatarFallback() {
  return <Avatar fallback="OA" />;
}
