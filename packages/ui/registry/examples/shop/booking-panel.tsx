import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";

// The closing call of the page.
export default function ShopBookingPanel() {
  return (
    <ShopFrame>
      <BookingSection variant="panel" label="Book" title="Ready when you are" body="Choose a time at Salon Cèdre & Ciseaux in a few taps. Pay at the shop." href="#book" actionLabel="Book" />
    </ShopFrame>
  );
}
