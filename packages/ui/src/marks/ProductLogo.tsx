import { AkinazaLogo } from "./AkinazaLogo";
import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import type { MarkProps } from "./shared";
import { YomizakaLogo } from "./YomizakaLogo";

/**
 * A Krizaka brand by its code name: the company and its three products — sold as Verikora (`yomizaka`), Folioviv
 * (`akinaza`) and Sovkora (`orazaka`). It also keys the brand palettes (maps, forms, loaders).
 */
export type BrandId = "krizaka" | "orazaka" | "yomizaka" | "akinaza";

/** A mark by its code name (the ids of `@krizaka/org`'s `brands`): a brand, or Kridoc — the managed storage (`kachizaka`), which has a mark and no palette of its own. */
export type MarkId = BrandId | "kachizaka";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. Kridoc is drawn by `ProductLockup` or `KridocLogo`: keeping it out of here keeps the bar light (krizaka-ui#837). */
export function ProductLogo({ id, ...props }: MarkProps & { /** The brand: `krizaka`, `orazaka`, `yomizaka` or `akinaza`. */ id: BrandId }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "orazaka") return <OrazakaLogo {...props} />;
  if (id === "yomizaka") return <YomizakaLogo {...props} />;
  return <AkinazaLogo {...props} />;
}
