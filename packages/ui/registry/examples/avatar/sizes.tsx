import { Avatar } from "@krizaka/ui/avatar";

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="xs" fallback="OA" />
      <Avatar size="sm" fallback="OA" />
      <Avatar size="md" fallback="OA" />
      <Avatar size="lg" fallback="OA" />
      <Avatar size="xl" fallback="OA" />
    </div>
  );
}
