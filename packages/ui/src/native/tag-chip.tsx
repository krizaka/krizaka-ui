// The tags of a workspace on the phone (krizaka-ts#89, `@krizaka/organize`): a name with a colour marker beside it — a name
// of the closed palette (blue · green · amber · red · violet · gray, read on the theme's `tag*` roles: the dot ≥ 3:1, the
// text ≥ 4.5:1) as a dot or a bookmark ribbon. The marker never fills the chip and the name is always written.
import * as React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { TAG_MARKERS } from "../chip/markers";
import { Chip, type ChipProps } from "./chip";
import { type Theme, useTheme } from "./theme";

export { TAG_MARKERS };
/** One of the six names of the closed palette — the web's (`@krizaka/organize` `MARKERS`; a test keeps the two equal). */
export type Marker = (typeof TAG_MARKERS)[number];
export type MarkerShape = "dot" | "ribbon";

const ROLE: Record<Marker, keyof Theme> = { blue: "tagBlue", green: "tagGreen", amber: "tagAmber", red: "tagRed", violet: "tagViolet", gray: "tagGray" };

export type TagMarkerProps = { marker: Marker; shape?: MarkerShape; style?: ViewStyle };

/** The marker alone, decorative: put the tag's name beside it. */
export function TagMarker({ marker, shape = "dot", style }: TagMarkerProps) {
  const { theme } = useTheme();
  const color = theme[ROLE[marker]] as string;
  if (shape === "ribbon") {
    return (
      <View aria-hidden accessible={false} importantForAccessibility="no-hide-descendants" style={style}>
        <Svg width={10} height={14} viewBox="0 0 10 14">
          <Path d="M0 0H10V14L5 10L0 14Z" fill={color} />
        </Svg>
      </View>
    );
  }
  return <View aria-hidden accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.dot, { backgroundColor: color }, style]} />;
}

export type TagChipProps = ChipProps & { marker: Marker; shape?: MarkerShape };

/** A tag: its marker and its name — a `Chip` (alone a toggle, in a group an item, or `removable`). */
export function TagChip({ marker, shape, children, ...props }: TagChipProps) {
  return (
    <Chip {...(props as ChipProps)}>
      <TagMarker marker={marker} shape={shape} />
      {children}
    </Chip>
  );
}

export type MarkerPickerProps = {
  /** The group's accessible name ("Colour of the tag"), passed translated. */
  label: string;
  /** The name of each colour, passed translated. */
  names: Readonly<Record<Marker, string>>;
  value?: Marker;
  defaultValue?: Marker;
  onValueChange?: (value: Marker) => void;
  markers?: readonly Marker[];
  disabled?: boolean;
  style?: ViewStyle;
};

/** Recolours a tag from the closed palette: a radio group of swatches, the chosen one ticked and named. */
export function MarkerPicker({ label, names, value, defaultValue, onValueChange, markers = TAG_MARKERS, disabled, style }: MarkerPickerProps) {
  const { theme, haptic } = useTheme();
  const [own, setOwn] = React.useState<Marker | undefined>(defaultValue);
  const current = value ?? own;
  return (
    <View role="radiogroup" aria-label={label} style={[styles.row, style]}>
      {markers.map((marker) => {
        const on = current === marker;
        const color = theme[ROLE[marker]] as string;
        return (
          <Pressable
            key={marker}
            role="radio"
            aria-checked={on}
            aria-label={names[marker]}
            aria-disabled={disabled}
            disabled={disabled}
            hitSlop={4}
            onPress={() => {
              haptic("selection");
              if (value === undefined) setOwn(marker);
              onValueChange?.(marker);
            }}
            style={[styles.swatch, { borderColor: on ? color : theme.borderDefault, backgroundColor: theme.surface1 }, disabled ? styles.disabled : null]}
          >
            <View style={[styles.dot, styles.big, { backgroundColor: color }]}>
              {on ? (
                <Svg width={12} height={12} viewBox="0 0 24 24" aria-hidden>
                  <Path d="M20 6 9 17l-5-5" stroke={theme.surface0} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
  big: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.4 },
});
