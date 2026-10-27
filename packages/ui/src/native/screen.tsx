import * as React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { PullToRefresh } from "./pull-to-refresh";
import { useTheme } from "./theme";

export type ScreenProps = {
  /** At the top: a `Header`, a `StepProgress` (they keep clear of the status bar themselves). */
  header?: React.ReactNode;
  /** At the bottom: a `TabBar`, a `MessageComposer`, a main `Button` (they keep clear of the home indicator). */
  footer?: React.ReactNode;
  /** The content. */
  children: React.ReactNode;
  /** The content scrolls (default) — or not, for a list that scrolls itself (`List`, `FlatList`). */
  scroll?: boolean;
  /** The content rises with the keyboard (a form, a chat). Default true. */
  keyboard?: boolean;
  /** Pull to refresh: called when the person pulls the content down. Needs `refreshing`. */
  onRefresh?: () => void;
  /** Whether the data is refreshing; keep it true until the new data is there. */
  refreshing?: boolean;
  /** The words of the pull (“Pull to refresh”), shown on iOS — passed translated. */
  refreshLabel?: string;
  /** For tests: the scrolling content. */
  testID?: string;
  /** Padding around the content. Default 16. */
  padding?: number;
  /** The surface: `surface0` (default) or `surface1`. */
  surface?: "surface0" | "surface1";
  /** Styles of the content. */
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * A screen of the app: a header, the content (scrolling, rising with the keyboard), a footer — on the theme's surface,
 * clear of the safe areas through its parts. The base of the templates: app shell, sign-in, profile, feed, chat, settings.
 */
export function Screen({ header, footer, children, scroll = true, keyboard = true, padding = 16, surface = "surface0", contentStyle, onRefresh, refreshing = false, refreshLabel, testID }: ScreenProps) {
  const { theme, insets } = useTheme();
  const body = scroll ? (
    <ScrollView testID={testID} style={styles.flex} contentContainerStyle={[{ padding, paddingTop: header ? padding : padding + insets.top, gap: 16 }, contentStyle]} keyboardShouldPersistTaps="handled" tabIndex={0} refreshControl={onRefresh ? <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} label={refreshLabel} /> : undefined}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { paddingTop: header ? 0 : insets.top }, contentStyle]}>{children}</View>
  );
  const inner = (
    <>
      {header}
      {body}
      {footer}
    </>
  );
  return (
    <View style={[styles.flex, { backgroundColor: theme[surface] }]}>
      {keyboard ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {inner}
        </KeyboardAvoidingView>
      ) : (
        inner
      )}
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
