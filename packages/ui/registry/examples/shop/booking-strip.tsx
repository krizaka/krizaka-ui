import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";
import { demoSalon } from "@krizaka/ui/shop/demo";

// The next free times in one line: one tap each, then the booking page.
export default function ShopBookingStrip() {
  return (
    <ShopFrame>
      <BookingSection label="Next free times" times={demoSalon.times} href="#book" actionLabel="All times" />
    </ShopFrame>
  );
}
