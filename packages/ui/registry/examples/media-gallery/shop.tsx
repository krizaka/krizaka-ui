import { MediaGallery } from "@krizaka/ui/media-gallery";

const CDN = "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery";

// A shop's own photos: the first is featured, a loop plays while its tile is on screen.
export default function MediaGalleryShop() {
  return (
    <MediaGallery
      label="Photos of the shop"
      items={[
        { id: "a", src: `${CDN}/mtl-snow.e3ecb20e82.webp`, alt: "First snow on the street", caption: "First snow", shape: "wide" },
        { id: "b", src: `${CDN}/tea-pour.d69c3a5700.webp`, alt: "Pouring tea", shape: "wide" },
        { id: "c", src: `${CDN}/desert-camp.78c6c0d26c.webp`, alt: "A camp at blue hour", shape: "wide" },
      ]}
    />
  );
}
