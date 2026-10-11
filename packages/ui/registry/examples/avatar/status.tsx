import { Avatar } from "@krizaka/ui/avatar";

// `status`: online (a green dot) or away (an amber ring) — decorative, so the words stay next to it.
export default function AvatarStatus() {
  return (
    <ul className="grid gap-3">
      <li className="flex items-center gap-3">
        <Avatar status="online" fallback="EB" />
        <span className="text-sm text-fg">
          Elena Ben Ali <span className="text-fg-secondary">· online</span>
        </span>
      </li>
      <li className="flex items-center gap-3">
        <Avatar status="away" fallback="AM" />
        <span className="text-sm text-fg">
          Alex Martin <span className="text-fg-secondary">· away</span>
        </span>
      </li>
    </ul>
  );
}
