import React from "react";

import type { BrandId } from "../marks/ProductLogo";
import { AkinazaMark } from "./AkinazaMark";
import { KrizakaMark } from "./KrizakaMark";
import type { NativeMarkProps } from "./mark-motion";
import { OrazakaMark } from "./OrazakaMark";
import { YomizakaMark } from "./YomizakaMark";

/** The mark of a Krizaka brand by id, for React Native — the counterpart of the web `ProductLogo`. */
export function ProductMark({ id, ...props }: NativeMarkProps & { id: BrandId }) {
  if (id === "krizaka") return <KrizakaMark {...props} />;
  if (id === "orazaka") return <OrazakaMark {...props} />;
  if (id === "yomizaka") return <YomizakaMark {...props} />;
  return <AkinazaMark {...props} />;
}
