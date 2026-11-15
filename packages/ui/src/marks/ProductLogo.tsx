import { FoliovivLogo } from "./FoliovivLogo";
import { KridocMark } from "./KridocMark";
import { KrizakaLogo } from "./KrizakaLogo";
import type { MarkProps } from "./shared";
import { SovkoraLogo } from "./SovkoraLogo";
import { VerikoraLogo } from "./VerikoraLogo";

/**
 * A Krizaka brand by its id: the company and its three products — Verikora (`verikora`), Folioviv
 * (`folioviv`) and Sovkora (`sovkora`). It also keys the brand palettes (maps, forms, loaders).
 */
export type BrandId = "krizaka" | "sovkora" | "verikora" | "folioviv";

/** A mark by its id (the ids of `@krizaka/org`'s `brands`): a brand, or Kridoc — the managed storage (`kridoc`). */
export type MarkId = BrandId | "kridoc";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data; Kridoc (`kridoc`) is mark C, the crane. */
export function ProductLogo({ id, ...props }: Readonly<MarkProps & { /** The mark: `krizaka`, `sovkora`, `verikora`, `folioviv` or `kridoc`. */ id: MarkId }>) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "sovkora") return <SovkoraLogo {...props} />;
  if (id === "verikora") return <VerikoraLogo {...props} />;
  if (id === "kridoc") return <KridocMark {...props} />;
  return <FoliovivLogo {...props} />;
}
