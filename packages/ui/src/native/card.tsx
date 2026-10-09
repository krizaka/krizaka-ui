import * as React from "react";
import { Image, type ImageProps, Pressable, type PressableProps, type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";

import { useTheme } from "./theme";
import { Txt, type TxtProps } from "./txt";

export type CardRootProps = ViewProps & {
  /** `default` (the raised surface) or `elevated` (one step higher, with a shadow). */
  tone?: "default" | "elevated";
  radius?: "md" | "lg" | "xl";
  /**
   * Makes the whole card pressable: a button for screen readers, named by its content (an `aria-label`, if any, must
   * contain the visible title).
   */
  onPress?: PressableProps["onPress"];
};

/** The frame: the theme's surface, a hairline border, rounded corners; `onPress` makes it a pressable card. */
export function CardRoot({ tone = "default", radius = "xl", onPress, style, ...props }: CardRootProps) {
  const { theme, radius: r } = useTheme();
  const frame: StyleProp<ViewStyle> = [
    styles.root,
    {
      backgroundColor: tone === "elevated" ? theme.surface2 : theme.surface1,
      borderColor: theme.borderDefault,
      borderRadius: r[radius],
    },
    tone === "elevated" ? [styles.shadow, { shadowColor: theme.scrimStrong }] : null,
  ];
  if (!onPress) return <View {...props} style={[frame, style]} />;
  return (
    <Pressable
      role="button"
      onPress={onPress}
      {...props}
      style={({ pressed }) => [frame, { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }, style]}
    />
  );
}

const ASPECT = { video: 16 / 9, square: 1, portrait: 3 / 4 } as const;

export type CardMediaProps = ViewProps & { aspect?: keyof typeof ASPECT | "auto" };

/** The media area at the top of a card: a fixed ratio, the `media` role behind (what shows while an image loads). */
export function CardMedia({ aspect = "video", style, ...props }: CardMediaProps) {
  const { theme } = useTheme();
  return <View {...props} style={[styles.media, { backgroundColor: theme.media }, aspect === "auto" ? null : { aspectRatio: ASPECT[aspect] }, style]} />;
}

export type CardImageProps = Omit<ImageProps, "source" | "src"> & {
  src?: string | null;
  /** Shown when there is no image: an icon, an illustration (decorative). */
  fallback?: React.ReactNode;
};

/** The image of a media (it fills it), or its `fallback` when there is none. Decorative unless `alt` is given. */
export function CardImage({ src, fallback, alt, style, ...props }: CardImageProps) {
  const { theme } = useTheme();
  if (!src) {
    return (
      <View aria-hidden style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: theme.accentSoft }]}>
        {fallback}
      </View>
    );
  }
  return <Image accessible={Boolean(alt)} alt={alt} aria-label={alt} resizeMode="cover" {...props} source={{ uri: src }} style={[StyleSheet.absoluteFill, style]} />;
}

const CORNER: Record<"top-left" | "top-right" | "bottom-left" | "bottom-right", ViewStyle> = {
  "top-left": { top: 10, left: 10 },
  "top-right": { top: 10, right: 10 },
  "bottom-left": { bottom: 10, left: 10 },
  "bottom-right": { bottom: 10, right: 10 },
};

export type CardOverlayProps = ViewProps & { corner?: keyof typeof CORNER };

/** What sits on the media (badges, a caption), in a corner. */
export function CardOverlay({ corner = "top-left", style, ...props }: CardOverlayProps) {
  return <View {...props} style={[styles.overlay, CORNER[corner], style]} />;
}

const PADDING = { none: 0, sm: 12, md: 16, lg: 24 } as const;

export type CardBodyProps = ViewProps & { padding?: keyof typeof PADDING };

export function CardBody({ padding = "md", style, ...props }: CardBodyProps) {
  return <View {...props} style={[styles.body, { padding: PADDING[padding] }, style]} />;
}

/** The card's name: one line, a header for screen readers. */
export function CardTitle({ numberOfLines = 1, ...props }: Omit<TxtProps, "variant">) {
  return <Txt variant="label" role="heading" numberOfLines={numberOfLines} {...props} />;
}

export function CardDescription({ numberOfLines = 2, ...props }: Omit<TxtProps, "variant">) {
  return <Txt variant="caption" tone="secondary" numberOfLines={numberOfLines} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  const { theme } = useTheme();
  return <View {...props} style={[styles.footer, { borderTopColor: theme.borderSubtle }, style]} />;
}

/** `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer` — the web parts, on View, Image and Text. */
export const Card = {
  Root: CardRoot,
  Media: CardMedia,
  Image: CardImage,
  Overlay: CardOverlay,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Footer: CardFooter,
};

const styles = StyleSheet.create({
  root: { overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  shadow: { shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  media: { position: "relative", overflow: "hidden", width: "100%" },
  center: { alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", zIndex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  body: { gap: 12 },
  footer: { flexDirection: "row", alignItems: "center", gap: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginTop: "auto" },
});
