import * as React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { useTheme } from "./theme";

export type SeparatorProps = ViewProps & {
  /** `horizontal` (default): a line across; `vertical`: a line up a row (give the row its height). */
  orientation?: "horizontal" | "vertical";
  /** Decorative by default (hidden from screen readers); `false` makes it a separator they announce. */
  decorative?: boolean;
  /** Space before and after the line, in points. */
  inset?: number;
};

/** A hairline between rows or groups, in the subtle border role. */
export function Separator({ orientation = "horizontal", decorative = true, inset = 0, style, ...props }: SeparatorProps) {
  const { theme } = useTheme();
  const vertical = orientation === "vertical";
  return (
    <View
      {...(decorative ? { "aria-hidden": true } : { role: "separator" as const, "aria-orientation": orientation })}
      {...props}
      style={[
        vertical ? { width: StyleSheet.hairlineWidth, alignSelf: "stretch", marginHorizontal: inset } : { height: StyleSheet.hairlineWidth, alignSelf: "stretch", marginVertical: inset },
        { backgroundColor: theme.borderSubtle },
        style,
      ]}
    />
  );
}
