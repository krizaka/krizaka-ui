import { AkinazaLogo } from "./AkinazaLogo";
import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import type { MarkProps } from "./shared";
import { YomizakaLogo } from "./YomizakaLogo";

/** A Krizaka brand: the company and its three products. */
export type BrandId = "krizaka" | "orazaka" | "yomizaka" | "akinaza";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. */
export function ProductLogo({ id, ...props }: MarkProps & { /** The brand: `krizaka`, `orazaka`, `yomizaka` or `akinaza`. */ id: BrandId }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "orazaka") return <OrazakaLogo {...props} />;
  if (id === "yomizaka") return <YomizakaLogo {...props} />;
  return <AkinazaLogo {...props} />;
}
