import * as React from "react";
import { Animated, Easing, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import type { BrandId } from "../marks/ProductLogo";
import { ProductMark } from "./ProductMark";
import { useReducedMotion, useTheme } from "./theme";

export type SplashHandoffProps = {
  /** The product whose animated mark holds the screen. */
  product: BrandId;
  /** `true` once the first screen is ready to show: the splash dissolves into it. */
  ready: boolean;
  /**
   * Called once the splash is on screen and painted — hide the native splash here
   * (`SplashScreen.hideAsync()` of expo-splash-screen), so the static image dissolves into this one with no flash.
   */
  onShown?: () => void;
  /** Called when the dissolve is over and the splash has left. */
  onDone?: () => void;
  /** The mark's side, in points. Default 96 — the size of the native splash icon, so nothing jumps. */
  size?: number;
  /** The background. Default: the theme's page colour, the one `app.json` gives the native splash. */
  background?: string;
  /** The words a screen reader hears while it waits (“Orazaka is opening”) — passed translated. */
  label: string;
  /** The dissolve, in milliseconds. Default 320; none under reduced motion. */
  duration?: number;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The splash hand-off: the app's first frame is the static native splash; this puts the product's animated mark at the
 * same place and size over the same background, then dissolves it away once `ready`. Render it above the app's root
 * (absolute, full screen) and unmount nothing yourself: it removes its own content when the dissolve ends. Reduced
 * motion: the mark stands still and the splash leaves without fading.
 */
export function SplashHandoff({ product, ready, onShown, onDone, size = 96, background, label, duration = 320, style }: SplashHandoffProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [opacity] = React.useState(() => new Animated.Value(1));
  const [gone, setGone] = React.useState(false);
  React.useEffect(() => {
    if (!ready) return;
    const animation = Animated.timing(opacity, { toValue: 0, duration: reduce ? 0 : duration, easing: Easing.out(Easing.ease), useNativeDriver: true });
    animation.start(({ finished }) => {
      if (finished) {
        setGone(true);
        onDone?.();
      }
    });
    return () => animation.stop();
  }, [ready, reduce, duration, opacity, onDone]);
  if (gone) return null;
  return (
    <Animated.View
      accessible
      role="progressbar"
      aria-label={label}
      aria-busy
      pointerEvents={ready ? "none" : "auto"}
      onLayout={onShown}
      style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: background ?? theme.surface0, opacity }, style]}
    >
      <View>
        <ProductMark id={product} size={size} animated />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({ root: { alignItems: "center", justifyContent: "center", zIndex: 100 } });
