import { ServiceCard } from "@krizaka/ui/service-card";

// `density="list"`: the same card in one column, for a menu of services.
export default function ServiceCardIndexList() {
  return (
    <div className="grid max-w-2xl gap-4">
      <ServiceCard variant="index" density="list" name="Solo walk" duration="30 min" capacity="1 dog" price="$22.00" description="One dog, one walker." actionLabel="Book" href="#book" />
      <ServiceCard variant="index" density="list" name="Group walk" duration="60 min" capacity="Up to 5 dogs" price="$22.00" actionLabel="Book" href="#book" />
    </div>
  );
}
