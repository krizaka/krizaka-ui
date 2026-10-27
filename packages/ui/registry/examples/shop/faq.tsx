import { ShopFrame } from "@krizaka/ui/shop";
import { demoFaq } from "@krizaka/ui/shop/demo";
import { FaqSection } from "@krizaka/ui/shop/faq";

// Native `details`, and the same answers as FAQPage structured data for search engines.
export default function ShopFaq() {
  return (
    <ShopFrame>
      <FaqSection title="Questions" questions={demoFaq} />
    </ShopFrame>
  );
}
