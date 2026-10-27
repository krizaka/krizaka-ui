import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { GallerySection } from "@krizaka/ui/shop/gallery";

// Gallery · mosaic: the shop's own photos, each once.
export default function ShopGalleryMosaic() {
  return (
    <ShopFrame>
      <GallerySection variant="mosaic" title="Inside the salon" label="Photos of the salon" photos={demoSalon.photos} />
    </ShopFrame>
  );
}
