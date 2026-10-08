import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import { OrochiaLogo } from "./OrochiaLogo";
import type { MarkProps } from "./shared";

export type BrandId = "krizaka" | "orazaka" | "orochia";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. */
export function ProductLogo({ id, ...props }: MarkProps & { id: BrandId }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "orazaka") return <OrazakaLogo {...props} />;
  return <OrochiaLogo {...props} />;
}
