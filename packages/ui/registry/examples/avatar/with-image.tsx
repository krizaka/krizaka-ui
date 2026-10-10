import { Avatar } from "@krizaka/ui/avatar";

// A self-contained portrait (no network).
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#3b82f6"/>' +
      '<circle cx="40" cy="31" r="14" fill="#dbeafe"/><path d="M12 80a28 24 0 0 1 56 0z" fill="#dbeafe"/></svg>',
  );

export default function AvatarWithImage() {
  return <Avatar src={PORTRAIT} alt="Oussama" fallback="OA" />;
}
