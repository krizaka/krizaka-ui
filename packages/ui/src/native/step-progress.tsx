import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type StepProgressProps = {
  /** The current step, from 1. */
  step: number;
  /** How many steps. */
  total: number;
  /** The position in words: `(n, total) => "Step " + n + " of " + total` — passed translated. */
  label: (step: number, total: number) => string;
  /** The back button's words (“Back”); with `onBack` it shows. */
  backLabel?: string;
  /** Goes back a step. */
  onBack?: () => void;
  /** At the right: a Skip button. */
  trailing?: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The head of a multi-step flow (a sign-up, a profile to fill): back, segments that fill, the position in words. */
export function StepProgress({ step, total, label, backLabel, onBack, trailing, style }: StepProgressProps) {
  const { theme, insets } = useTheme();
  const words = label(step, total);
  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }, style]}>
      <View style={styles.row}>
        {onBack && backLabel ? (
          <Pressable role="button" aria-label={backLabel} hitSlop={10} onPress={onBack} style={styles.back}>
            <Svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
              <Path d="M15 5l-7 7 7 7" stroke={theme.textPrimary} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <View accessible role="progressbar" aria-label={words} aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-valuetext={words} style={styles.bars}>
          {Array.from({ length: total }, (_, i) => (
            <View key={i} style={[styles.bar, { backgroundColor: i < step ? theme.accent : theme.surface3 }]} />
          ))}
        </View>
        <View style={styles.trailing}>{trailing}</View>
      </View>
      <Txt variant="caption" tone="secondary" style={styles.words} aria-hidden>
        {words}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 12, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  bars: { flex: 1, flexDirection: "row", gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  trailing: { minWidth: 40, alignItems: "flex-end" },
  words: { textAlign: "center" },
});
