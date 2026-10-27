import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { GallerySection } from "@krizaka/ui/shop/gallery";

// Gallery · grid: the shop's own photos, each once.
export default function ShopGalleryGrid() {
  return (
    <ShopFrame>
      <GallerySection variant="grid" title="Inside the salon" label="Photos of the salon" photos={demoSalon.photos} />
    </ShopFrame>
  );
}
