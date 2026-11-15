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

/**
 * The mark of the company or of one of its three products by id, without Kridoc: what the shared chrome (footer, family
 * switch) draws, so the crane's geometry stays out of the typical page's bundle (krizaka-ui#837). `ProductLogo` adds Kridoc.
 */
export function BrandLogo({ id, ...props }: Readonly<MarkProps & { /** The brand: `krizaka`, `sovkora`, `verikora` or `folioviv`. */ id: BrandId }>) {
  const Mark = { krizaka: KrizakaLogo, sovkora: SovkoraLogo, verikora: VerikoraLogo, folioviv: FoliovivLogo }[id];
  return <Mark {...props} />;
}
