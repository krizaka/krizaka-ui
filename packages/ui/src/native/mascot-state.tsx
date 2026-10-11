import * as React from "react";
import { AccessibilityInfo, Animated, Easing, StyleSheet, View, type ViewProps } from "react-native";

import type { MascotBird, MascotMood, MascotTone } from "../mascots/geometry";
import { Mascot } from "./mascots";
import { Txt } from "./txt";

const SIZE = { sm: 64, md: 96, lg: 128 } as const;

export type MascotStateProps = Omit<ViewProps, "children"> & {
  /** The bird whose job the moment is about: `owl` (documents), `falcon` (security), `duck` (code), `flamingo` (answers, payments), `pigeon` (delivery). */
  bird?: MascotBird;
  /** The moment: `empty` (default), `thinking`, `success`, `error`, `welcome`. */
  mood?: MascotMood;
  /** What happened, in a few words. */
  title: string;
  /** Why, or what comes next. */
  description?: string;
  /** What to do next: a Button. */
  action?: React.ReactNode;
  /** The bird's size: `sm` 64, `md` 96 (default), `lg` 128 points. */
  size?: keyof typeof SIZE;
  /** `stacked` (default): the bird above centred words. `inline`: the bird beside the words. */
  layout?: "stacked" | "inline";
  /** `brand` (default): the theme's accent. `own`: the bird's colours of the Krizaka story. */
  tone?: MascotTone;
  /** The bird's bob and a short fade-in; still when the system reduces motion. */
  animated?: boolean;
};

/** A fade-in on the native driver, skipped when `animated` is false or the system reduces motion. */
function useArrival(animated: boolean) {
  const [value] = React.useState(() => new Animated.Value(animated ? 0 : 1));
  React.useEffect(() => {
    if (!animated) return;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) value.setValue(1);
      else Animated.timing(value, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [animated, value]);
  return value;
}

/**
 * A moment told by a bird of the flock — an empty list, a long wait, a success, an error, a welcome — for React Native.
 * Announced: `alert` for an error, a polite live region otherwise (`busy` while thinking).
 */
export function MascotState({ bird = "owl", mood = "empty", title, description, action, size = "md", layout = "stacked", tone, animated = true, style, ...props }: MascotStateProps) {
  const opacity = useArrival(animated);
  const inline = layout === "inline";
  return (
    <Animated.View
      role={mood === "error" ? "alert" : "status"}
      accessibilityLiveRegion={mood === "error" ? "assertive" : "polite"}
      aria-busy={mood === "thinking" ? true : undefined}
      {...props}
      style={[inline ? styles.inline : styles.stacked, { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }, style]}
    >
      <Mascot bird={bird} mood={mood} tone={tone} size={SIZE[size]} animated={animated} />
      <View style={inline ? styles.wordsInline : styles.words}>
        <Txt variant="label" role="heading" style={inline ? null : styles.center}>
          {title}
        </Txt>
        {description ? (
          <Txt tone="secondary" style={inline ? null : styles.center}>
            {description}
          </Txt>
        ) : null}
        {action ? <View style={[styles.action, inline ? null : styles.actionCentred]}>{action}</View> : null}
      </View>
    </Animated.View>
  );
}

type PresetProps = Omit<MascotStateProps, "mood">;

/** It failed: what went wrong and what to do. */
export const ErrorState = (props: PresetProps) => <MascotState mood="error" {...props} />;
/** It is done: a payment, a verification, a delivery. */
export const SuccessState = (props: PresetProps) => <MascotState mood="success" {...props} />;
/** A long task runs: what runs, beside the bird. */
export const LoadingState = (props: PresetProps) => <MascotState mood="thinking" {...props} />;
/** A first screen, an onboarding step. */
export const WelcomeState = (props: PresetProps) => <MascotState mood="welcome" {...props} />;

const styles = StyleSheet.create({
  stacked: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 40, paddingHorizontal: 24 },
  inline: { flexDirection: "row", alignItems: "center", gap: 16 },
  words: { alignItems: "center", gap: 6 },
  wordsInline: { flex: 1, gap: 4 },
  center: { textAlign: "center", maxWidth: 360 },
  action: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionCentred: { justifyContent: "center" },
});
