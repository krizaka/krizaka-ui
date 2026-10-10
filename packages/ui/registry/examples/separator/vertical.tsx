import { Separator } from "@krizaka/ui/separator";

// `decorative={false}`: a real separator, read by assistive technology.
export default function SeparatorVertical() {
  return (
    <div className="flex h-6 items-center gap-3 text-sm text-fg-secondary">
      <span>Videos</span>
      <Separator orientation="vertical" decorative={false} />
      <span>Live</span>
      <Separator orientation="vertical" decorative={false} />
      <span>Shop</span>
    </div>
  );
}
