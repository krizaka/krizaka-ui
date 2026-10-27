import { ShopFrame } from "@krizaka/ui/shop";
import { demoPets } from "@krizaka/ui/shop/demo";
import { GallerySection } from "@krizaka/ui/shop/gallery";

// Gallery · wall: polaroids, a note from a client and the shop's sign, hung the same way every time.
export default function ShopGalleryWall() {
  return (
    <ShopFrame density="airy" preset="pets-carnet">
      <GallerySection variant="wall" title="On the wall" label="The shop's wall" photos={demoPets.photos.slice(0, 4)} sign={demoPets.name} texture="ridge" notes={[{ id: "n1", text: "Rex waits for Maude at the door every morning.", signature: "Chloé" }]} />
    </ShopFrame>
  );
}
