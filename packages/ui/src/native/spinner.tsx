import * as React from "react";
import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

import { useTheme } from "./theme";

export type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  /** The accessible name of the wait, e.g. "Loading" — passed translated. */
  label: string;
  size?: "sm" | "md" | "lg";
};

/** An indeterminate wait: the platform's activity indicator in the accent, named by `label`. */
export function Spinner({ label, size = "md", ...props }: SpinnerProps) {
  const { theme } = useTheme();
  return (
    <ActivityIndicator
      accessible
      role="progressbar"
      aria-label={label}
      {...props}
      size={size === "lg" ? "large" : "small"}
      color={theme.accent}
      style={[size === "sm" ? { transform: [{ scale: 0.75 }] } : null, props.style]}
    />
  );
}
