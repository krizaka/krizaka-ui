import * as React from "react";
import { Pressable, type PressableProps, ScrollView, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type ChipSize = "sm" | "md";

type GroupContext = {
  type: "single" | "multiple";
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  /** sm · md (default); in a group, the group's size. */
  size?: ChipSize;
  disabled?: boolean;
};
const ChipGroupContext = React.createContext<GroupContext | null>(null);

type CommonProps = Omit<PressableProps, "children" | "style" | "onPress"> & {
  /** sm · md (default); in a group, the group's size. */
  size?: ChipSize;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
  /** The text (passed translated) or a node (an icon and a text). */
  children: React.ReactNode;
};

type ToggleChipProps = CommonProps & {
  /** Inside `Chip.Group`: the value this chip stands for (required there, ignored alone). */
  value?: string;
  /** Alone: pressed or not (`defaultSelected` uncontrolled), `onSelectedChange` on every press. */
  selected?: boolean;
  /** Uncontrolled: selected at first (alone, outside a group). */
  defaultSelected?: boolean;
  /** Alone: called with the new state when it is pressed. */
  onSelectedChange?: (selected: boolean) => void;
  removable?: false;
};

type RemovableChipProps = CommonProps & {
  /** A static chip (a chosen tag, an applied filter) with a remove button. */
  removable: true;
  /** The accessible name of the remove button — passed translated, e.g. "Remove #night". */
  removeLabel: string;
  /** Called when its remove button is pressed. */
  onRemove: () => void;
};

export type ChipProps = ToggleChipProps | RemovableChipProps;

function Label({ children, color, size }: { children: React.ReactNode; color: string; size: ChipSize }) {
  if (typeof children !== "string" && typeof children !== "number") return <>{children}</>;
  return <Text style={[styles.label, { color, fontSize: size === "sm" ? 12 : 13 }]}>{children}</Text>;
}

/** A selectable pill (`selected` / `onSelectedChange`), an item of `Chip.Group` (`value`), or `removable`. */
function ChipBase(props: ChipProps) {
  const group = React.useContext(ChipGroupContext);
  const { theme, radius } = useTheme();
  const [own, setOwn] = React.useState(props.removable ? false : (props.defaultSelected ?? false));
  const size = props.size ?? group?.size ?? "md";
  const frame = (on: boolean, pressed: boolean): ViewStyle => ({
    height: size === "sm" ? 28 : 36,
    borderRadius: radius.full,
    borderColor: on ? theme.accent : theme.borderDefault,
    backgroundColor: on ? theme.accentSoft : theme.surface1,
    opacity: pressed ? 0.85 : 1,
  });

  if (props.removable) {
    const { removable: _r, removeLabel, onRemove, disabled, size: _s, style, children, ...rest } = props;
    return (
      <View {...rest} style={[styles.base, frame(false, false), disabled ? styles.disabled : null, style]}>
        <Label color={theme.textSecondary} size={size}>
          {children}
        </Label>
        <Pressable role="button" aria-label={removeLabel} disabled={disabled ?? undefined} hitSlop={10} onPress={onRemove} style={styles.remove}>
          <Text style={[styles.cross, { color: theme.textSecondary }]}>×</Text>
        </Pressable>
      </View>
    );
  }

  const { removable: _r, value, selected, defaultSelected: _d, onSelectedChange, disabled: ownDisabled, size: _s, style, children, ...rest } = props;
  if (group && value === undefined) throw new Error("Chip: a chip inside Chip.Group needs a `value`.");
  const on = group ? group.isSelected(value as string) : (selected ?? own);
  const disabled = Boolean(ownDisabled || group?.disabled);
  const press = () => {
    if (group) return group.toggle(value as string);
    if (selected === undefined) setOwn(!on);
    onSelectedChange?.(!on);
  };
  const single = group?.type === "single";
  return (
    <Pressable
      role={single ? "radio" : "checkbox"}
      aria-checked={on}
      aria-disabled={disabled}
      {...rest}
      disabled={disabled}
      onPress={press}
      style={({ pressed }) => [styles.base, frame(on, pressed), disabled ? styles.disabled : null, style]}
    >
      <Label color={on ? theme.textPrimary : theme.textSecondary} size={size}>
        {children}
      </Label>
    </Pressable>
  );
}

type GroupBase = {
  /** sm · md (default); in a group, the group's size. */
  size?: ChipSize;
  disabled?: boolean;
  /** One horizontal scrolling row (a filter bar) instead of wrapping lines. */
  scrollable?: boolean;
  /** The accessible name of the group — passed translated. */
  "aria-label"?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export type ChipGroupProps =
  | (GroupBase & { type: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void })
  | (GroupBase & { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void });

/** A set of chips: `single` (one value, a radio group; pressing the chosen chip keeps it) or `multiple` (toggles). */
function ChipGroup(props: ChipGroupProps) {
  const { size, disabled, scrollable, "aria-label": label, style, children } = props;
  const initial = props.type === "single" ? (props.defaultValue ?? "") : (props.defaultValue ?? []);
  const [own, setOwn] = React.useState<string | string[]>(initial);
  const current = props.value ?? own;
  const context = React.useMemo<GroupContext>(() => {
    const list = Array.isArray(current) ? current : [current];
    return {
      type: props.type,
      size,
      disabled,
      isSelected: (v) => list.includes(v),
      toggle: (v) => {
        const next = props.type === "single" ? v : list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
        if (props.value === undefined) setOwn(next);
        (props.onValueChange as ((value: string | string[]) => void) | undefined)?.(next);
      },
    };
  }, [current, props.type, props.value, props.onValueChange, size, disabled]);
  const a11y = { role: props.type === "single" ? ("radiogroup" as const) : ("group" as const), "aria-label": label };
  return (
    <ChipGroupContext.Provider value={context}>
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} {...a11y} style={style} contentContainerStyle={styles.row}>
          {children}
        </ScrollView>
      ) : (
        <View {...a11y} style={[styles.row, styles.wrap, style]}>
          {children}
        </View>
      )}
    </ChipGroupContext.Provider>
  );
}

/** `Chip` and `Chip.Group`. */
export const Chip = Object.assign(ChipBase, { Group: ChipGroup });

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 14, borderWidth: 1, alignSelf: "flex-start" },
  label: { fontWeight: "600" },
  remove: { marginRight: -6, width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  cross: { fontSize: 16, lineHeight: 18, fontWeight: "700" },
  disabled: { opacity: 0.4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  wrap: { flexWrap: "wrap" },
});
