import React from "react";

import type { BrandId } from "../marks/ProductLogo";
import { FoliovivMark } from "./FoliovivMark";
import { KrizakaMark } from "./KrizakaMark";
import type { NativeMarkProps } from "./mark-motion";
import { SovkoraMark } from "./SovkoraMark";
import { VerikoraMark } from "./VerikoraMark";

/** The mark of a Krizaka brand by id, for React Native — the counterpart of the web `ProductLogo`. */
export function ProductMark({ id, ...props }: NativeMarkProps & { id: BrandId }) {
  if (id === "krizaka") return <KrizakaMark {...props} />;
  if (id === "sovkora") return <SovkoraMark {...props} />;
  if (id === "verikora") return <VerikoraMark {...props} />;
  return <FoliovivMark {...props} />;
}
