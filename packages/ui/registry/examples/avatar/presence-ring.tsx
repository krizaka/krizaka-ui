import { Avatar } from "@krizaka/ui/avatar";

// `ring`: the brand's gradient around the avatar — someone live, a new story. Say it in words too.
export default function AvatarPresenceRing() {
  return (
    <div className="flex items-center gap-3">
      <Avatar ring status="online" size="lg" fallback="EB" />
      <div>
        <p className="text-sm font-semibold text-fg">Elena Ben Ali</p>
        <p className="text-xs text-fg-secondary">Live now · 1.2k watching</p>
      </div>
    </div>
  );
}
