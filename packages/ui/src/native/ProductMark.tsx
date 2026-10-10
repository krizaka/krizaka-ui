import React from "react";

import type { BrandId } from "../marks/ProductLogo";
import { KrizakaMark } from "./KrizakaMark";
import type { NativeMarkProps } from "./mark-motion";
import { OrazakaMark } from "./OrazakaMark";
import { OrochiaMark } from "./OrochiaMark";

/** The mark of a Krizaka brand by id, for React Native — the counterpart of the web `ProductLogo`. */
export function ProductMark({ id, ...props }: NativeMarkProps & { id: BrandId }) {
  if (id === "krizaka") return <KrizakaMark {...props} />;
  if (id === "orazaka") return <OrazakaMark {...props} />;
  return <OrochiaMark {...props} />;
}
