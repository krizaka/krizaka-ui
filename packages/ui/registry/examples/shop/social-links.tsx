import { ShopFrame } from "@krizaka/ui/shop";
import { SocialSection } from "@krizaka/ui/shop/social";

// Plain anchors: a new tab, no referrer, `nofollow`, nothing loaded from the platform.
export default function ShopSocialLinks() {
  return (
    <ShopFrame>
      <SocialSection title="Follow the salon" links={[{ id: "i", platform: "instagram", url: "https://www.instagram.com/salon.cedre" }, { id: "t", platform: "tiktok", url: "https://www.tiktok.com/@salon.cedre" }]} />
    </ShopFrame>
  );
}
