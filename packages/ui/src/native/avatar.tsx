import * as React from "react";
import { Image, StyleSheet, Text, View, type ViewProps } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop, SvgUri } from "react-native-svg";

import { type DefaultAvatar, defaultAvatarUrl } from "../avatar/default-avatar";
import { useSvgId, useTheme } from "./theme";

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
  /** The picture to show when `src` is missing or fails to load (an image URI); `fallback` still covers the case of no picture at all. */
  fallbackSrc?: string;
  /** The Krizaka default picture (the brand's gradient and a silhouette, one of six tones from `seed`) when there is no photo; `fallbackSrc` wins over it. */
  defaultAvatar?: DefaultAvatar;
  /** A size of the scale, or points. */
  size?: AvatarSize | number;
  /** A dot at the bottom right: `online` (success), `away` (warning), `busy` (danger), `offline` (hollow). */
  presence?: "online" | "away" | "busy" | "offline";
  /** The words of the presence for screen readers (“online”) — passed translated; read after the name. */
  presenceLabel?: string;
  /** A ring around it: `story` (an unseen story, in the accent gradient), `seen` (a story already watched), `live` (danger). */
  ring?: "story" | "seen" | "live";
};

/** A round picture; the initial (or `fallback`) when there is none or it fails to load. */
/** `….svg` (query and fragment ignored) or an SVG data URI. */
export function isSvgUri(uri: string): boolean {
  return /^data:image\/svg\+xml[;,]/i.test(uri) || /\.svg(?:[?#]|$)/i.test(uri);
}

export function AvatarRoot({ src, svg, alt = "", fallback, fallbackSrc, defaultAvatar, size = "md", presence, presenceLabel, ring, style, ...props }: AvatarProps) {
  const { theme } = useTheme();
  const gradient = useSvgId("kz-ring-");
  // The source that failed to load: a new `src` gets its chance.
  const [failedSrcs, setFailedSrcs] = React.useState<readonly string[]>([]);
  const failedSrc = { has: (uri?: string) => Boolean(uri) && failedSrcs.includes(uri as string) };
  const side = typeof size === "number" ? size : SIDE[size];
  const backup = fallbackSrc ?? (defaultAvatar ? defaultAvatarUrl(defaultAvatar, { size: side > 40 ? 512 : 256 }) : undefined);
  const shown = src && !failedSrc.has(src) ? src : backup && !failedSrc.has(backup) ? backup : null;
  const initial = alt.trim().charAt(0).toUpperCase();
  const content = fallback ?? initial;
  const picture = (
    <View
      accessible={Boolean(alt) && !presence && !ring}
      role={alt && !presence && !ring ? "img" : undefined}
      aria-label={alt && !presence && !ring ? alt : undefined}
      {...(presence || ring ? {} : props)}
      style={[styles.root, { width: side, height: side, borderRadius: side / 2, backgroundColor: theme.surface3 }, presence || ring ? null : style]}
    >
      {shown && ((svg && shown === src) || isSvgUri(shown)) ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgUri testID={props.testID ? `${props.testID}.svg` : undefined} uri={shown} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" onError={() => setFailedSrcs((all) => [...all, shown])} />
        </View>
      ) : shown ? (
        <Image testID={props.testID ? `${props.testID}.image` : undefined} source={{ uri: shown }} onError={() => setFailedSrcs((all) => [...all, shown])} resizeMode="cover" style={StyleSheet.absoluteFill} />
      ) : typeof content === "string" ? (
        <Text style={[styles.initial, { color: theme.textSecondary, fontSize: Math.max(9, Math.round(side * 0.4)) }]}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );
  if (!presence && !ring) return picture;
  const gap = ring ? Math.max(2.5, Math.round(side * 0.07)) : 0;
  const outer = side + gap * 4;
  const dot = Math.max(8, Math.round(side * 0.28));
  const dotColor = presence === "online" ? theme.success : presence === "away" ? theme.warning : presence === "busy" ? theme.danger : theme.surface0;
  const name = [alt, presence ? presenceLabel : null].filter(Boolean).join(", ");
  return (
    <View accessible={Boolean(name)} role={name ? "img" : undefined} aria-label={name || undefined} {...props} style={[{ width: outer, height: outer, alignItems: "center", justifyContent: "center" }, style]}>
      {ring ? (
        <Svg width={outer} height={outer} style={StyleSheet.absoluteFill} aria-hidden>
          <Defs>
            <LinearGradient id={gradient} x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={theme.accent} />
              <Stop offset="1" stopColor={theme.accent2} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={outer / 2}
            cy={outer / 2}
            r={outer / 2 - gap / 2 - 0.5}
            fill="none"
            strokeWidth={gap}
            stroke={ring === "story" ? `url(#${gradient})` : ring === "live" ? theme.danger : theme.borderStrong}
          />
        </Svg>
      ) : null}
      {picture}
      {presence ? (
        <View
          aria-hidden
          style={[
            styles.dot,
            { width: dot, height: dot, borderRadius: dot / 2, right: gap * 2, bottom: gap * 2, backgroundColor: dotColor, borderColor: presence === "offline" ? theme.textMuted : theme.surface0 },
          ]}
        />
      ) : null}
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
  dot: { position: "absolute", borderWidth: 2 },
});
