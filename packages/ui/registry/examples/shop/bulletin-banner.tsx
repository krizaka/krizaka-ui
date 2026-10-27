import { ShopFrame } from "@krizaka/ui/shop";
import { BulletinSection } from "@krizaka/ui/shop/bulletin";
import { demoFlyers } from "@krizaka/ui/shop/demo";

// One line of text above the hero — never an image, so the first screen's LCP stays the hero's. The renderer hoists it.
export default function ShopBulletinBanner() {
  return (
    <ShopFrame>
      <BulletinSection variant="banner" title="News" today="2026-10-27" flyers={demoFlyers} />
    </ShopFrame>
  );
}
