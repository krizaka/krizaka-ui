import { Badge } from "@krizaka/ui/badge";

// On a media: the veil and the text are invariant, identical in both themes.
export default function BadgeScrim() {
  return (
    <div className="flex h-24 w-40 items-start bg-media p-2.5">
      <Badge tone="scrim">4K</Badge>
    </div>
  );
}
