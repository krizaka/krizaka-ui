import { CardGrid } from "@krizaka/ui/card-grid";
import { ServiceCard } from "@krizaka/ui/service-card";

// `variant="index"`: a stamped index card — ruled, straight, a punched hole, the duration and the price as stamps.
export default function ServiceCardIndex() {
  return (
    <CardGrid>
      <ServiceCard variant="index" name="Coupe femme" duration="45 min" price="55,00 $" description="Shampoing, coupe, séchage." included={["Consultation", "Coiffage"]} actionLabel="Choisir" href="#book" />
      <ServiceCard variant="index" name="Couleur" duration="90 min" priceFrom="Dès" price="95,00 $" description="Racines ou couleur complète." actionLabel="Choisir" href="#book" />
    </CardGrid>
  );
}
