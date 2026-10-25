// Deprecated (krizaka-ui#393): the light that followed the pointer over the cards is retired — the family's hover is
// quiet (a border and a surface step, no movement, no light). The exports stay so nothing breaks; they do nothing.
import type * as React from "react";

import { warnDeprecated } from "../deprecated";

/** @deprecated Since 3.31: no card carries it any more. */
export const POINTER_LIGHT_TARGET = "[data-kz-light]";

/** @deprecated Since 3.31 (krizaka-ui#393): does nothing. Removed in 4.0. */
export function usePointerLight(_ref: React.RefObject<HTMLElement | null>, _target: string = POINTER_LIGHT_TARGET): void {
  warnDeprecated("pointer-light", "3.31.0");
}

export type PointerLightProps = {
  /**
   * Ignored.
   * @default "[data-kz-light]"
   */
  target?: string;
};

/** @deprecated Since 3.31 (krizaka-ui#393): renders an empty hidden span and nothing else. Remove it. Removed in 4.0. */
export function PointerLight(_props: PointerLightProps) {
  warnDeprecated("pointer-light", "3.31.0");
  return <span hidden />;
}
