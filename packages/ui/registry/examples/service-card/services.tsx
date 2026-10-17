import { CardGrid } from "@krizaka/ui/card-grid";
import { ServiceCard } from "@krizaka/ui/service-card";

// A shop's services: duration, capacity, price, what is included, one way in each. « Popular » only from real bookings.
export default function ServiceCardServices() {
  return (
    <CardGrid>
      <ServiceCard name="Solo walk" duration="30 min" capacity="1 dog" price="$22.00" description="One dog, one walker, at your pace." included={["Fresh water and a towel-down", "A note and a photo after"]} actionLabel="Book" href="#book" tag="Popular" />
      <ServiceCard name="Group walk" duration="60 min" capacity="Up to 5 dogs" priceFrom="From" price="$22.00" description="Small packs of dogs that get along." included={["Meet-and-greet first", "Pick-up at your door"]} actionLabel="Book" href="#book" />
    </CardGrid>
  );
}
