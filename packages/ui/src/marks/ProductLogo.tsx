import { FoliovivLogo } from "./FoliovivLogo";
import { KrizakaLogo } from "./KrizakaLogo";
import type { MarkProps } from "./shared";
import { SovkoraLogo } from "./SovkoraLogo";
import { VerikoraLogo } from "./VerikoraLogo";

/**
 * A Krizaka brand by its id: the company and its three products — Verikora (`verikora`), Folioviv
 * (`folioviv`) and Sovkora (`sovkora`). It also keys the brand palettes (maps, forms, loaders).
 */
export type BrandId = "krizaka" | "sovkora" | "verikora" | "folioviv";

/** A mark by its id (the ids of `@krizaka/org`'s `brands`): a brand, or Kridoc — the managed storage (`kridoc`), which has a mark and no palette of its own. */
export type MarkId = BrandId | "kridoc";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. Kridoc is drawn by `ProductLockup` or `KridocLogo`: keeping it out of here keeps the bar light (krizaka-ui#837). */
export function ProductLogo({ id, ...props }: MarkProps & { /** The brand: `krizaka`, `sovkora`, `verikora` or `folioviv`. */ id: BrandId }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "sovkora") return <SovkoraLogo {...props} />;
  if (id === "verikora") return <VerikoraLogo {...props} />;
  return <FoliovivLogo {...props} />;
}
