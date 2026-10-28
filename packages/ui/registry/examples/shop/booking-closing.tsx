import { ShopFrame } from "@krizaka/ui/shop";
import { BookingSection } from "@krizaka/ui/shop/booking";
import { demoPhoto } from "@krizaka/ui/shop/demo";

// The closing call of a look: the shop's photo, the next free time, a primary « Book » and « Call ». Server-rendered: no script.
export default function ShopBookingClosing() {
  return (
    <ShopFrame>
      <BookingSection
        variant="closing"
        label="Book"
        title="Ready when you are"
        body="Choose a time at Salon Cèdre & Ciseaux in a few taps. Pay at the shop."
        photo={demoPhoto("salon-chair", "The leather chair by the window")}
        nextTimeLabel="Next free time"
        nextTime={{ id: "t1", label: "Tomorrow 9:00 am", href: "#t1" }}
        href="#book"
        actionLabel="Book"
        secondary={{ label: "Call", href: "tel:+15145550100" }}
      />
    </ShopFrame>
  );
}
