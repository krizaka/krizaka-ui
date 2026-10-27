import { ShopFrame } from "@krizaka/ui/shop";
import { demoStory } from "@krizaka/ui/shop/demo";
import { StorySection } from "@krizaka/ui/shop/story";

// A pull quote and a paragraph: the owner's own words.
export default function ShopStoryQuote() {
  return (
    <ShopFrame density="airy">
      <StorySection title="Our story" quote={demoStory.quote} body={demoStory.body} />
    </ShopFrame>
  );
}
