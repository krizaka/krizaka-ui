import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { GallerySection } from "@krizaka/ui/shop/gallery";

// Gallery · filmstrip: the shop's own photos, each once.
export default function ShopGalleryFilmstrip() {
  return (
    <ShopFrame>
      <GallerySection variant="filmstrip" title="Inside the salon" label="Photos of the salon" photos={demoSalon.photos} />
    </ShopFrame>
  );
}
