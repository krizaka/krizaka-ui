import { type BrandId, BrandLogo } from "./BrandLogo";
import { KridocMark } from "./KridocMark";
import type { MarkProps } from "./shared";

export type { BrandId } from "./BrandLogo";

/** A mark by its id (the ids of `@krizaka/org`'s `brands`): a brand, or Kridoc — the managed storage (`kridoc`). */
export type MarkId = BrandId | "kridoc";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data; Kridoc (`kridoc`) is mark C, the crane. */
export function ProductLogo({ id, ...props }: Readonly<MarkProps & { /** The mark: `krizaka`, `sovkora`, `verikora`, `folioviv` or `kridoc`. */ id: MarkId }>) {
  if (id === "kridoc") return <KridocMark {...props} />;
  return <BrandLogo id={id} {...props} />;
}
