import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Chip } from "./chip";
import { type Marker, TagChip } from "./tag-chip";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type TagOption = {
  value: string;
  label: string;
  /** A tag's colour: a name of the closed palette (`blue · green · amber · red · violet · gray`). Without it, a plain chip. */
  marker?: Marker;
};

export type TagSelectorProps = {
  /** The group's name (“Interests”) — passed translated. */
  label: string;
  /** The tags offered. */
  options: readonly TagOption[];
  /** The tags chosen. */
  value: readonly string[];
  /** Called with the tags chosen. */
  onValueChange: (value: string[]) => void;
  /** The most that can be chosen; the others turn off once reached. */
  max?: number;
  /** The count under the tags: `(n, max) => n + " of " + max`. */
  countLabel?: (count: number, max: number) => string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Interests, languages, what one is looking for: toggle chips with a limit and a count — the others rest once it is reached. */
export function TagSelector({ label, options, value, onValueChange, max, countLabel, style }: TagSelectorProps) {
  const { haptic } = useTheme();
  const full = max !== undefined && value.length >= max;
  return (
    <View style={[styles.root, style]}>
      <View role="group" aria-label={label} style={styles.wrap}>
        {options.map((option) => {
          const on = value.includes(option.value);
          const props = {
            selected: on,
            disabled: !on && full,
            onSelectedChange: (next: boolean) => {
              haptic("selection");
              onValueChange(next ? [...value, option.value] : value.filter((v) => v !== option.value));
            },
          };
          return option.marker ? (
            <TagChip key={option.value} marker={option.marker} {...props}>
              {option.label}
            </TagChip>
          ) : (
            <Chip key={option.value} {...props}>
              {option.label}
            </Chip>
          );
        })}
      </View>
      {max !== undefined && countLabel ? (
        <Txt variant="caption" tone={full ? "accent" : "secondary"} aria-live="polite">
          {countLabel(value.length, max)}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ root: { gap: 8 }, wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 } });
