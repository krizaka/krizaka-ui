import { ReviewSummary } from "@krizaka/ui/reviews";

// The shop's score as a stamp, the verified count and five meters. Nothing is drawn under the host's `minCount`.
export default function ReviewsSummary() {
  return (
    <ReviewSummary
      score={4.8}
      count={27}
      distribution={[0, 1, 2, 4, 20]}
      minCount={5}
      scoreText="4,8 / 5"
      countText="27 avis vérifiés"
      summaryText="4,8 sur 5, 27 avis vérifiés"
      starText={(stars, n) => `${stars} étoiles : ${n} avis`}
    />
  );
}
