import * as React from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";

/** 0 → 1 on the native driver after `delay`, once; already 1 when `animated` is false or the system reduces motion. */
export function useEntrance(animated: boolean, delay = 0, duration = 700) {
  const [value] = React.useState(() => new Animated.Value(animated ? 0 : 1));
  React.useEffect(() => {
    if (!animated) return;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) value.setValue(1);
      else Animated.timing(value, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [animated, delay, duration, value]);
  return value;
}
