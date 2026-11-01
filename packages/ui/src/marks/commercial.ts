import { AkinazaLogo } from "./AkinazaLogo";
import { OrazakaLogo } from "./OrazakaLogo";
import { YomizakaLogo } from "./YomizakaLogo";

/*
 * The marks under the commercial names (krizaka-internal#2035): a product keeps its bird and its mark — only the name the
 * customer reads changes. `YomizakaLogo`, `AkinazaLogo` and `OrazakaLogo` stay (code names, for internal tools) until the
 * code-name guard is required everywhere (krizaka-internal#2036); customer surfaces import these.
 */

/** Verikora's mark (code name yomizaka): the owl, « the watch ». */
export const VerikoraLogo = YomizakaLogo;
/** Folioviv's mark (code name akinaza): the beaver. */
export const FoliovivLogo = AkinazaLogo;
/** Sovkora's mark (code name orazaka): the engine. */
export const SovkoraLogo = OrazakaLogo;
