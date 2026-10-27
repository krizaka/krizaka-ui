import { ShopFrame } from "@krizaka/ui/shop";
import { demoStory } from "@krizaka/ui/shop/demo";
import { StorySection } from "@krizaka/ui/shop/story";

// The owner's face, a paragraph, a way to call.
export default function ShopStoryOwner() {
  return (
    <ShopFrame>
      <StorySection variant="owner" title="Who we are" body={demoStory.body} owner={demoStory.owner} actions={<a className="text-fg-accent underline" href="tel:5145550110">Call Jade</a>} />
    </ShopFrame>
  );
}
