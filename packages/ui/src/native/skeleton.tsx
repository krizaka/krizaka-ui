import * as React from "react";
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";

import { useReducedMotion, useTheme } from "./theme";

export type SkeletonProps = {
  /** `text` (a line), `circle` (an avatar), `rect` (a media, a card). */
  shape?: "text" | "circle" | "rect";
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SHAPE = {
  text: { width: "100%", height: 12, radius: 4 },
  circle: { width: 40, height: 40, radius: 9999 },
  rect: { width: "100%", height: 96, radius: 12 },
} as const;

/** A pulsing placeholder the size of what is loading — hidden from screen readers; still when the system reduces motion. */
export function Skeleton({ shape = "text", width, height, style, testID }: SkeletonProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [opacity] = React.useState(() => new Animated.Value(1));
  React.useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.5, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      opacity.setValue(1);
    };
  }, [reduce, opacity]);
  const s = SHAPE[shape];
  const side = shape === "circle" ? (width ?? height ?? s.width) : undefined;
  return (
    <Animated.View
      testID={testID}
      aria-hidden
      style={[
        { width: side ?? width ?? s.width, height: side ?? height ?? s.height, borderRadius: s.radius, backgroundColor: theme.surface3, opacity },
        style,
      ]}
    />
  );
}
