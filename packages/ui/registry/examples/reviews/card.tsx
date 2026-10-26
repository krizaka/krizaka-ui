import { ReviewCard } from "@krizaka/ui/reviews";

// One review: first name and initial, the month, the service, the rating, the words — and the owner's reply, indented.
export default function ReviewsCard() {
  return (
    <div className="max-w-md">
      <ReviewCard
        author="Camille L."
        date="octobre 2026"
        dateTime="2026-10"
        service="Coupe femme"
        rating={5}
        ratingText="5 sur 5"
        text="Une coupe exactement comme je l'imaginais, et un salon où l'on se sent chez soi."
        reply={{ label: "Réponse du salon", author: "Maëlle", text: "Merci Camille, à très bientôt !" }}
      />
    </div>
  );
}
