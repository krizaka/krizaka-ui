import { KrizakaLogo } from "./KrizakaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import { OrochiaLogo } from "./OrochiaLogo";
import type { MarkProps } from "./shared";
import { YasakiaLogo } from "./YasakiaLogo";
import { YororisLogo } from "./YororisLogo";

export type BrandId = "krizaka" | "orazaka" | "orochia" | "yasakia" | "yororis";

/** The mark of a Krizaka brand by id — for navigation, cards and lists driven by data. */
export function ProductLogo({ id, ...props }: MarkProps & { /** The brand: `krizaka`, `orazaka`, `orochia`, `yasakia` or `yororis` (`yazakia`, deprecated: the old name of `yasakia`). */ id: BrandId | "yazakia" }) {
  if (id === "krizaka") return <KrizakaLogo {...props} />;
  if (id === "orazaka") return <OrazakaLogo {...props} />;
  if (id === "yasakia" || id === "yazakia") return <YasakiaLogo {...props} />;
  if (id === "yororis") return <YororisLogo {...props} />;
  return <OrochiaLogo {...props} />;
}
