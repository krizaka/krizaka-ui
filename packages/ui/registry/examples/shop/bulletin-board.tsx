import { ShopFrame } from "@krizaka/ui/shop";
import { BulletinSection } from "@krizaka/ui/shop/bulletin";
import { demoFlyers } from "@krizaka/ui/shop/demo";

// Pinned notes, newest first, each taken down after its last day: `today` is the shop's, never read from a clock here.
export default function ShopBulletinBoard() {
  return (
    <ShopFrame density="airy">
      <BulletinSection title="News" today="2026-11-04" flyers={demoFlyers} />
    </ShopFrame>
  );
}
