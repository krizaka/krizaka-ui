// The « development version » band on the phone: a thin strip above the screen's header that says this build is not the
// real offer. The same rule as the web (`environmentNotice`): `production` renders nothing. Words are props.
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";

import { environmentNotice } from "../environment-notice/model";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type EnvironmentNoticeProps = Omit<ViewProps, "children"> & {
  /** The deployment's stage, read once by the app. `production` (or `prod`) renders nothing. */
  stage: string | null | undefined;
  /** The headline (« Development version »): the region's accessible name. Passed translated. */
  title: string;
  /** The line (« Data can be reset at any time. Not a commercial offer. »). Passed translated. */
  message: string;
  /** An optional way to learn more; the app opens it in `onLinkPress`. */
  link?: { label: string };
  /** Called when the link is pressed: the app opens the address. */
  onLinkPress?: () => void;
};

/** The web `EnvironmentNotice` on React Native. */
export function EnvironmentNotice({ stage, title, message, link, onLinkPress, style, ...props }: EnvironmentNoticeProps) {
  const { theme } = useTheme();
  const content = environmentNotice({ stage, title, message, link: link ? { label: link.label, href: "" } : undefined });
  if (!content) return null;
  return (
    <View
      role="region"
      aria-label={content.title}
      {...props}
      style={[styles.band, { backgroundColor: theme.warningSoft, borderBottomColor: theme.warning }, style]}
    >
      <View aria-hidden style={[styles.dot, { backgroundColor: theme.warning }]} />
      <Txt variant="caption" style={styles.text}>
        <Txt variant="label" style={styles.title}>
          {content.title}
        </Txt>{" "}
        <Txt variant="caption" tone="secondary">
          {content.message}
        </Txt>
      </Txt>
      {content.link ? (
        <Pressable role="link" accessibilityLabel={content.link.label} onPress={onLinkPress} hitSlop={8}>
          <Txt variant="label" tone="accent">
            {content.link.label}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  band: { minHeight: 36, flexDirection: "row", alignItems: "center", columnGap: 10, paddingHorizontal: 16, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { flex: 1 },
  title: { fontWeight: "600" },
});
