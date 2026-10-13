import * as React from "react";
import { AccessibilityInfo, Animated, Easing, Modal, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Avatar } from "./avatar";
import { Button } from "./button";
import { modalName } from "./overlay";
import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type MatchDialogProps = {
  /** Shown (controlled). */
  open: boolean;
  /** Called when it closes. */
  onOpenChange: (open: boolean) => void;
  /** The headline (“It's a match!”) — passed translated, announced. */
  title: string;
  /** A line under it (“You and Elena liked each other”). */
  description?: string;
  /** The two people: their avatar URIs and names. */
  people: readonly [{ src?: string | null; name: string }, { src?: string | null; name: string }];
  /** The main action (“Send a message”). */
  primaryLabel: string;
  /** What it does. */
  onPrimary: () => void;
  /** The way back (“Keep swiping”). */
  secondaryLabel: string;
};

/**
 * The moment two people choose each other — a match, a pair, a deal: full screen in the brand gradient, the two avatars
 * meeting at a heart, a success tick, the next step. Under reduced motion they are simply there.
 */
export function MatchDialog({ open, onOpenChange, title, description, people, primaryLabel, onPrimary, secondaryLabel }: MatchDialogProps) {
  const { theme, haptic } = useTheme();
  const reduce = useReducedMotion();
  const [t] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    if (!open) return;
    haptic("success");
    AccessibilityInfo.announceForAccessibility([title, description].filter(Boolean).join(". "));
    if (reduce) return t.setValue(1);
    t.setValue(0);
    Animated.timing(t, { toValue: 1, duration: 520, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }).start();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- once per opening
  const side = (dir: 1 | -1) => ({ transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [dir * 110, dir * 50] }) }, { rotate: dir === -1 ? "-8deg" : "8deg" }] });
  return (
    <Modal {...modalName(title)} visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)} statusBarTranslucent>
      <View accessibilityViewIsModal style={[styles.screen, { backgroundColor: theme.accent }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.accent2, opacity: 0.55 }]} />
        <Txt variant="display" tone="onAccent" style={styles.title}>
          {title}
        </Txt>
        {description ? (
          <Txt tone="onAccent" style={styles.center}>
            {description}
          </Txt>
        ) : null}
        <View style={styles.pair} aria-hidden>
          <Animated.View style={[styles.photo, side(-1), { borderColor: theme.onAccent }]}>
            <Avatar src={people[0].src} alt="" fallback={people[0].name.charAt(0)} size={112} />
          </Animated.View>
          <Animated.View style={[styles.photo, side(1), { borderColor: theme.onAccent }]}>
            <Avatar src={people[1].src} alt="" fallback={people[1].name.charAt(0)} size={112} />
          </Animated.View>
          <Animated.View style={[styles.heart, { backgroundColor: theme.onAccent, transform: [{ scale: t }] }]}>
            <Svg width={26} height={26} viewBox="0 0 24 24">
              <Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={theme.accent} />
            </Svg>
          </Animated.View>
        </View>
        <View style={styles.actions}>
          <Button
            label={primaryLabel}
            size="lg"
            onPress={() => {
              onOpenChange(false);
              onPrimary();
            }}
          />
          <Pressable role="button" onPress={() => onOpenChange(false)} style={({ pressed }) => [styles.secondary, { borderColor: theme.onAccent, opacity: pressed ? 0.8 : 1 }]}>
            <Txt variant="label" tone="onAccent">
              {secondaryLabel}
            </Txt>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 },
  title: { textAlign: "center", fontSize: 40, lineHeight: 46 },
  center: { textAlign: "center", maxWidth: 300 },
  pair: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 170, marginVertical: 24, width: 300 },
  photo: { position: "absolute", borderWidth: 4, borderRadius: 64 },
  heart: { position: "absolute", bottom: 4, width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  actions: { alignSelf: "stretch", gap: 10, maxWidth: 360, width: "100%" },
  secondary: { minHeight: 48, borderRadius: 999, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
});
