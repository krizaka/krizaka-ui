import { FoliovivLogo } from "@krizaka/ui";
import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";

// No photo, no free time: the shop's mark, the title and the primary action alone.
export default function ShopBookingClosingMark() {
  return (
    <ShopFrame>
      <BookingSection variant="closing" label="Book" title="Ready when you are" body="Choose a time in a few taps." mark={<FoliovivLogo size={96} animated={false} />} href="#book" actionLabel="Book" />
    </ShopFrame>
  );
}
