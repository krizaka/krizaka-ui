// Native — what a screen says when it has nothing to show, when it failed, or when the network is gone: one place for the
// three, so the apps stop inventing a fourth. The words are the app's; the structure (an icon, a title, a reason, the way
// out) and the way it is announced are the platform's.
import * as React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type StateKind = "empty" | "error" | "offline";

export type StateAction = { label: string; onPress: () => void };

export type StateScreenProps = {
  /** `empty` (nothing yet), `error` (it failed) or `offline` (no network). */
  kind: StateKind;
  /** What happened, in a few words (“No notifications yet”). Passed translated. */
  title: string;
  /** Why, and what to do. */
  description?: string;
  /** The way out: Try again, Add one, Open settings. */
  action?: StateAction;
  /** A quieter second way out (Contact support). */
  secondary?: StateAction;
  /** Replaces the icon of the kind. */
  icon?: React.ReactNode;
  /** Fills its parent and centres (default), or sits in the flow of a list (`inline`). */
  inline?: boolean;
  /** For tests. */
  testID?: string;
  /** Styles merged last. */
  style?: ViewStyle;
};

const PATHS: Record<StateKind, string[]> = {
  empty: ["M4 13l2-7h12l2 7", "M4 13v5h16v-5", "M4 13h5l1 2h4l1-2h5"],
  error: ["M12 4 3 20h18L12 4z", "M12 10v4", "M12 17h.01"],
  offline: ["M3 3l18 18", "M9.2 5.6A7 7 0 0 1 19 11a4 4 0 0 1 2 6.5", "M6 19a4 4 0 0 1-.6-7.9", "M7 19h9"],
};

/** The glyph of a kind, drawn in the theme's secondary text. */
function KindIcon({ kind }: { kind: StateKind }) {
  const { theme } = useTheme();
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={kind === "error" ? theme.dangerText : theme.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[kind].map((d) => (
        <Path key={d} d={d} />
      ))}
    </Svg>
  );
}

/** The empty, error and offline screens. An error is announced as an alert, an offline state as a status; an empty one is just there. */
export function StateScreen({ kind, title, description, action, secondary, icon, inline, testID, style }: StateScreenProps) {
  const body = (
    <EmptyState
      icon={icon ?? <KindIcon kind={kind} />}
      title={title}
      description={description}
      action={
        action || secondary ? (
          <>
            {action ? <Button label={action.label} variant="primary" onPress={action.onPress} /> : null}
            {secondary ? <Button label={secondary.label} variant="ghost" onPress={secondary.onPress} /> : null}
          </>
        ) : undefined
      }
    />
  );
  return (
    <View testID={testID} role={kind === "error" ? "alert" : kind === "offline" ? "status" : undefined} data-state={kind} style={[inline ? styles.inline : styles.fill, style]}>
      {body}
    </View>
  );
}

export type OfflineBannerProps = {
  /** “You're offline. Showing what was saved.” Passed translated. */
  label: string;
  /** “Try again”. */
  actionLabel?: string;
  /** Called by the action. */
  onAction?: () => void;
  /** For tests. */
  testID?: string;
};

/** A slim strip at the top of a screen that still shows saved data while the network is gone. */
export function OfflineBanner({ label, actionLabel, onAction, testID }: OfflineBannerProps) {
  const { theme, insets } = useTheme();
  return (
    <View testID={testID} role="status" style={[styles.banner, { backgroundColor: theme.warningSoft, paddingTop: 8 + insets.top }]}>
      <Txt variant="caption" style={styles.bannerText}>
        {label}
      </Txt>
      {actionLabel && onAction ? <Button label={actionLabel} size="sm" variant="ghost" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "center" },
  inline: { alignSelf: "stretch", alignItems: "center" },
  banner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  bannerText: { flex: 1 },
});
