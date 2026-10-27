import { ShopFrame } from "@krizaka/ui/shop";
import { demoReviews } from "@krizaka/ui/shop/demo";
import { ReviewsSection } from "@krizaka/ui/shop/reviews";

// Reviews · summary-cards. Nothing is drawn under the host's minimum of verified reviews (5 here, 38 verified).
export default function ShopReviewsSummary() {
  return (
    <ShopFrame>
      <ReviewsSection variant="summary-cards" title="What clients say" summary={demoReviews.summary} reviews={demoReviews.reviews} count={2} />
    </ShopFrame>
  );
}
