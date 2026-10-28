import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";
import { demoPhoto } from "@krizaka/ui/shop/demo";

// A closed day: the call shows the next opening's first free time (the host resolves it), never an empty bar.
export default function ShopBookingClosingClosed() {
  return (
    <ShopFrame>
      <BookingSection
        variant="closing"
        label="Book"
        title="Closed today, open tomorrow at 9 am"
        photo={demoPhoto("salon-chair", "The leather chair by the window")}
        nextTimeLabel="Next free time"
        nextTime={{ id: "t1", label: "Tomorrow 9:00 am", href: "#t1" }}
        href="#book"
        actionLabel="Book"
        secondary={{ label: "Directions", href: "#visit" }}
      />
    </ShopFrame>
  );
}
