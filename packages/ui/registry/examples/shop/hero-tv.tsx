import { Button } from "@krizaka/ui/button";
import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { HeroSection } from "@krizaka/ui/shop/hero";

// Hero · tv: the sign is the h1, the shop's latest video plays in the cabinet (a still here: the demo has no clip).
export default function ShopHeroTv() {
  const { name, promise, cover } = demoSalon;
  return (
    <ShopFrame density="airy">
      <HeroSection variant="tv" title={name} lead={promise} actions={<Button variant="primary" size="lg">Book</Button>} tv={{ src: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9-en.9391096007.mp4", poster: cover.src, title: "Latest video", channel: "CH 3 · Saint-Henri" }} />
    </ShopFrame>
  );
}
