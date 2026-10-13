import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type VerifiedBadgeProps = {
  /** Its words, read (and shown with `showLabel`): “Verified” — passed translated. */
  label: string;
  /** Show the words beside the seal. Default false: the seal alone, named. */
  showLabel?: boolean;
  /** The seal's side, in points. Default 16. */
  size?: number;
  /** On a photo (white seal on the accent, a ring of the media): `media`. Default `surface`. */
  on?: "surface" | "media";
};

/** A seal that says the person or the account was verified (a selfie check, an ID) — the accent, named in words. */
export function VerifiedBadge({ label, showLabel, size = 16, on = "surface" }: VerifiedBadgeProps) {
  const { theme } = useTheme();
  return (
    <View accessible role="img" aria-label={label} style={styles.row}>
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <Path
          d="M12 2.5l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.8-2.9-.1L12 21.5l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.8-.9-2.8 2.3-1.8.9-2.8 2.9.1z"
          fill={theme.accent}
          stroke={on === "media" ? theme.textOnMedia : "none"}
          strokeWidth={1.2}
        />
        <Path d="M8.3 12.3l2.5 2.5 4.9-5.2" fill="none" stroke={theme.onAccent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      {showLabel ? (
        <Txt variant="caption" tone={on === "media" ? "onMedia" : "accent"} style={styles.text}>
          {label}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row", alignItems: "center", gap: 4 }, text: { fontWeight: "700" } });
