import * as React from "react";
import { Animated, Modal, Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type SheetProps = {
  /** Open (controlled). */
  open: boolean;
  /** Called to close it: the scrim pressed, the back button, a choice made. */
  onOpenChange: (open: boolean) => void;
  /** The title at the top of the sheet (its accessible name), passed translated. */
  title?: string;
  /** The name of the close action read by screen readers ("Close"), passed translated. */
  closeLabel?: string;
  /** The content: a list, details, a form. */
  children: React.ReactNode;
  /** Styles merged last, on the sheet. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A bottom sheet: it rises over a dimmed screen, its grip on top, the scrim closes it. The web `Dialog` on a phone —
 * a choice (`Select`, `Combobox`), the details of a pin on a map, a short form. React Native's `Modal`: focus stays
 * inside, the back button closes it. Rises with the theme's ease; still under reduced motion.
 */
export function Sheet({ open, onOpenChange, title, closeLabel = "Close", children, style }: SheetProps) {
  const { theme, radius, motion } = useTheme();
  const [rise] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    if (open) Animated.timing(rise, { toValue: 1, duration: motion.duration.base * 1.6, useNativeDriver: true }).start();
    else rise.setValue(0);
  }, [open, rise, motion.duration.base]);
  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: rise }]}>
          <Pressable role="button" aria-label={closeLabel} onPress={() => onOpenChange(false)} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]} />
        </Animated.View>
        <Animated.View
          role="dialog"
          aria-label={title}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface1,
              borderColor: theme.borderDefault,
              borderTopLeftRadius: radius["2xl"],
              borderTopRightRadius: radius["2xl"],
              shadowColor: theme.scrimStrong,
              transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }],
              opacity: rise.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
            },
            style,
          ]}
        >
          <View aria-hidden style={[styles.grip, { backgroundColor: theme.borderStrong }]} />
          {title ? (
            <Text role="heading" style={[styles.title, { color: theme.textPrimary }]}>
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: { maxHeight: "85%", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28, gap: 12, borderWidth: StyleSheet.hairlineWidth, shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 12 },
  grip: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, marginBottom: 4 },
  title: { fontSize: 17, fontWeight: "700" },
});
