import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import { OrochiaLogo } from "./OrochiaLogo";
import type { MarkProps } from "./shared";
import { YazakiaLogo } from "./YazakiaLogo";
import { YororisLogo } from "./YororisLogo";

export type BrandId = "krizaka" | "orazaka" | "orochia" | "yazakia" | "yororis";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. */
export function ProductLogo({ id, ...props }: MarkProps & { /** The brand: `krizaka`, `orazaka`, `orochia`, `yazakia` or `yororis`. */ id: BrandId }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "orazaka") return <OrazakaLogo {...props} />;
  if (id === "yazakia") return <YazakiaLogo {...props} />;
  if (id === "yororis") return <YororisLogo {...props} />;
  return <OrochiaLogo {...props} />;
}
