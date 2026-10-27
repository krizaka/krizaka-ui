import { Button } from "@krizaka/ui/button";
import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { HeroSection } from "@krizaka/ui/shop/hero";

// Hero · poster. The shop's name is the page's h1; the first image is the page's LCP.
export default function ShopHeroPoster() {
  const { name, eyebrow, promise, cover } = demoSalon;
  return (
    <ShopFrame>
      <HeroSection variant="poster" title={name} eyebrow={eyebrow} lead={promise} cover={cover} actions={<Button variant="primary" size="lg">Book</Button>} />
    </ShopFrame>
  );
}
