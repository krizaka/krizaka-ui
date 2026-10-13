import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type DescriptionItem = {
  /** The term (“Status”, “Credits”) — passed translated. */
  term: string;
  /** The value: text, a `Badge`. */
  details: React.ReactNode;
  /** A line under the value (a date, a unit). */
  hint?: string;
  /** A stable key, when the terms are not unique. */
  id?: string;
};

export type DescriptionListProps = {
  /** The pairs, in reading order. */
  items: readonly DescriptionItem[];
  /** stacked (default) · inline (term left, value right: a receipt) · grid (cards, two per row). */
  layout?: "stacked" | "inline" | "grid";
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Term and value pairs — the web `DescriptionList`: a job's details, a payout's breakdown; each pair read as one. */
export function DescriptionList({ items, layout = "stacked", style }: DescriptionListProps) {
  const { theme, radius } = useTheme();
  return (
    <View role="list" style={[layout === "grid" ? styles.grid : layout === "inline" ? null : styles.stacked, style]}>
      {items.map((item, i) => {
        const value =
          typeof item.details === "string" || typeof item.details === "number" ? (
            <Txt variant={layout === "grid" ? "title" : "body"} style={layout === "inline" ? styles.right : null}>
              {item.details}
            </Txt>
          ) : (
            item.details
          );
        return (
          <View
            key={item.id ?? item.term}
            role="listitem"
            accessible
            style={[
              layout === "inline" ? [styles.inline, i > 0 ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.borderSubtle } : null] : null,
              layout === "grid" ? [styles.card, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.lg }] : null,
            ]}
          >
            <Txt variant="caption" tone="secondary" style={layout === "grid" ? styles.upper : null}>
              {item.term}
            </Txt>
            <View style={layout === "inline" ? styles.valueInline : styles.value}>
              {value}
              {item.hint ? (
                <Txt variant="caption" tone="secondary" style={layout === "inline" ? styles.right : null}>
                  {item.hint}
                </Txt>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stacked: { gap: 14 },
  inline: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 16, paddingVertical: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { flexBasis: "47%", flexGrow: 1, padding: 12, gap: 4, borderWidth: StyleSheet.hairlineWidth },
  upper: { textTransform: "uppercase", letterSpacing: 0.6, fontWeight: "700" },
  value: { gap: 2, marginTop: 2 },
  valueInline: { flexShrink: 1, alignItems: "flex-end", gap: 2 },
  right: { textAlign: "right" },
});
