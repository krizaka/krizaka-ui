import { ShopFrame } from "@krizaka/ui/shop";
import { demoReel } from "@krizaka/ui/shop/demo";
import { VideoSection } from "@krizaka/ui/shop/video";

// Another channel's reels, each behind its own button.
export default function ShopVideoShorts() {
  const play = { tiktok: "Load TikTok and play", "youtube-shorts": "Load YouTube and play", instagram: "Load Instagram and play" };
  return (
    <ShopFrame>
      <VideoSection variant="shorts" title="Reels" reels={[demoReel, { ...demoReel, id: "r2", title: "Colour day" }, { ...demoReel, id: "r3", title: "Cut and blow-dry" }]} playLabels={play} />
    </ShopFrame>
  );
}
