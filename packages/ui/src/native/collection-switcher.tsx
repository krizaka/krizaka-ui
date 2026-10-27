// CollectionSwitcher on React Native: the list or the nesting (indented rows), the default collection marked and not
// removable, the current one held by the route. In `entity` mode a compact button opens the list in a sheet-like panel.
import * as React from "react";
import { Pressable, View, type ViewProps } from "react-native";

import { type CollectionItem, collectionTree, isRemovable } from "../collection-switcher/tree";
import { Avatar } from "./avatar";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type CollectionSwitcherProps = Omit<ViewProps, "children"> & {
  /** The collections, flat; `parentId` nests them in the `tree` layout. */
  collections: readonly CollectionItem[];
  /** The current one (read from the route), or `null`. */
  value: string | null;
  /** The viewer chooses a collection: navigate. */
  onValueChange?: (id: string) => void;
  /** The accessible name (“Collections”), passed translated. */
  label: string;
  /** `list` (default) or `tree` (indented by `parentId`). */
  layout?: "list" | "tree";
  /** `collection` (default), or `entity`: a compact button that opens the list, to switch shop or studio. */
  mode?: "collection" | "entity";
  /** The mark on the default collection (“Default”), passed translated. */
  defaultLabel: string;
  /** Removes a collection — never offered on the default one. */
  onRemove?: (id: string) => void;
  /** The remove button's accessible name (“Remove Archive”), passed translated. */
  removeLabel?: (name: string) => string;
  /** Adds a collection: a row at the end. */
  onCreate?: () => void;
  /** The create row's words, passed translated. */
  createLabel?: string;
};

type Flat = { item: CollectionItem; depth: number };

function flatten(items: readonly CollectionItem[], layout: "list" | "tree"): Flat[] {
  if (layout === "list") return items.map((item) => ({ item, depth: 0 }));
  const out: Flat[] = [];
  const walk = (branches: ReturnType<typeof collectionTree>, depth: number) =>
    branches.forEach((b) => {
      out.push({ item: b.item, depth });
      walk(b.children, depth + 1);
    });
  walk(collectionTree(items), 0);
  return out;
}

function Rows({ rows, props, close }: { rows: Flat[]; props: CollectionSwitcherProps; close?: () => void }) {
  const { theme } = useTheme();
  const { value, onValueChange, defaultLabel, onRemove, removeLabel, onCreate, createLabel } = props;
  return (
    <View style={{ rowGap: 2 }}>
      {rows.map(({ item, depth }) => {
        const current = item.id === value;
        return (
          <View key={item.id} style={{ flexDirection: "row", alignItems: "center", paddingStart: depth * 16 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: current }}
              onPress={() => {
                onValueChange?.(item.id);
                close?.();
              }}
              style={{ flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", columnGap: 8, paddingHorizontal: 8, borderRadius: 8, backgroundColor: current ? theme.surface2 : "transparent" }}
            >
              {item.avatar ? <Avatar size="xs" alt="" {...item.avatar} /> : null}
              <Txt style={{ flex: 1, fontWeight: current ? "600" : "400" }} numberOfLines={1}>{item.name}</Txt>
              {item.isDefault ? <Txt variant="caption" tone="secondary">{defaultLabel}</Txt> : null}
              {item.count !== undefined ? <Txt variant="caption" tone="muted">{item.count}</Txt> : null}
            </Pressable>
            {onRemove && isRemovable(item) ? (
              <Pressable accessibilityRole="button" accessibilityLabel={removeLabel?.(item.name) ?? item.name} onPress={() => onRemove(item.id)} style={{ minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" }}>
                <Txt tone="muted">×</Txt>
              </Pressable>
            ) : null}
          </View>
        );
      })}
      {onCreate ? (
        <Pressable accessibilityRole="button" onPress={() => { onCreate(); close?.(); }} style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 8 }}>
          <Txt tone="secondary">+ {createLabel}</Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

/** The collections of a workspace — or the shops of an account — to move between; the default one marked and never removable. */
export function CollectionSwitcher(props: CollectionSwitcherProps) {
  const { collections, label, layout = "list", mode = "collection", value, style, ...rest } = props;
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const rows = React.useMemo(() => flatten(collections, layout), [collections, layout]);
  const view = { ...props };
  const domProps = { ...rest } as ViewProps;
  for (const key of ["onValueChange", "defaultLabel", "onRemove", "removeLabel", "onCreate", "createLabel"] as const) delete (domProps as Record<string, unknown>)[key];
  if (mode === "collection") {
    return (
      <View {...domProps} accessibilityLabel={label} style={style}>
        <Rows rows={rows} props={view} />
      </View>
    );
  }
  const current = collections.find((c) => c.id === value);
  return (
    <View {...domProps} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={current ? `${current.name}, ${label}` : label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={{ minHeight: 44, flexDirection: "row", alignItems: "center", columnGap: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.borderControl, backgroundColor: theme.surface1 }}
      >
        {current?.avatar ? <Avatar size="xs" alt="" {...current.avatar} /> : null}
        <Txt style={{ flex: 1 }} numberOfLines={1}>{current?.name ?? label}</Txt>
        <Txt tone="muted" aria-hidden importantForAccessibility="no">{open ? "▴" : "▾"}</Txt>
      </Pressable>
      {open ? (
        <View style={{ marginTop: 4, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: theme.borderDefault, backgroundColor: theme.surface2 }}>
          <Rows rows={rows} props={view} close={() => setOpen(false)} />
        </View>
      ) : null}
    </View>
  );
}
