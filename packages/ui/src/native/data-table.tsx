import * as React from "react";
import { FlatList, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";
import { useTheme } from "./theme";
import { Txt } from "./txt";

type Sortable = string | number | boolean | Date | null | undefined;
export type DataTableSort = { column: string; direction: "ascending" | "descending" } | null;

export type DataTableColumn<T> = {
  /** A key of the column (and of the row, for the default cell and sort). */
  id: string;
  /** The column's name, passed translated: the label of the value in a card. */
  header: string;
  /** What a cell shows. Default: `value(row)`, or `row[id]`. */
  cell?: (row: T) => React.ReactNode;
  /** The value sorted on. Default `row[id]`. */
  value?: (row: T) => Sortable;
  /** Offers the column in the sort row. */
  sortable?: boolean;
  /** In a card: `title` (its heading), `label` (default: “Header  value”), `hidden`. */
  card?: "title" | "label" | "hidden";
};

export type DataTableProps<T> = {
  /** The rows. */
  rows: readonly T[];
  /** The columns, in order. */
  columns: readonly DataTableColumn<T>[];
  /** A stable id per row. */
  getRowId: (row: T) => string;
  /** What the list is (“Jobs”) — its accessible name. */
  caption: string;
  /** The sorted column (controlled), `null` for none. */
  sort?: DataTableSort;
  /** Called when the sort row asks for a new sort (ascending → descending → none). */
  onSortChange?: (sort: DataTableSort) => void;
  /** The words of the sort row (“Sort by”) — shown when a column is sortable. */
  sortLabel?: string;
  /** A checkbox per card. */
  selectable?: boolean;
  /** The ids selected (controlled). */
  selected?: readonly string[];
  /** Called with the new selection. */
  onSelectedChange?: (selected: string[]) => void;
  /** The checkbox's words: `(name) => "Select " + name`. */
  selectLabel?: (name: string) => string;
  /** Pressing a card (open the record). */
  onRowPress?: (row: T) => void;
  /** Loading: skeleton cards. */
  loading?: boolean;
  /** A failure, in place of the cards (an `EmptyState` with a retry). */
  error?: React.ReactNode;
  /** Shown when there is no row. */
  empty?: React.ReactNode;
  /** Under the cards: a `Pagination`, a total. */
  footer?: React.ReactNode;
  /** Styles of the list. */
  style?: StyleProp<ViewStyle>;
};

const compare = (a: Sortable, b: Sortable) => {
  if (a == null || a === "") return b == null || b === "" ? 0 : 1;
  if (b == null || b === "") return -1;
  if (a instanceof Date || b instanceof Date) return Number(a) - Number(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

/**
 * Records as cards — the web `DataTable`'s columns, read on a phone: the title column heads each card, the others are
 * “label  value” lines; sort through a row of choices, select with a checkbox per card, skeletons, an empty and an
 * error state, virtualised (FlatList).
 */
export function DataTable<T>({ rows, columns, getRowId, caption, sort = null, onSortChange, sortLabel, selectable, selected = [], onSelectedChange, selectLabel = (n) => `Select ${n}`, onRowPress, loading, error, empty, footer, style }: DataTableProps<T>) {
  const { theme, radius, haptics } = useTheme();
  const valueOf = (column: DataTableColumn<T>, row: T): Sortable => (column.value ? column.value(row) : ((row as Record<string, unknown>)[column.id] as Sortable));
  const sorted = React.useMemo(() => {
    const column = sort && columns.find((c) => c.id === sort.column);
    if (!column || !onSortChange) return rows;
    const f = sort.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => f * compare(valueOf(column, a), valueOf(column, b)));
  }, [rows, columns, sort, onSortChange]); // eslint-disable-line react-hooks/exhaustive-deps -- valueOf only reads `column`
  const titleColumn = columns.find((c) => c.card === "title") ?? columns[0]!;
  const sortable = columns.filter((c) => c.sortable);
  const chosen = new Set(selected);
  const card = ({ item }: { item: T }) => {
    const id = getRowId(item);
    const name = String(valueOf(titleColumn, item) ?? id);
    const body = (
      <>
        <View style={styles.cardHead}>
          <Txt variant="label" style={styles.flex}>
            {titleColumn.cell ? titleColumn.cell(item) : name}
          </Txt>
          {selectable ? (
            <Checkbox hideLabel label={selectLabel(name)} checked={chosen.has(id)} onCheckedChange={(on) => onSelectedChange?.(on ? [...selected, id] : selected.filter((x) => x !== id))} />
          ) : null}
        </View>
        {columns
          .filter((c) => c !== titleColumn && c.card !== "hidden")
          .map((c) => (
            <View key={c.id} style={styles.line}>
              <Txt variant="caption" tone="secondary">
                {c.header}
              </Txt>
              <View style={styles.value}>{c.cell ? c.cell(item) : <Txt variant="caption">{String(valueOf(c, item) ?? "")}</Txt>}</View>
            </View>
          ))}
      </>
    );
    const frame = [styles.card, { backgroundColor: chosen.has(id) ? theme.accentSoft : theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.lg }];
    return onRowPress ? (
      <Pressable role="button" onPress={() => onRowPress(item)} style={({ pressed }) => [...frame, pressed ? { backgroundColor: theme.surface2 } : null]}>
        {body}
      </Pressable>
    ) : (
      <View style={frame}>{body}</View>
    );
  };
  const sortRow =
    sortable.length > 0 && onSortChange ? (
      <View style={styles.sortRow}>
        {sortLabel ? (
          <Txt variant="caption" tone="secondary">
            {sortLabel}
          </Txt>
        ) : null}
        {sortable.map((c) => {
          const direction = sort?.column === c.id ? sort.direction : null;
          return (
            <Pressable
              key={c.id}
              role="button"
              aria-pressed={Boolean(direction)}
              aria-label={`${c.header}${direction ? `, ${direction}` : ""}`}
              onPress={() => {
                haptics.selection();
                onSortChange(direction === null ? { column: c.id, direction: "ascending" } : direction === "ascending" ? { column: c.id, direction: "descending" } : null);
              }}
              style={[styles.sortChip, { borderColor: direction ? theme.accent : theme.borderDefault, backgroundColor: direction ? theme.accentSoft : "transparent", borderRadius: radius.full }]}
            >
              <Txt variant="caption" style={styles.bold}>
                {c.header}
              </Txt>
              {direction ? (
                <Svg width={12} height={12} viewBox="0 0 24 24" aria-hidden>
                  <Path d={direction === "ascending" ? "M12 19V5M6 11l6-6 6 6" : "M12 5v14M6 13l6 6 6-6"} stroke={theme.textPrimary} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    ) : null;
  const placeholder = loading ? (
    <View style={styles.gap} role="progressbar" aria-busy accessible aria-label={caption}>
      {Array.from({ length: 3 }, (_, i) => (
        <View key={i} style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle, borderRadius: radius.lg }]}>
          <Skeleton width="55%" height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
        </View>
      ))}
    </View>
  ) : error ? (
    <View role="alert">{error}</View>
  ) : (
    <>{empty ?? null}</>
  );
  return (
    <FlatList
      aria-label={caption}
      data={loading || error ? [] : (sorted as T[])}
      keyExtractor={getRowId}
      renderItem={card}
      ListHeaderComponent={sortRow}
      ListEmptyComponent={placeholder}
      ListFooterComponent={footer ? <View style={styles.footer}>{footer}</View> : null}
      contentContainerStyle={styles.gap}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  card: { padding: 14, gap: 6, borderWidth: StyleSheet.hairlineWidth },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  flex: { flex: 1 },
  line: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  value: { flexShrink: 1, alignItems: "flex-end" },
  sortRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 2 },
  sortChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, minHeight: 32, borderWidth: 1 },
  bold: { fontWeight: "700" },
  footer: { marginTop: 4 },
});
