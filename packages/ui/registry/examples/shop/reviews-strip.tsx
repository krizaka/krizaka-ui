import { ShopFrame } from "@krizaka/ui/shop";
import { demoReviews } from "@krizaka/ui/shop/demo";
import { ReviewsSection } from "@krizaka/ui/shop/reviews";

// Reviews · strip. Nothing is drawn under the host's minimum of verified reviews (5 here, 38 verified).
export default function ShopReviewsStrip() {
  return (
    <ShopFrame>
      <ReviewsSection variant="strip" title="What clients say" summary={demoReviews.summary} reviews={demoReviews.reviews} count={2} />
    </ShopFrame>
  );
}
