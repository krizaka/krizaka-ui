import { ShopGallery, shopGalleryLabelsFr } from "@krizaka/ui/shop-gallery";

// Drawn pictures (data URIs, no network); a shop passes its own photos, with the srcSet of the widths it holds.
const PIC = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/></svg>`)}`;
const ALTS = ["Deux fauteuils près de la fenêtre","Le bar à couleurs","Une coupe fraîche","La lumière du matin","Le coin shampoing","Les outils"];
const photos = ALTS.slice(0, 3).map((alt, i) => ({ id: `p${i}`, src: PIC(`hsl(${(i * 31) % 360} 45% 32%)`, `hsl(${(i * 31 + 50) % 360} 55% 58%)`), alt }));

export default function ShopGalleryThree() {
  return <ShopGallery label="Photos du salon" photos={photos} labels={shopGalleryLabelsFr} />;
}
