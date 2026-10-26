import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { Mascot, type MascotProps } from "./mascots";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type PermissionStatus = "undetermined" | "granted" | "denied" | "blocked";

export type PermissionPromptProps = {
  /** Where the permission stands (from expo-camera, expo-notifications…): `blocked` = denied and the system will not ask again. */
  status: PermissionStatus;
  /** What it is for, in a few words (“Film your challenge”) — passed translated. */
  title: string;
  /** Why the app needs it, said plainly, before the system asks. */
  description: string;
  /** The button that asks (“Allow the camera”). */
  allowLabel: string;
  /** Asks the system (`requestPermission()` of the module). */
  onAllow: () => void;
  /** The button when the system will not ask again (“Open settings”) — with `onOpenSettings`. */
  settingsLabel?: string;
  /** Opens the app's settings (`Linking.openSettings()`). */
  onOpenSettings?: () => void;
  /** The words when it is blocked (“The camera is off for this app. Turn it on in the settings.”). */
  blockedDescription?: string;
  /** A secondary way out (“Not now”), with `onDismiss`. */
  dismissLabel?: string;
  /** Called by the way out. */
  onDismiss?: () => void;
  /** The bird above (decorative): the falcon watches (camera), the pigeon delivers (notifications). Default falcon. */
  mascot?: MascotProps["bird"];
  /** Rendered once granted: the camera, the screen. Absent: nothing. */
  children?: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Before the system's permission dialog, the app says why: a bird, what it is for, the button that asks — and, once the
 * system will not ask again, the way to the settings. Once granted, its children (the camera, the feature) show.
 */
export function PermissionPrompt({
  status,
  title,
  description,
  allowLabel,
  onAllow,
  settingsLabel,
  onOpenSettings,
  blockedDescription,
  dismissLabel,
  onDismiss,
  mascot = "falcon",
  children,
  style,
}: PermissionPromptProps) {
  const { theme, radius } = useTheme();
  if (status === "granted") return <>{children ?? null}</>;
  const blocked = status === "blocked" || (status === "denied" && Boolean(onOpenSettings));
  return (
    <View style={[styles.root, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle, borderRadius: radius.xl }, style]}>
      <Mascot bird={mascot} mood={blocked ? "error" : "welcome"} size={104} />
      <Txt variant="title" style={styles.centred}>
        {title}
      </Txt>
      <Txt tone="secondary" style={styles.centred}>
        {blocked && blockedDescription ? blockedDescription : description}
      </Txt>
      <View style={styles.actions}>
        {blocked && settingsLabel && onOpenSettings ? (
          <Button label={settingsLabel} variant="primary" onPress={onOpenSettings} />
        ) : (
          <Button label={allowLabel} variant="primary" onPress={onAllow} />
        )}
        {dismissLabel && onDismiss ? <Button label={dismissLabel} variant="ghost" onPress={onDismiss} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 10, padding: 24, borderWidth: StyleSheet.hairlineWidth },
  centred: { textAlign: "center", maxWidth: 340 },
  actions: { marginTop: 8, gap: 8, alignSelf: "stretch" },
});
