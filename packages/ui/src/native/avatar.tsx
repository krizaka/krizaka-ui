import * as React from "react";
import { Image, StyleSheet, Text, View, type ViewProps } from "react-native";
import { SvgUri } from "react-native-svg";

import { useTheme } from "./theme";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
const SIDE: Record<AvatarSize, number> = { xs: 20, sm: 32, md: 40, lg: 56, xl: 80 };

export type AvatarProps = Omit<ViewProps, "children"> & {
  /**
   * The image URI; absent, `null` or failing: the fallback. An SVG (`….svg`, `data:image/svg+xml,…` — generated
   * avatars) is drawn by react-native-svg, which React Native's `Image` cannot do; `svg` forces it for a URI without
   * the extension.
   */
  src?: string | null;
  /** Draw `src` as an SVG even when its URI does not say so (an avatar service that answers `image/svg+xml`). */
  svg?: boolean;
  /** The person's name: the image's accessible name and the source of the default initial. */
  alt?: string;
  /** Shown while there is no image or when it fails: default, the first letter of `alt`. */
  fallback?: React.ReactNode;
  /** A size of the scale, or points. */
  size?: AvatarSize | number;
};

/** A round picture; the initial (or `fallback`) when there is none or it fails to load. */
/** `….svg` (query and fragment ignored) or an SVG data URI. */
export function isSvgUri(uri: string): boolean {
  return /^data:image\/svg\+xml[;,]/i.test(uri) || /\.svg(?:[?#]|$)/i.test(uri);
}

export function AvatarRoot({ src, svg, alt = "", fallback, size = "md", style, ...props }: AvatarProps) {
  const { theme } = useTheme();
  // The source that failed to load: a new `src` gets its chance.
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const failed = Boolean(src) && failedSrc === src;
  const side = typeof size === "number" ? size : SIDE[size];
  const initial = alt.trim().charAt(0).toUpperCase();
  const content = fallback ?? initial;
  return (
    <View
      accessible={Boolean(alt)}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      {...props}
      style={[styles.root, { width: side, height: side, borderRadius: side / 2, backgroundColor: theme.surface3 }, style]}
    >
      {src && !failed && (svg || isSvgUri(src)) ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgUri testID={props.testID ? `${props.testID}.svg` : undefined} uri={src} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" onError={() => setFailedSrc(src)} />
        </View>
      ) : src && !failed ? (
        <Image testID={props.testID ? `${props.testID}.image` : undefined} source={{ uri: src }} onError={() => setFailedSrc(src)} resizeMode="cover" style={StyleSheet.absoluteFill} />
      ) : typeof content === "string" ? (
        <Text style={[styles.initial, { color: theme.textSecondary, fontSize: Math.max(9, Math.round(side * 0.4)) }]}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}

export type AvatarGroupProps = ViewProps & {
  /** How many avatars are shown; the rest becomes a `+n` avatar. */
  max?: number;
  /** The size of the avatars (and of the `+n` one). */
  size?: AvatarSize | number;
};

/** Overlapping avatars; past `max`, a `+n` avatar counts the rest. */
export function AvatarGroup({ max, size = "md", style, children, ...props }: AvatarGroupProps) {
  const { theme } = useTheme();
  const items = React.Children.toArray(children);
  const shown = max === undefined ? items : items.slice(0, max);
  const rest = items.length - shown.length;
  const side = typeof size === "number" ? size : SIDE[size];
  const ring = { borderWidth: 2, borderColor: theme.surface0, marginLeft: -side / 5 };
  return (
    <View {...props} style={[styles.group, { paddingLeft: side / 5 }, style]}>
      {shown.map((child, i) => (
        <View key={i} style={[ring, { borderRadius: side }]}>
          {React.isValidElement<AvatarProps>(child) ? React.cloneElement(child, { size }) : child}
        </View>
      ))}
      {rest > 0 ? (
        <View style={[ring, { borderRadius: side }]}>
          <AvatarRoot size={size} fallback={`+${rest}`} />
        </View>
      ) : null}
    </View>
  );
}

/** `Avatar` (an image with a fallback) and `Avatar.Group`. */
export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });

const styles = StyleSheet.create({
  root: { overflow: "hidden", alignItems: "center", justifyContent: "center" },
  initial: { fontWeight: "700" },
  group: { flexDirection: "row", alignItems: "center" },
});
