import React from "react";

import type { BrandId } from "../marks/ProductLogo";
import { KrizakaMark } from "./KrizakaMark";
import type { NativeMarkProps } from "./mark-motion";
import { OrazakaMark } from "./OrazakaMark";
import { OrochiaMark } from "./OrochiaMark";
import { YasakiaMark } from "./YasakiaMark";
import { YororisMark } from "./YororisMark";

/** The mark of a Krizaka brand by id, for React Native — the counterpart of the web `ProductLogo`. */
export function ProductMark({ id, ...props }: NativeMarkProps & { id: BrandId | "yazakia" }) {
  if (id === "krizaka") return <KrizakaMark {...props} />;
  if (id === "orazaka") return <OrazakaMark {...props} />;
  if (id === "yasakia" || id === "yazakia") return <YasakiaMark {...props} />;
  if (id === "yororis") return <YororisMark {...props} />;
  return <OrochiaMark {...props} />;
}
