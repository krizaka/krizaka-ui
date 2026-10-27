import { ShopFrame } from "@krizaka/ui/shop";
import { demoReel } from "@krizaka/ui/shop/demo";
import { SocialSection } from "@krizaka/ui/shop/social";

// The latest reel behind a button: the frame is added only after the click.
export default function ShopSocialFacade() {
  return (
    <ShopFrame>
      <SocialSection variant="facade" title="Latest reel" links={[{ id: "t", platform: demoReel.platform, url: demoReel.url }]} reelTitle={demoReel.title} playLabels={{ tiktok: "Load TikTok and play", "youtube-shorts": "Load YouTube and play", instagram: "Load Instagram and play" }} />
    </ShopFrame>
  );
}
