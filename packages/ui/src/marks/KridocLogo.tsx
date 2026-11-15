import { ProductLogo } from "./ProductLogo";
import type { MarkProps } from "./shared";

/**
 * @deprecated Use `<ProductLogo id="kridoc" />`: Kridoc is drawn by `ProductLogo` like every product (mark C, the crane).
 * An alias kept so no consumer breaks; removed in the next major.
 */
export function KridocLogo(props: Readonly<MarkProps>) {
  return <ProductLogo id="kridoc" {...props} />;
}
