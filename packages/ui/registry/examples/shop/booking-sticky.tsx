import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";

// The phone bar: last child of the page, held at the bottom edge; hidden while the page's own « Book » is on screen.
export default function ShopBookingSticky() {
  return (
    <ShopFrame className="min-h-60">
      <p className="m-4 text-sm text-fg-secondary">The page scrolls; on a phone the bar stays at the bottom edge.</p>
      <BookingSection variant="sticky" label="Book" href="#book" actionLabel="Book" />
    </ShopFrame>
  );
}
