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
   * The code name line under the endorsement — « code name: yomizaka » / « nom de code : yomizaka », worded by the app from its
   * messages. Pass it on a development deployment only, so a person can tell the host (`yomizaka`) from the screen (« Verikora »);
   * leave it out in production. The library holds no words.
   */
  codeName?: string;
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
function textSize(size: number): string {
  if (size >= 64) return "text-2xl";
  if (size >= 40) return "text-lg";
  return "text-base";
}

/** The small code-name line of a lockup: for the bars that draw their own lockup markup, so the line looks the same everywhere. */
export function CodeNameLine({ children, className }: Readonly<{ children: string; className?: string }>) {
  return (
    <span className={cx("font-mono text-xs text-fg-secondary", className)} data-code-name="">
      {children}
    </span>
  );
}

export function ProductLockup({ id, name, endorsement, codeName, size = 32, animated = true, layout = "stacked", className }: Readonly<ProductLockupProps>) {
  const text = textSize(size);
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)} data-brand={id}>
      {id === "kachizaka" ? <KridocLogo size={size} animated={animated} /> : <ProductLogo id={id} size={size} animated={animated} />}
      <span className={cx("flex leading-tight", layout === "stacked" ? "flex-col" : "items-baseline gap-1.5")}>
        <span className={cx("font-semibold tracking-tight text-fg", text)}>{name}</span>
        <span className="text-xs text-fg-secondary">{endorsement}</span>
        {codeName ? <CodeNameLine>{codeName}</CodeNameLine> : null}
      </span>
    </span>
  );
}
