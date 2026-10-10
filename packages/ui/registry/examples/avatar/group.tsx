import { Avatar } from "@krizaka/ui/avatar";

const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#3b82f6"/>' +
      '<circle cx="40" cy="31" r="14" fill="#dbeafe"/><path d="M12 80a28 24 0 0 1 56 0z" fill="#dbeafe"/></svg>',
  );

// `max={3}`: the others become `+n`.
export default function AvatarGroup() {
  return (
    <Avatar.Group max={3} size="sm">
      <Avatar size="sm" src={PORTRAIT} alt="Oussama" />
      <Avatar size="sm" fallback="LM" />
      <Avatar size="sm" fallback="SK" />
      <Avatar size="sm" fallback="JD" />
      <Avatar size="sm" fallback="AR" />
    </Avatar.Group>
  );
}
