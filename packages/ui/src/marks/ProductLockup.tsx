import { cx } from "../cx";
import { KridocLogo } from "./KridocLogo";
import { type MarkId, ProductLogo } from "./ProductLogo";

export interface ProductLockupProps {
  /** The brand by its code name (`yomizaka`): it picks the mark only, never the words. */
  id: MarkId;
  /** The name shown — `displayName(codeName, setting)` of `@krizaka/org`, so the administrator's choice wins (« Verikora »). */
  name: string;
  /** The endorsement under it — `brandOf(codeName).endorsement[locale]` of `@krizaka/org` (« by Krizaka » / « par Krizaka »). */
  endorsement: string;
  /**
   * The mark's size in px; the words follow it (`sm` under 40 px, `md` from 40, `lg` from 64).
   * @default 32
   */
  size?: number;
  /** @default true */
  animated?: boolean;
  /** `inline` puts the endorsement beside the name (a footer line); `stacked` under it (a bar, a hero, an email header). @default "stacked" */
  layout?: "stacked" | "inline";
  className?: string;
}

/**
 * The « Verikora by Krizaka » lockup (krizaka-internal#2035): the product's mark, its name, and the company that endorses
 * it — for heroes, bars, footers, emails and store art. The words are data passed in (from `@krizaka/org` and the app's
 * `brand.displayName` setting), never typed here; the mark is decorative, the name is the text a screen reader reads.
 */
export function ProductLockup({ id, name, endorsement, size = 32, animated = true, layout = "stacked", className }: ProductLockupProps) {
  const text = size >= 64 ? "text-2xl" : size >= 40 ? "text-lg" : "text-base";
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)} data-brand={id}>
      {id === "kachizaka" ? <KridocLogo size={size} animated={animated} /> : <ProductLogo id={id} size={size} animated={animated} />}
      <span className={cx("flex leading-tight", layout === "stacked" ? "flex-col" : "items-baseline gap-1.5")}>
        <span className={cx("font-semibold tracking-tight text-fg", text)}>{name}</span>
        <span className="text-xs text-fg-secondary">{endorsement}</span>
      </span>
    </span>
  );
}
