import * as React from "react";
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  RefreshControl,
  SectionList,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { Skeleton } from "./skeleton";
import { SwipeableRow,type SwipeAction } from "./swipeable-row";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type ListItemProps = {
  /** The main line — passed translated. */
  title: string;
  /** A second line (a detail, a date); `descriptionLines` long. */
  description?: string;
  /** Lines of the description before it ends with an ellipsis. Default 2. */
  descriptionLines?: number;
  /** Before the text: an `Avatar`, an icon, a thumbnail. */
  leading?: React.ReactNode;
  /** After the text: a `Badge`, an amount, a `Switch`; a string is written as a caption (a time, a count). */
  trailing?: React.ReactNode;
  /** Shows a chevron: the row opens a screen. */
  chevron?: boolean;
  /** Pressing the row (open what it is about). */
  onPress?: () => void;
  /** A long press (the row's menu: an `ActionSheet`). */
  onLongPress?: () => void;
  /** comfortable (default, 64 points with a description) · compact (44 points: settings, dense lists). */
  density?: "comfortable" | "compact";
  /** Selected (a list in selection mode): checked, and said. */
  selected?: boolean;
  /** Cannot be pressed now. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A row of a list: leading visual, a title and a line, trailing detail, a chevron when it opens a screen. */
export function ListItem({ title, description, descriptionLines = 2, leading, trailing, chevron, onPress, onLongPress, density = "comfortable", selected, disabled, style }: ListItemProps) {
  const { theme } = useTheme();
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <Txt variant="label" numberOfLines={1}>
          {title}
        </Txt>
        {description ? (
          <Txt variant="caption" tone="secondary" numberOfLines={descriptionLines}>
            {description}
          </Txt>
        ) : null}
      </View>
      {trailing !== undefined && trailing !== null ? (
        <View style={styles.trailing}>
          {typeof trailing === "string" || typeof trailing === "number" ? (
            <Txt variant="caption" tone="secondary">
              {trailing}
            </Txt>
          ) : (
            trailing
          )}
        </View>
      ) : null}
      {chevron ? (
        <Svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
          <Path d="m9 5 7 7-7 7" stroke={theme.textMuted} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </>
  );
  const frame = [styles.item, { minHeight: density === "compact" ? 44 : 64, backgroundColor: selected ? theme.accentSoft : theme.surface0 }, disabled ? styles.disabled : null, style];
  if (!onPress && !onLongPress) return <View style={frame}>{content}</View>;
  return (
    <Pressable
      role="button"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [...frame, pressed ? { backgroundColor: theme.surface2 } : null]}
    >
      {content}
    </Pressable>
  );
}

export type ListSection<T> = {
  /** The section's heading — passed translated (“Today”, “Earlier”). */
  title: string;
  /** Its rows. */
  data: readonly T[];
};

export type ListProps<T> = {
  /** The rows (a flat list), or `sections` for a grouped one. */
  data?: readonly T[];
  /** Rows grouped under headings that stick while their rows scroll. */
  sections?: readonly ListSection<T>[];
  /** A stable key per row. */
  keyExtractor: (item: T, index: number) => string;
  /** The row: usually a `ListItem`. */
  renderItem: (item: T, index: number) => React.ReactElement;
  /** The swipe actions of a row (`SwipeableRow`) and its own action for screen readers (`onActivate`); absent: no swipe. */
  swipeActions?: (item: T) => { leading?: readonly SwipeAction[]; trailing?: readonly SwipeAction[]; onActivate?: () => void };
  /** Called by a pull from the top; show `refreshing` until it ends. */
  onRefresh?: () => void;
  /** A refresh is running (the spinner at the top). */
  refreshing?: boolean;
  /** The words of the pull (“Pull to refresh”) — read by screen readers on Android (`title` on iOS). */
  refreshLabel?: string;
  /** The first page is loading: `loadingRows` skeleton rows. */
  loading?: boolean;
  /** How many skeleton rows. Default 6. */
  loadingRows?: number;
  /** Shown when there is no row (an `EmptyState`). */
  empty?: React.ReactNode;
  /** Called near the end of the list: load the next page. */
  onEndReached?: () => void;
  /** Under the last row: a `Loader` while the next page loads, a total. */
  footer?: React.ReactNode;
  /** Above the first row (a header, filters). */
  header?: React.ReactNode;
  /** Hairlines between rows. Default true. */
  separators?: boolean;
  /** The list's accessible name. */
  "aria-label"?: string;
  /** Styles of the scroll view. */
  style?: StyleProp<ViewStyle>;
  /** Styles of the content (padding for a tab bar). */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * A long list, virtualised: rows or sections with sticky headings, pull to refresh, swipe actions, skeleton rows while
 * the first page loads, an empty state, the next page near the end. FlatList and SectionList underneath, themed.
 */
export function List<T>({
  data,
  sections,
  keyExtractor,
  renderItem,
  swipeActions,
  onRefresh,
  refreshing = false,
  refreshLabel,
  loading,
  loadingRows = 6,
  empty,
  onEndReached,
  footer,
  header,
  separators = true,
  "aria-label": label,
  style,
  contentContainerStyle,
}: ListProps<T>) {
  const { theme } = useTheme();
  const row = (item: T, index: number) => {
    const element = renderItem(item, index);
    const actions = swipeActions?.(item);
    return actions && ((actions.leading?.length ?? 0) > 0 || (actions.trailing?.length ?? 0) > 0) ? (
      <SwipeableRow leading={actions.leading} trailing={actions.trailing} onActivate={actions.onActivate}>
        {element}
      </SwipeableRow>
    ) : (
      element
    );
  };
  const refresh = onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} colors={[theme.accent]} progressBackgroundColor={theme.surface2} title={refreshLabel} titleColor={theme.textSecondary} />
  ) : undefined;
  const separator = separators ? () => <View style={[styles.separator, { backgroundColor: theme.borderSubtle }]} /> : undefined;
  const skeletons = loading ? (
    <View role="progressbar" aria-busy accessible aria-label={label} style={styles.skeletons}>
      {Array.from({ length: loadingRows }, (_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <Skeleton shape="circle" width={40} height={40} />
          <View style={styles.skeletonText}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="85%" height={12} />
          </View>
        </View>
      ))}
    </View>
  ) : null;
  const common = {
    refreshControl: refresh,
    onEndReached,
    onEndReachedThreshold: 0.4,
    ListHeaderComponent: header ? <>{header}</> : null,
    ListFooterComponent: footer ? <>{footer}</> : null,
    ListEmptyComponent: loading ? skeletons : empty ? <>{empty}</> : null,
    ItemSeparatorComponent: separator,
    style: [{ backgroundColor: theme.surface0 }, style],
    contentContainerStyle: [styles.content, contentContainerStyle],
    "aria-label": label,
  };
  if (sections) {
    return (
      <SectionList
        {...common}
        sections={loading ? [] : sections.map((s) => ({ title: s.title, data: s.data as T[] }))}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => row(item, index)}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.surface1, borderBottomColor: theme.borderSubtle }]}>
            <Txt variant="caption" tone="secondary" role="heading" style={styles.sectionTitle}>
              {section.title}
            </Txt>
          </View>
        )}
      />
    );
  }
  const render: ListRenderItem<T> = ({ item, index }) => row(item, index);
  return <FlatList {...common} data={loading ? [] : (data as T[] | undefined)} keyExtractor={keyExtractor} renderItem={render} />;
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  leading: { alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: 2 },
  trailing: { alignItems: "flex-end", justifyContent: "center", gap: 2 },
  disabled: { opacity: 0.45 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  content: { flexGrow: 1 },
  sectionHeader: { paddingHorizontal: 16, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  sectionTitle: { fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  skeletons: { paddingVertical: 8 },
  skeletonRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  skeletonText: { flex: 1, gap: 8 },
});
