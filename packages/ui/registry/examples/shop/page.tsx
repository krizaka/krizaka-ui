import { Button } from "@krizaka/ui/button";
import { OpeningHours } from "@krizaka/ui/opening-hours";
import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";
import { demoSalon as shop } from "@krizaka/ui/shop/demo";
import { GallerySection } from "@krizaka/ui/shop/gallery";
import { HeroSection } from "@krizaka/ui/shop/hero";
import { ServicesSection } from "@krizaka/ui/shop/services";

// A compact salon page: the poster, the next free times, the menu beside the hours, a filmstrip, the closing call.
export default function ShopPage() {
  const hours = (
    <>
      <OpeningHours label="Hours" days={shop.hours} today="3" status={shop.status} />
      <p className="m-0 text-[13px] text-fg-secondary">{shop.address} · <a className="text-fg-accent underline" href="tel:5145550110">{shop.phone}</a></p>
    </>
  );
  return (
    <ShopFrame preset={shop.preset} density="compact">
      <HeroSection title={shop.name} eyebrow={shop.eyebrow} lead={shop.promise} cover={shop.cover} actions={<Button variant="primary" size="lg">Book</Button>} />
      <BookingSection label="Next free times" times={shop.times} href="#book" actionLabel="All times" />
      <ServicesSection title="Services" lead="Prices before taxes. Pick one, then the time." services={shop.services} chooseLabel="Choose" popularLabel="Popular" aside={hours} />
      <GallerySection variant="filmstrip" title="Inside the salon" label="Photos of the salon" photos={shop.photos} />
      <BookingSection variant="panel" label="Book" title="Ready when you are" body="Choose a time in a few taps. Pay at the shop." href="#book" actionLabel="Book" />
    </ShopFrame>
  );
}
