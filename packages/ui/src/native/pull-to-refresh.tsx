import { RefreshControl, type RefreshControlProps } from "react-native";

import { useTheme } from "./theme";

export type PullToRefreshProps = Omit<RefreshControlProps, "colors" | "tintColor" | "progressBackgroundColor" | "titleColor" | "title"> & {
  /** The words of the pull (“Pull to refresh”) — passed translated; shown on iOS under the spinner. */
  label?: string;
};

/**
 * The platform's pull to refresh in the theme's accent: the `refreshControl` of a ScrollView or a FlatList. `List`
 * draws it already with `onRefresh`.
 */
export function PullToRefresh({ label, ...props }: PullToRefreshProps) {
  const { theme } = useTheme();
  return <RefreshControl {...props} tintColor={theme.accent} colors={[theme.accent]} progressBackgroundColor={theme.surface2} title={label} titleColor={theme.textSecondary} />;
}
