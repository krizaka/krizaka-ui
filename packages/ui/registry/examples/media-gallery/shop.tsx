import { MediaGallery } from "@krizaka/ui/media-gallery";

// Drawn pictures (data URIs, no network); a shop passes its own photos.
const PIC = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/></svg>`)}`;

// A shop's own photos: the first is featured, a loop plays while its tile is on screen.
export default function MediaGalleryShop() {
  return (
    <MediaGallery
      label="Photos of the shop"
      items={[
        { id: "a", src: PIC("#1d4d3a", "#c87a3a"), alt: "First snow on the street", caption: "First snow", shape: "wide" },
        { id: "b", src: PIC("#33523f", "#8a5a2b"), alt: "Pouring tea", shape: "wide" },
        { id: "c", src: PIC("#27483a", "#d99a56"), alt: "A camp at blue hour", shape: "wide" },
      ]}
    />
  );
}
