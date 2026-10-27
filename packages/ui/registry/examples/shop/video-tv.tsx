import { ShopFrame } from "@krizaka/ui/shop";
import { demoReel } from "@krizaka/ui/shop/demo";
import { VideoSection } from "@krizaka/ui/shop/video";

// The shop's latest reel in the old TV: a platform's short is behind a button, nothing is requested before the click.
export default function ShopVideoTv() {
  return (
    <ShopFrame density="airy">
      <VideoSection title="Latest from the salon" reels={[demoReel]} cabinet="portable" channel="CH 3 · Saint-Henri" playLabels={{ tiktok: "Load TikTok and play", "youtube-shorts": "Load YouTube and play", instagram: "Load Instagram and play" }} notice="TikTok will receive your address when you press play." aside={<p className="m-0 max-w-sm text-fg-secondary">Press play to watch. We only load TikTok when you ask.</p>} />
    </ShopFrame>
  );
}
