import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";

export type PaginationLabels = {
  /** The previous-page button ("Previous page"). */
  previous: string;
  /** The next-page button ("Next page"). */
  next: string;
  /** Where the list stands: `(page, count) => "Page 3 of 12"`. */
  compact: (page: number, pageCount: number) => string;
};

export type PaginationProps = {
  /** Pages mode: the current page, from 1. */
  page?: number;
  /** Pages mode: how many pages. Without it, the pagination is in cursor mode. */
  pageCount?: number;
  /** Pages mode: called with the page asked for. */
  onPageChange?: (page: number) => void;
  /** Cursor mode: whether there is a previous page. */
  hasPrevious?: boolean;
  /** Cursor mode: whether there is a next page. */
  hasNext?: boolean;
  /** Cursor mode: called by the previous button. */
  onPrevious?: () => void;
  /** Cursor mode: called by the next button. */
  onNext?: () => void;
  /** A text between the buttons in cursor mode ("41–60"), or instead of "Page 3 of 12". */
  status?: string;
  /** Disables both buttons (a page is loading). */
  disabled?: boolean;
  /** The words, passed translated. */
  labels: PaginationLabels;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

function Chevron({ direction, color }: { direction: "left" | "right"; color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </Svg>
  );
}

/**
 * Previous / next with where the list stands ("Page 3 of 12"), or the two buttons of a cursor — the web
 * `Pagination` folded, the form a phone's thumb reaches. On a feed, prefer loading more at the end of the list.
 */
export function Pagination({ page = 1, pageCount, onPageChange, hasPrevious, hasNext, onPrevious, onNext, status, disabled, labels, style }: PaginationProps) {
  const { theme, radius } = useTheme();
  const paged = pageCount !== undefined;
  const count = Math.max(1, pageCount ?? 1);
  const current = Math.min(Math.max(1, page), count);
  const canPrevious = !disabled && (paged ? current > 1 : Boolean(hasPrevious));
  const canNext = !disabled && (paged ? current < count : Boolean(hasNext));
  const button = (direction: "left" | "right", enabled: boolean, onPress: (() => void) | undefined, label: string) => (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={!enabled}
      disabled={!enabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderRadius: radius.sm, borderColor: theme.borderDefault, backgroundColor: theme.surface1, opacity: enabled ? (pressed ? 0.8 : 1) : 0.4 },
      ]}
    >
      <Chevron direction={direction} color={theme.textPrimary} />
    </Pressable>
  );
  const text = status ?? (paged ? labels.compact(current, count) : null);
  return (
    <View role="navigation" style={[styles.row, style]}>
      {button("left", canPrevious, paged ? () => onPageChange?.(current - 1) : onPrevious, labels.previous)}
      {text ? (
        <Text aria-live="polite" style={[styles.status, { color: theme.textSecondary }]}>
          {text}
        </Text>
      ) : null}
      {button("right", canNext, paged ? () => onPageChange?.(current + 1) : onNext, labels.next)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  button: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  status: { fontSize: 13, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
